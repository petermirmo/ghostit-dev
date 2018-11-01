import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../redux/actions/";

import { getArrayIndexWithHint } from "../../componentFunctions";

import Loader from "../Notifications/Loader";
import CalendarPicker from "../CalendarPicker";
import ConfirmAlert from "../Notifications/ConfirmAlert";

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
    return;
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
      const { success, err, message, users, userIDs } = res.data;
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
        users[0].fullName += " (Admin)";
        this.handleCalendarChange("users", users, index);
        this.handleCalendarChange("userIDs", userIDs, index);
      }
    });
  };

  handleCalendarChange = (key, value, calendarIndex) => {
    if (!this._ismounted) return;
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
    if (!this._ismounted) return;
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

  removeUserFromCalendar = (userIndex, calendarIndex) => {
    const { calendars } = this.state;
    const calendar = calendars[calendarIndex];
    const calendarID = calendar._id;
    const userID = calendar.userIDs[userIndex];

    axios
      .post("/api/calendar/user/remove", {
        userID,
        calendarID
      })
      .then(res => {
        const { success, err, message } = res.data;
        if (!success) {
          console.log(err);
          if (message)
            this.props.notify("danger", "Remove User Failed", message);
        } else {
          this.getCalendarUsers(calendarIndex);
          this.props.notify(
            "success",
            "User Removed",
            `User successfully removed from calendar.`,
            3500
          );
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
                unsavedChange: false,
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

  deleteCalendarClicked = () => {
    const { calendars, activeCalendarIndex } = this.state;
    if (calendars[activeCalendarIndex].userIDs.length > 1) {
      alert(
        `You must remove all other users from the calendar before you can delete it.`
      );
    } else {
      this.setState({ deleteCalendarPrompt: true });
    }
  };

  deleteCalendar = index => {
    const { calendars } = this.state;
    this.setState({ saving: true });
    axios
      .post("/api/calendar/delete", { calendarID: calendars[index]._id })
      .then(res => {
        this.setState({ saving: false });
        const { success, err, message, newCalendar } = res.data;
        // newCalendar will only exist if the calendar being deleted is the user's personal calendar.
        // personal calendars are calendars that contain all posts created before there were calendars.
        // we don't want to delete those posts so we make sure the user always has 1 calendar that shows them.
        // this will make sure that the user still has a personal calendar
        if (!success) {
          console.log(err);
          this.props.notify("danger", "Delete Calendar Failed", message);
        } else {
          this.props.notify(
            "success",
            "Calendar Deleted",
            message ? message : `Calendar successfully deleted.`
          );
          if (newCalendar) {
            this.setState(prevState => {
              return {
                calendars: [
                  ...prevState.calendars.slice(0, index),
                  ...prevState.calendars.slice(index + 1),
                  newCalendar
                ]
              };
            });
          } else {
            this.setState(prevState => {
              return {
                activeCalendarIndex: index - 1,
                calendars: [
                  ...prevState.calendars.slice(0, index),
                  ...prevState.calendars.slice(index + 1)
                ]
              };
            });
          }
        }
      });
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
                      this.setState({
                        removeUserPrompt: true,
                        removeUserObj: {
                          userIndex: index,
                          calendarIndex: activeCalendarIndex
                        }
                      })
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
            {calendar.personalCalendar && (
              <div className="personal-calendar-container">
                Personal Calendar
                <div
                  className="personal-calendar-tooltip"
                  title={
                    "What is a personal calendar?\n" +
                    "Posts created before customizable calendars were " +
                    "introduced do not have a specific calendar that they are associated with. " +
                    "Each user account has one personal calendar and any old posts (posts without a calendar)" +
                    " by the user will be displayed in that calendar.\n\n" +
                    "Can you rename a personal calendar?\n" +
                    "Yes. You can name it anything you'd like. You can tell which calendar" +
                    " is your personal calendar by whether or not this label is present.\n\n" +
                    "Can you invite other users to a personal calendar?\n" +
                    "Yes. Inviting users works the same way as any other calendar.\n\n" +
                    "What happens when you delete a personal calendar?\n" +
                    "Like normal, all of the posts that were scheduled specifically within the calendar being deleted will also be deleted. " +
                    'However, none of the "old posts" will be deleted and a new personal calendar will be created for you automatically. ' +
                    'All of the "old posts" will be displayed on the new personal calendar.\n\n' +
                    "Can I designate a different calendar as my personal calendar?\n" +
                    "Not yet, but if it's something you want to do, please let us know so we can add that functionality.\n\n" +
                    `Why is it called "personal calendar"?\n` +
                    `I don't know what else to call it.`
                  }
                >
                  <FontAwesomeIcon icon={faQuestionCircle} size="1x" />
                </div>
              </div>
            )}
          </div>
          <div className="calendar-accounts-container pa16">accounts</div>
        </div>
      </div>
    );
  };

  render() {
    const {
      saving,
      calendars,
      activeCalendarIndex,
      deleteCalendarPrompt,
      removeUserPrompt,
      removeUserObj
    } = this.state;

    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    const isAdmin = calendars[activeCalendarIndex].adminID == userID;

    return (
      <div className="modal" onClick={() => this.props.close()}>
        <div
          className="large-modal common-transition"
          onClick={e => e.stopPropagation()}
        >
          <div className="close-container" title={"Close Calendar Manager"}>
            <FontAwesomeIcon
              className="close-special"
              icon={faTimes}
              size="2x"
              onClick={() => this.props.close()}
            />
          </div>
          <div className="trash-picker-container">
            {isAdmin && (
              <div
                title={
                  "Delete Calendar. Only calendars with one user can be deleted."
                }
              >
                <FontAwesomeIcon
                  className="close-special delete-calendar"
                  icon={faTrash}
                  size="1x"
                  onClick={this.deleteCalendarClicked}
                />
              </div>
            )}
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
          </div>
          {this.presentActiveCalendar()}
          {deleteCalendarPrompt && (
            <ConfirmAlert
              close={() => this.setState({ deleteCalendarPrompt: false })}
              title="Delete Calendar"
              message="Are you sure you want to delete this Calendar? All posts within the calendar will be deleted as well."
              extraConfirmationMessage={`Type "DELETE" in the text box and click Delete.`}
              extraConfirmationKey={"DELETE"}
              callback={response => {
                this.setState({ deleteCalendarPrompt: false });
                if (response) this.deleteCalendar(activeCalendarIndex);
              }}
              type="delete-calendar"
            />
          )}
          {removeUserPrompt && (
            <ConfirmAlert
              close={() =>
                this.setState({
                  removeUserPrompt: false,
                  removeUserObj: undefined
                })
              }
              title="Remove User"
              message="Are you sure you want to remove this user from the calendar?"
              callback={response => {
                this.setState({
                  removeUserPrompt: false,
                  removeUserObj: undefined
                });
                if (response)
                  this.removeUserFromCalendar(
                    removeUserObj.userIndex,
                    removeUserObj.calendarIndex
                  );
              }}
              type="delete-calendar"
            />
          )}
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
