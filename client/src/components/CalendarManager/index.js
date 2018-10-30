import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../redux/actions/";

import Loader from "../Notifications/Loader";
import CalendarPicker from "../CalendarPicker";

import "./styles/";

class CalendarManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      calendars: props.calendars.map(calObj => {
        return { ...calObj, tempName: calObj.calendarName };
      }),
      activeCalendarIndex: props.activeCalendarIndex,
      unsavedChange: false,
      inviteEmail: ""
    };
  }
  componentDidMount() {
    this._ismounted = true;

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.close(); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);

    this.getCalendarUsers(this.state.activeCalendarIndex);
    this.getCalendarAccounts(this.state.activeCalendarIndex);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  getCalendarAccounts = index => {
    const { calendars } = this.state;

    axios.get("/api/calendar/accounts/" + calendars[index]._id).then(res => {
      const { success, err, message, accounts } = res.data;
      if (!success || err || !accounts) {
        console.log(
          "Retrieving calendar accounts from database was unsuccessful."
        );
        console.log(err);
        console.log(message);
      } else {
        this.handleCalendarChange("accounts", accounts, index);
      }
    });
  };

  getCalendarUsers = index => {
    const { calendars } = this.state;

    axios.get("/api/calendar/users/" + calendars[index]._id).then(res => {
      const { success, err, message, users } = res.data;
      if (!success || err || !users) {
        console.log(
          "Retrieving calendar users from database was unsuccessful."
        );
        console.log(err);
        console.log(message);
      } else {
        const adminIndex = users.findIndex(
          userObj => userObj._id == calendars[index].adminID
        );
        if (adminIndex !== -1 && adminIndex !== 0) {
          // swap admin to the top of the array so it always gets displayed first
          const temp = users[0];
          users[0] = users[adminIndex];
          users[adminIndex] = temp;
        }
        users[0].calendarAdmin = true;
        this.handleCalendarChange("users", users, index);
      }
    });
  };

  handleCalendarChange = (key, value, calendarIndex) => {
    this.setState(prevState => {
      return {
        calendars: [
          ...prevState.calendars.slice(0, calendarIndex),
          { ...prevState.calendars[calendarIndex], [key]: value },
          ...prevState.calendars.slice(calendarIndex + 1)
        ]
      };
    });
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  inviteUser = index => {
    const { inviteEmail, calendars } = this.state;
    const calendar = calendars[index];
    this.setState({ saving: true });
    axios
      .post("/api/calendar/invite", {
        email: inviteEmail,
        calendarID: calendar._id
      })
      .then(res => {
        this.setState({ saving: false });
        const { success, err, message, emailsInvited } = res.data;
        if (!success || err) {
          console.log(err);
          console.log(message);
          this.props.notify("danger", "Invite Failed", message);
        } else {
          this.props.notify(
            "success",
            "Invite Successful",
            `${inviteEmail} has been invited to join calendar ${
              calendar.calendarName
            }.`
          );
          this.setState(prevState => {
            return {
              inviteEmail: "",
              calendars: [
                ...prevState.calendars.slice(0, index),
                { ...calendar, emailsInvited },
                ...prevState.calendars.slice(index + 1)
              ]
            };
          });
        }
      });
  };

  saveCalendarName = (index, name) => {
    const { calendars } = this.state;
    if (name && name.length > 0) {
      axios
        .post("/api/calendar/rename", {
          calendarID: calendars[index]._id,
          name
        })
        .then(res => {
          const { success, err, message, calendar } = res.data;
          if (!success) {
            console.log(err);
            console.log(message);
          } else {
            this.setState(prevState => {
              return {
                calendars: [
                  ...prevState.calendars.slice(0, index),
                  {
                    ...prevState.calendars[index],
                    calendarName: calendar.calendarName
                  },
                  ...prevState.calendars.slice(index + 1)
                ]
              };
            });
          }
        });
    }
  };

  presentActiveCalendar = () => {
    const {
      calendars,
      activeCalendarIndex,
      unsavedChange,
      inviteEmail
    } = this.state;
    const calendar = calendars[activeCalendarIndex];

    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    const isAdmin = calendar.adminID == userID;

    let userDivs = undefined;
    if (calendar.users) {
      userDivs = calendar.users.map((userObj, index) => {
        return (
          <div className="calendar-user-card" key={`user${index}`}>
            <div className="user-name-and-email">
              <div className="user-name">{userObj.fullName}</div>
              <div className="user-email">{userObj.email}</div>
            </div>
            {isAdmin &&
              !userObj.calendarAdmin && (
                <div className="user-icons">
                  <div
                    className="user-delete"
                    onClick={() =>
                      console.log(
                        `remove user ${userObj.fullName} from calendar`
                      )
                    }
                  >
                    X
                  </div>
                </div>
              )}
          </div>
        );
      });
    }

    return (
      <div className="manage-calendar-container">
        <div className="calendar-users-container pa16">
          <div className="calendar-users-header">Users</div>
          {userDivs}
          <div className="invite-container">
            <input
              type="text"
              className="invite-input pa8 mb16 round"
              placeholder="usertoinvite@example.com"
              onChange={event => {
                this.handleChange("inviteEmail", event.target.value);
              }}
              value={inviteEmail}
            />
            <button
              className="invite-submit"
              onClick={e => {
                e.preventDefault();
                this.inviteUser(activeCalendarIndex);
              }}
            >
              Invite
            </button>
          </div>
        </div>
        <div className="calendar-info-and-accounts-container pa16">
          <div className="calendar-info-container pa16">
            <div className="calendar-info-label mx8 mb4">Calendar Name</div>
            <input
              type="text"
              className="calendar-info-input pa8 mb16 round"
              placeholder="Calendar Name"
              onChange={event => {
                this.setState({ unsavedChange: true });
                this.handleCalendarChange(
                  "tempName",
                  event.target.value,
                  activeCalendarIndex
                );
              }}
              value={calendar.tempName}
            />
            {unsavedChange && (
              <button
                className="save-button pa8 round"
                onClick={e => {
                  e.preventDefault();
                  this.saveCalendarName(activeCalendarIndex, calendar.tempName);
                }}
              >
                Save
              </button>
            )}
          </div>
          <div className="calendar-accounts-container pa16">accounts</div>
        </div>
      </div>
    );
  };

  render() {
    const { saving, calendars, activeCalendarIndex } = this.state;

    return (
      <div className="modal" onClick={() => this.props.close()}>
        <div
          className="large-modal common-transition"
          onClick={e => e.stopPropagation()}
        >
          <CalendarPicker
            calendars={calendars}
            activeCalendarIndex={activeCalendarIndex}
            calendarManager={true}
            updateActiveCalendar={index => {
              this.setState(
                { activeCalendarIndex: index, unsavedChange: false },
                () => {
                  this.handleCalendarChange(
                    "tempName",
                    calendars[index].calendarName,
                    index
                  );
                  this.getCalendarUsers(index);
                  this.getCalendarAccounts(index);
                }
              );
            }}
          />
          {this.presentActiveCalendar()}
        </div>
        {saving && <Loader />}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction
    },
    dispatch
  );
}
function mapStateToProps(state) {
  return {
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarManager);
