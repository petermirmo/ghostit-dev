import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";
import faMinusCircle from "@fortawesome/fontawesome-free-solid/faMinusCircle";
import faSignOutAlt from "@fortawesome/fontawesome-free-solid/faSignOutAlt";
import faArrowCircleUp from "@fortawesome/fontawesome-free-solid/faArrowCircleUp";

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
      defaultCalendarID: props.defaultCalendarID,
      unsavedChange: false,
      removeUserPrompt: false,
      unlinkAccountPrompt: false,
      leaveCalendarPrompt: false,
      deleteCalendarPrompt: false,
      promoteUserPrompt: false,
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

  createNewCalendar = name => {
    axios.post("/api/calendars/new", { name }).then(res => {
      const { success, newCalendar } = res.data;
      if (success) {
        this.setState(prevState => {
          return {
            calendars: [...prevState.calendars, newCalendar]
          };
        });
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

  presentActiveCalendar = () => {
    const {
      calendars,
      activeCalendarIndex,
      defaultCalendarID,
      unsavedChange,
      inviteEmail
    } = this.state;
    const calendar = calendars[activeCalendarIndex];

    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    const isDefaultCalendar =
      calendar._id.toString() === defaultCalendarID.toString();
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
              userObj._id.toString() !== userID.toString() && (
                <div className="user-icons">
                  <div title="Promote to Admin">
                    <FontAwesomeIcon
                      className="user-promote"
                      icon={faArrowCircleUp}
                      color="blue"
                      onClick={() =>
                        this.setState({
                          promoteUserPrompt: true,
                          promoteUserObj: {
                            userIndex: index,
                            calendarIndex: activeCalendarIndex
                          }
                        })
                      }
                    />
                  </div>
                  <div title="Remove User">
                    <FontAwesomeIcon
                      className="user-remove"
                      icon={faMinusCircle}
                      color="red"
                      onClick={() =>
                        this.setState({
                          removeUserPrompt: true,
                          removeUserObj: {
                            userIndex: index,
                            calendarIndex: activeCalendarIndex
                          }
                        })
                      }
                    />
                  </div>
                </div>
              )}
          </div>
        );
      });
    }

    let accountDivs = undefined;
    if (calendar.accounts) {
      accountDivs = calendar.accounts.map((account, index) => {
        return (
          <div className="calendar-account-card" key={`account${index}`}>
            <div className="account-info">
              <div className="account-label">{account.givenName}</div>
              <div className="account-label">{`${account.socialType} ${
                account.accountType
              }`}</div>
              <div className="account-label">{account.user.name}</div>
              <div className="account-label">{account.user.email}</div>
            </div>
            {(isAdmin || account.userID.toString() === userID.toString()) && (
              <div className="account-icons">
                <div title="Remove Account From Calendar">
                  <FontAwesomeIcon
                    className="account-remove"
                    icon={faMinusCircle}
                    color="red"
                    onClick={() =>
                      this.setState({
                        unlinkAccountPrompt: true,
                        unLinkAccountID: account._id
                      })
                    }
                  />
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
              className="invite-input"
              placeholder="user@example.com"
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
              className="calendar-info-input"
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
                className="save-button"
                onClick={e => {
                  e.preventDefault();
                  this.saveCalendarName(activeCalendarIndex, calendar.tempName);
                }}
              >
                Save
              </button>
            )}
            {isDefaultCalendar && (
              <div className="default-calendar-label">Default Calendar</div>
            )}
            {!isDefaultCalendar && (
              <button
                className="default-calendar-button"
                onClick={e => {
                  e.preventDefault();
                  this.setDefaultCalendar(activeCalendarIndex);
                }}
              >
                Set As Default Calendar
              </button>
            )}
          </div>
          <div className="calendar-accounts-container pa16">
            <div className="calendar-accounts-header">Accounts</div>
            {accountDivs}
          </div>
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
      promoteUserPrompt,
      leaveCalendarPrompt,
      unlinkAccountPrompt,
      promoteUserObj,
      removeUserObj,
      unLinkAccountID
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
            {!isAdmin && (
              <div title={"Leave Calendar"}>
                <FontAwesomeIcon
                  className="close-special delete-calendar"
                  icon={faSignOutAlt}
                  flip="horizontal"
                  size="1x"
                  onClick={this.leaveCalendarClicked}
                />
              </div>
            )}
            <CalendarPicker
              calendars={calendars}
              activeCalendarIndex={activeCalendarIndex}
              calendarManager={true}
              createNewCalendar={this.createNewCalendar}
              updateActiveCalendar={this.updateActiveCalendar}
            />
          </div>
          {this.presentActiveCalendar()}
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
