export const inviteUser = (index, context) => {
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
        context.notify({ type: "danger", title: "Invite Failed", message });
      } else {
        context.notify({
          type: "success",
          title: "Invite Successful",
          message: `${inviteEmail} has been invited to join calendar ${calendar.calendarName}.`
        });
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

export const createNewCalendar = (name, context) => {
  axios.post("/api/calendars/new", { name }).then(res => {
    const { success, newCalendar, message } = res.data;
    if (success) {
      this.setState(prevState => {
        return {
          calendars: [...prevState.calendars, newCalendar]
        };
      });
    } else {
      context.notify({ type: "danger", title: "", message });
    }
  });
};

export const promoteUser = (userIndex, calendarIndex, context) => {
  const { calendars } = this.state;
  const calendar = calendars[calendarIndex];
  const userID = calendar.users[userIndex]._id;

  axios
    .post("/api/calendar/user/promote", { userID, calendarID: calendar._id })
    .then(res => {
      const { success, err, message } = res.data;
      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Promote User Failed",
          message
        });
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
        context.notify({ type: "success", title: "User Promoted", message });
      }
    });
};

export const removeUserFromCalendar = (userIndex, calendarIndex, context) => {
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
        context.notify({
          type: "danger",
          title: "Remove User Failed",
          message
        });
      } else {
        this.getCalendarUsers(calendarIndex);
        context.notify({
          type: "success",
          title: "User Removed",
          message: `User successfully removed from calendar.`
        });
      }
    });
};

export const saveCalendarName = (index, name) => {
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

export const leaveCalendarClicked = () => {
  this.setState({ leaveCalendarPrompt: true });
};

export const leaveCalendar = (index, context) => {
  const { calendars } = this.state;
  this.setState({ saving: true });
  axios
    .post("/api/calendar/leave", { calendarID: calendars[index]._id })
    .then(res => {
      this.setState({ saving: false });
      const { success, err, message, newCalendar } = res.data;
      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Failed to Leave Calendar",
          message
        });
      } else {
        context.notify({ type: "success", title: "Calendar Left", message });
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

export const deleteCalendarClicked = () => {
  const { calendars, activeCalendarIndex } = this.state;
  if (calendars[activeCalendarIndex].userIDs.length > 1) {
    alert(
      `You must remove all other users from the calendar before you can delete it.`
    );
  } else {
    this.setState({ deleteCalendarPrompt: true });
  }
};

export const deleteCalendar = (index, context) => {
  const { calendars } = this.state;
  this.setState({ saving: true });
  axios
    .post("/api/calendar/delete", { calendarID: calendars[index]._id })
    .then(res => {
      this.setState({ saving: false });
      const { success, err, message, newCalendar } = res.data;
      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Delete Calendar Failed",
          message
        });
      } else {
        context.notify({
          type: "success",
          title: "Calendar Deleted",
          message: message ? message : "Calendar successfully deleted."
        });
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

export const setDefaultCalendar = (calendarIndex, context) => {
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
        context.notify({
          type: "danger",
          title: "Set Default Calendar Failed",
          message
        });
      } else {
        context.notify({ type: "success", title: "Success", message });
        this.setState({ defaultCalendarID: calendars[calendarIndex]._id });
      }
    });
};

export const updateActiveCalendar = index => {
  const { calendars } = this.state;
  this.setState({ activeCalendarIndex: index, unsavedChange: false }, () => {
    this.handleCalendarChange("tempName", calendars[index].calendarName, index);
    this.getCalendarUsers(index);
    this.getCalendarAccounts(index);
  });
};

export const unlinkSocialAccount = (accountID, context) => {
  const { calendars, activeCalendarIndex } = this.state;
  const calendarID = calendars[activeCalendarIndex]._id;
  axios
    .post("/api/calendar/account/delete", { accountID, calendarID })
    .then(res => {
      const { success, err, message } = res.data;
      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Failed to Remove Account",
          message
        });
      } else {
        const calendar = calendars[activeCalendarIndex];
        const accountIndex = calendar.accounts.findIndex(
          actObj => actObj._id.toString() === accountID.toString()
        );
        if (accountIndex === -1) {
          context.notify({
            type: "info",
            title: "Something May Have Gone Wrong",
            message: "Reload page to make sure account was removed properly."
          });
        } else {
          context.notify({
            type: "success",
            title: "Successfully Removed Account",
            message
          });
          this.setState(prevState => {
            return {
              calendars: [
                ...prevState.calendars.slice(0, activeCalendarIndex),
                {
                  ...prevState.calendars[activeCalendarIndex],
                  accounts: [
                    ...prevState.calendars[activeCalendarIndex].accounts.slice(
                      0,
                      accountIndex
                    ),
                    ...prevState.calendars[activeCalendarIndex].accounts.slice(
                      accountIndex + 1
                    )
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

export const presentActiveCalendar = (
  isDefaultCalendar,
  isAdmin,
  calendar,
  context
) => {
  const { activeCalendarIndex, unsavedChange, inviteEmail } = this.state;

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
            <div className="flex column fill-flex">
              <div className="fill-flex">
                {capitolizeWordsInString(userObj.fullName)}
                {userObj._id.toString() === userID.toString() ? " (Admin)" : ""}
              </div>
              <div className="fill-flex">{userObj.email}</div>
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
            <div className="flex column fill-flex ml8">
              <div className="fill-flex">{capitolizeWordsInString(title)}</div>
              <div className="fill-flex">
                {capitolizeFirstChar(account.accountType)}
              </div>
            </div>
            {(isAdmin || account.userID.toString() === userID.toString()) && (
              <div title="Remove Account From Calendar" className="flex hc vc">
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
    <div className="flex column fill-flex vc">
      <div className="grid-two-columns py8 border-bottom x-fill">
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
                this.inviteUser(activeCalendarIndex, context);
              }}
            >
              Invite
            </button>
          )}
        </div>
      </div>
      <div className="flex fill-flex x-fill">
        <div className="list-container fill-flex pa16 light-scrollbar border-right">
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
        <div className="list-container fill-flex pa16 light-scrollbar">
          <h4 className="mx16">Calendar Users</h4>
          {userDivs}
        </div>
      </div>
      {!isDefaultCalendar && (
        <button
          className="regular-button my8"
          onClick={e => {
            e.preventDefault();
            this.setDefaultCalendar(activeCalendarIndex, context);
          }}
        >
          Set As Default Calendar
        </button>
      )}
    </div>
  );
};
