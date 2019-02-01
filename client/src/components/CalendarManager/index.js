import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";
import faSignOutAlt from "@fortawesome/fontawesome-free-solid/faSignOutAlt";
import faUserTie from "@fortawesome/fontawesome-free-solid/faUserTie";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../redux/actions/";

import {
  getPostIcon,
  getPostColor,
  capitolizeFirstChar,
  capitolizeWordsInString,
  getArrayIndexWithHint
} from "../../componentFunctions";

import Loader from "../Notifications/Loader";
import CalendarPicker from "../CalendarPicker";
import ConfirmAlert from "../Notifications/ConfirmAlert";

import "./style.css";

class CalendarManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      calendars: props.calendars.map(calObj => {
        return { ...calObj, tempName: calObj.calendarName };
      }),
      activeCalendarIndex: props.activeCalendarIndex,
      defaultCalendarID: props.defaultCalendarID,
      unsavedChange: false,
      removeUserPrompt: false,
      unlinkAccountPrompt: false,
      leaveCalendarPrompt: false,
      deleteCalendarPrompt: false,
      promoteUserPrompt: false,
      confirmAlert: {},
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

    axios
      .get("/api/calendar/accounts/extra/" + calendars[index]._id)
      .then(res => {
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
          let temp = users[0];
          users[0] = users[adminIndex];
          users[adminIndex] = temp;
        }
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

    if (!/\S/.test(inviteEmail)) {
      // inviteEmail is only whitespace so don't allow this to be invited
      alert("Please type a valid email into the invite text box.");
      return;
    }
    this.setState({ saving: true });
    axios
      .post("/api/calendar/invite", {
        email: inviteEmail.toLowerCase(),
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

  createNewCalendar = name => {
    axios.post("/api/calendars/new", { name }).then(res => {
      const { success, newCalendar, message } = res.data;
      if (success) {
        this.setState(prevState => {
          return {
            calendars: [...prevState.calendars, newCalendar]
          };
        });
      } else {
        this.props.notify("danger", "", message);
      }
    });
  };

  promoteUser = (userIndex, calendarIndex) => {
    const { calendars } = this.state;
    const calendar = calendars[calendarIndex];
    const userID = calendar.users[userIndex]._id;

    axios
      .post("/api/calendar/user/promote", { userID, calendarID: calendar._id })
      .then(res => {
        const { success, err, message } = res.data;
        if (!success) {
          console.log(err);
          this.props.notify("danger", "Promote User Failed", message);
        } else {
          this.setState(
            prevState => {
              return {
                calendars: [
                  ...prevState.calendars.slice(0, calendarIndex),
                  { ...prevState.calendars[calendarIndex], adminID: userID },
                  ...prevState.calendars.slice(calendarIndex + 1)
                ]
              };
            },
            () => this.getCalendarUsers(calendarIndex)
          );
          this.props.notify("success", "User Promoted", message);
        }
      });
  };

  removeUserFromCalendar = (userIndex, calendarIndex) => {
    const { calendars } = this.state;
    const calendar = calendars[calendarIndex];
    const calendarID = calendar._id;
    const userID = calendar.users[userIndex]._id;

    axios
      .post("/api/calendar/user/remove", {
        userID,
        calendarID
      })
      .then(res => {
        const { success, err, message } = res.data;
        if (!success) {
          console.log(err);
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
    if (!/\S/.test(name)) {
      alert("Name must not be empty.");
      return;
    }
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

  leaveCalendarClicked = () => {
    this.setState({ leaveCalendarPrompt: true });
  };

  leaveCalendar = index => {
    const { calendars } = this.state;
    this.setState({ saving: true });
    axios
      .post("/api/calendar/leave", { calendarID: calendars[index]._id })
      .then(res => {
        this.setState({ saving: false });
        const { success, err, message, newCalendar } = res.data;
        if (!success) {
          console.log(err);
          this.props.notify("danger", "Failed to Leave Calendar", message);
        } else {
          this.props.notify("success", "Calendar Left", message);
          if (newCalendar) {
            // deleted last calendar so the backend created a new one for the user
            this.setState(
              { activeCalendarIndex: 0, calendars: [newCalendar] },
              () => this.updateActiveCalendar(0)
            );
          } else {
            let new_index = index;
            if (calendars.length - 1 <= index) new_index = index - 1;

            this.setState(
              prevState => {
                return {
                  activeCalendarIndex: new_index,
                  calendars: [
                    ...prevState.calendars.slice(0, index),
                    ...prevState.calendars.slice(index + 1)
                  ]
                };
              },
              () => {
                this.updateActiveCalendar(new_index);
              }
            );
          }
        }
      });
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
            // deleted last calendar so the backend created a new one for the user
            this.setState(
              { activeCalendarIndex: 0, calendars: [newCalendar] },
              () => this.updateActiveCalendar(0)
            );
          } else {
            let new_index = index;
            if (calendars.length - 1 <= index) new_index = index - 1;

            this.setState(
              prevState => {
                return {
                  activeCalendarIndex: new_index,
                  calendars: [
                    ...prevState.calendars.slice(0, index),
                    ...prevState.calendars.slice(index + 1)
                  ]
                };
              },
              () => {
                this.updateActiveCalendar(new_index);
              }
            );
          }
        }
      });
  };

  setDefaultCalendar = calendarIndex => {
    const { calendars } = this.state;
    axios
      .post("/api/calendar/setDefault", {
        calendarID: calendars[calendarIndex]._id
      })
      .then(res => {
        const { success, err, message } = res.data;
        if (!success) {
          console.log(err);
          console.log(message);
          this.props.notify("danger", "Set Default Calendar Failed", message);
        } else {
          this.props.notify("success", "Success", message);
          this.setState({ defaultCalendarID: calendars[calendarIndex]._id });
        }
      });
  };

  updateActiveCalendar = index => {
    const { calendars } = this.state;
    this.setState({ activeCalendarIndex: index, unsavedChange: false }, () => {
      this.handleCalendarChange(
        "tempName",
        calendars[index].calendarName,
        index
      );
      this.getCalendarUsers(index);
      this.getCalendarAccounts(index);
    });
  };

  unlinkSocialAccount = accountID => {
    const { calendars, activeCalendarIndex } = this.state;
    const calendarID = calendars[activeCalendarIndex]._id;
    axios
      .post("/api/calendar/account/delete", { accountID, calendarID })
      .then(res => {
        const { success, err, message } = res.data;
        if (!success) {
          console.log(err);
          this.props.notify("danger", "Failed to Remove Account", message);
        } else {
          const calendar = calendars[activeCalendarIndex];
          const accountIndex = calendar.accounts.findIndex(
            actObj => actObj._id.toString() === accountID.toString()
          );
          if (accountIndex === -1) {
            this.props.notify(
              "info",
              "Something May Have Gone Wrong",
              "Reload page to make sure account was removed properly."
            );
          } else {
            this.props.notify(
              "success",
              "Successfully Removed Account",
              message
            );
            this.setState(prevState => {
              return {
                calendars: [
                  ...prevState.calendars.slice(0, activeCalendarIndex),
                  {
                    ...prevState.calendars[activeCalendarIndex],
                    accounts: [
                      ...prevState.calendars[
                        activeCalendarIndex
                      ].accounts.slice(0, accountIndex),
                      ...prevState.calendars[
                        activeCalendarIndex
                      ].accounts.slice(accountIndex + 1)
                    ]
                  },
                  ...prevState.calendars.slice(activeCalendarIndex + 1)
                ]
              };
            });
          }
        }
      });
  };

  presentActiveCalendar = (isDefaultCalendar, isAdmin, calendar) => {
    const {
      calendars,
      activeCalendarIndex,
      unsavedChange,
      inviteEmail,
      showUserEmails,
      showAccountNames
    } = this.state;

    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    let userDivs;
    if (calendar.users) {
      userDivs = calendar.users.map((userObj, index) => {
        return (
          <div className="list-item" key={`user${index}`}>
            <div className="list-info">
              <div className="flex column flex1">
                <div className="flex1">
                  {capitolizeWordsInString(userObj.fullName)}
                  {userObj._id.toString() === userID.toString()
                    ? " (Admin)"
                    : ""}
                </div>
                <div className="flex1">{userObj.email}</div>
              </div>
              {isAdmin && userObj._id.toString() !== userID.toString() && (
                <div className="flex hc vc">
                  <div title="Remove User">
                    <FontAwesomeIcon
                      className="color-red button"
                      icon={faTrash}
                      onClick={e => {
                        e.stopPropagation();
                        this.setState({
                          removeUserPrompt: true,
                          removeUserObj: {
                            userIndex: index,
                            calendarIndex: activeCalendarIndex
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      });
    }

    let accountDivs = undefined;
    if (calendar.accounts) {
      accountDivs = calendar.accounts.map((account, index) => {
        let title = account.username;
        if (!title) {
          if (account.givenName && account.familyName)
            title = `${account.givenName} ${account.familyName}`;
          else title = account.givenName;
        }
        return (
          <div className="list-item" key={`account${index}`}>
            <div className="list-info">
              <FontAwesomeIcon
                icon={getPostIcon(account.socialType)}
                size="3x"
                color={getPostColor(account.socialType)}
              />
              <div className="flex column flex1 ml8">
                <div className="flex1">{capitolizeWordsInString(title)}</div>
                <div className="flex1">
                  {capitolizeFirstChar(account.accountType)}
                </div>
              </div>
              {(isAdmin || account.userID.toString() === userID.toString()) && (
                <div
                  title="Remove Account From Calendar"
                  className="flex hc vc"
                >
                  <FontAwesomeIcon
                    className="color-red button"
                    icon={faTrash}
                    onClick={e => {
                      e.stopPropagation();
                      this.setState({
                        unlinkAccountPrompt: true,
                        unLinkAccountID: account._id
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      });
    }

    return (
      <div className="flex column flex1 vc">
        <div className="grid-two-columns py8 border-bottom width100">
          <div className="flex vc hc mx16">
            <div className="label">Rename Calendar: </div>
            <input
              type="text"
              className="regular-input ml16"
              placeholder="Calendar Name"
              onChange={event => {
                this.setState({ unsavedChange: true });
                this.handleCalendarChange(
                  "tempName",
                  event.target.value,
                  activeCalendarIndex
                );
              }}
              value={calendar.tempName ? calendar.tempName : ""}
            />
            {unsavedChange && (
              <button
                className="regular-button ml16"
                onClick={e => {
                  e.preventDefault();
                  this.saveCalendarName(activeCalendarIndex, calendar.tempName);
                }}
              >
                Save
              </button>
            )}
          </div>
          <div className="flex hc vc">
            <input
              type="text"
              className="regular-input mx16"
              placeholder="Invite user to calendar"
              onChange={event => {
                this.handleChange("inviteEmail", event.target.value);
              }}
              value={inviteEmail}
            />
            {inviteEmail !== "" && (
              <button
                className="regular-button mr16"
                onClick={e => {
                  e.preventDefault();
                  this.inviteUser(activeCalendarIndex);
                }}
              >
                Invite
              </button>
            )}
          </div>
        </div>
        <div className="flex flex1 width100">
          <div className="list-container flex1 pa16 light-scrollbar border-right">
            <div className="flex row">
              <h4 className="mx16">Social Accounts Linked To Calendar</h4>
              <div
                className="add-accounts-tooltip"
                title="To link social accounts from your user account to a calendar, create a new post and click on the account you want to link."
              >
                <FontAwesomeIcon icon={faQuestionCircle} size="1x" />
              </div>
            </div>
            {accountDivs}
          </div>
          <div className="list-container flex1 pa16 light-scrollbar">
            <h4 className="mx16">Calendar Users</h4>
            {userDivs}
          </div>
        </div>
        {!isDefaultCalendar && (
          <button
            className="regular-button my8"
            onClick={e => {
              e.preventDefault();
              this.setDefaultCalendar(activeCalendarIndex);
            }}
          >
            Set As Default Calendar
          </button>
        )}
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
      promoteUserPrompt,
      leaveCalendarPrompt,
      unlinkAccountPrompt,
      promoteUserObj,
      removeUserObj,
      unLinkAccountID,
      defaultCalendarID
    } = this.state;
    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    const calendar = calendars[activeCalendarIndex];
    const isDefaultCalendar =
      calendar._id.toString() === defaultCalendarID.toString();
    const isAdmin = calendars[activeCalendarIndex].adminID == userID;

    return (
      <div className="simple-container flex1">
        <div className="close-container" title="Close Calendar Manager">
          <FontAwesomeIcon
            className="close-special"
            icon={faTimes}
            size="2x"
            onClick={() => this.props.close()}
          />
        </div>
        <div className="flex hc vc">
          <CalendarPicker
            calendars={calendars}
            activeCalendarIndex={activeCalendarIndex}
            calendarManager={true}
            createNewCalendar={this.createNewCalendar}
            updateActiveCalendar={this.updateActiveCalendar}
          />
          {isAdmin && (
            <div title="Delete Calendar. Only calendars with one user can be deleted.">
              <FontAwesomeIcon
                className="color-red button pa4 ml8"
                icon={faTrash}
                onClick={this.deleteCalendarClicked}
              />
            </div>
          )}
          {!isAdmin && (
            <div title="Leave Calendar">
              <FontAwesomeIcon
                className="close-special button pa4 ml8"
                icon={faSignOutAlt}
                flip="horizontal"
                onClick={this.leaveCalendarClicked}
              />
            </div>
          )}
        </div>
        {this.presentActiveCalendar(isDefaultCalendar, isAdmin, calendar)}
        {leaveCalendarPrompt && (
          <ConfirmAlert
            close={() => this.setState({ leaveCalendarPrompt: false })}
            title="Leave Calendar"
            message="Are you sure you want to leave this calendar? Any accounts you linked or posts you scheduled WILL NOT be deleted."
            callback={response => {
              this.setState({ leaveCalendarPrompt: false });
              if (response) this.leaveCalendar(activeCalendarIndex);
            }}
            firstButton="Leave"
            type="delete-calendar"
          />
        )}
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
        {unlinkAccountPrompt && (
          <ConfirmAlert
            close={() =>
              this.setState({
                unlinkAccountPrompt: false,
                unLinkAccountID: undefined
              })
            }
            title="Unlink Account"
            message="Are you sure you want to remove this account from the calendar. Note: this does not delete any already scheduled posts."
            callback={response => {
              this.setState({
                unlinkAccountPrompt: false,
                unLinkAccountID: undefined
              });
              if (response) this.unlinkSocialAccount(unLinkAccountID);
            }}
            type="delete-calendar"
            firstButton="Unlink"
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
            firstButton="Remove"
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
        {promoteUserPrompt && (
          <ConfirmAlert
            close={() =>
              this.setState({
                promoteUserPrompt: false,
                promoteUserObj: undefined
              })
            }
            title="Promote User"
            message="Are you sure you want to promote this user to be the new calendar admin? (You will be demoted to a regular user)"
            firstButton="Promote"
            callback={response => {
              this.setState({
                promoteUserPrompt: false,
                promoteUserObj: undefined
              });
              if (response)
                this.promoteUser(
                  promoteUserObj.userIndex,
                  promoteUserObj.calendarIndex
                );
            }}
            type="delete-calendar"
          />
        )}{" "}
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
