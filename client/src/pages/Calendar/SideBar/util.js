import axios from "axios";

export const createNewCalendar = (
  context,
  index,
  name,
  updateActiveCalendar
) => {
  axios.post("/api/calendars/new", { name }).then(res => {
    const { success, newCalendar, message } = res.data;
    if (success) {
      context.handleChange(
        prevState => {
          return {
            calendars: [...prevState.calendars, newCalendar]
          };
        },
        () => updateActiveCalendar(index)
      );
    } else {
      context.notify({ type: "danger", title: "", message });
    }
  });
};
export const deleteCalendarClicked = (
  activeCalendarIndex,
  calendars,
  handleChange
) => {
  if (calendars[activeCalendarIndex].userIDs.length > 1) {
    alert(
      `You must remove all other users from the calendar before you can delete it.`
    );
  } else {
    handleChange({ deleteCalendarPrompt: true });
  }
};

export const didUserConnectAccount = (account, user) => {
  if (user._id === account.userID) return true;
  else return false;
};

export const inviteUser = (calendars, context, index, inviteEmail) => {
  const calendar = calendars[index];

  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/invite", {
      email: inviteEmail.toLowerCase(),
      calendarID: calendar._id
    })
    .then(res => {
      context.handleChange({ saving: false });
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
        context.handleChange(prevState => {
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

export const isUserOnline = (calendar, user, userList) => {
  if (
    userList.findIndex(
      userLoop => userLoop.email.toString() === user.email.toString()
    ) > -1
  )
    return true;
  else return false;
};
export const promoteUser = (calendarIndex, calendars, context, userIndex) => {
  const calendar = calendars[calendarIndex];
  const userID = calendar.users[userIndex]._id;
  context.handleChange({ saving: true });

  axios
    .post("/api/calendar/user/promote", { userID, calendarID: calendar._id })
    .then(res => {
      const { success, err, message } = res.data;
      context.handleChange({ saving: false });

      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Promote User Failed",
          message
        });
      } else {
        context.handleChange(prevState => {
          return {
            calendars: [
              ...prevState.calendars.slice(0, calendarIndex),
              { ...prevState.calendars[calendarIndex], adminID: userID },
              ...prevState.calendars.slice(calendarIndex + 1)
            ]
          };
        });
        context.notify({ type: "success", title: "User Promoted", message });
      }
    });
};

export const removeUserFromCalendar = (
  calendarIndex,
  calendars,
  context,
  getCalendarUsers,
  handleCalendarChange,
  userIndex
) => {
  const calendar = calendars[calendarIndex];
  const calendarID = calendar._id;
  const userID = calendar.users[userIndex]._id;

  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/user/remove", {
      userID,
      calendarID
    })
    .then(res => {
      const { success, err, message } = res.data;
      context.handleChange({ saving: false });

      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Remove User Failed",
          message
        });
      } else {
        getCalendarUsers(context);
        context.notify({
          type: "success",
          title: "User Removed",
          message: `User successfully removed from calendar.`
        });
      }
    });
};

export const saveCalendarName = (calendars, context, index, name) => {
  if (!/\S/.test(name)) {
    alert("Name must not be empty.");
    return;
  }
  if (name && name.length > 0) {
    context.handleChange({ saving: true });
    axios
      .post("/api/calendar/rename", {
        calendarID: calendars[index]._id,
        name
      })
      .then(res => {
        const { success, err, message, calendar } = res.data;
        context.handleChange({ saving: false });

        if (!success) {
          console.log(err);
          console.log(message);
          context.notify({
            type: "danger",
            title: "Failed to Save Calendar Name",
            message
          });
        } else {
          context.notify({
            type: "success",
            title: "Saved Successfully"
          });
          context.handleChange(prevState => {
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

export const leaveCalendar = (
  calendars,
  context,
  index,
  updateActiveCalendar
) => {
  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/leave", { calendarID: calendars[index]._id })
    .then(res => {
      context.handleChange({ saving: false });
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
          context.handleChange(
            { activeCalendarIndex: 0, calendars: [newCalendar] },
            () => updateActiveCalendar(0)
          );
        } else {
          let new_index = index;
          if (calendars.length - 1 <= index) new_index = index - 1;

          context.handleChange(
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
              updateActiveCalendar(new_index);
            }
          );
        }
      }
    });
};

export const deleteCalendar = (
  calendars,
  context,
  index,
  updateActiveCalendar
) => {
  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/delete", { calendarID: calendars[index]._id })
    .then(res => {
      context.handleChange({ saving: false });
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
          context.handleChange(
            { activeCalendarIndex: 0, calendars: [newCalendar] },
            () => updateActiveCalendar(0)
          );
        } else {
          let new_index = index;
          if (calendars.length - 1 <= index) new_index = index - 1;

          context.handleChange(
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
              updateActiveCalendar(new_index);
            }
          );
        }
      }
    });
};
export const removePendingEmail = (
  activeCalendarIndex,
  calendar,
  context,
  listIndex
) => {
  const inviteEmailIndex = listIndex - calendar.users.length;
  const calendarID = calendar._id;
  const email = calendar.emailsInvited[inviteEmailIndex];

  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/remove/invitation", {
      calendarID,
      email
    })
    .then(res => {
      const { success, err, message } = res.data;
      context.handleChange({ saving: false });

      if (!success) {
        console.log(err);
        console.log(message);
        context.notify({
          type: "danger",
          title: "Remove Invitation Failed",
          message
        });
      } else {
        context.notify({ type: "success", title: "Success", message });
        context.handleChange(prevState => {
          return {
            calendars: [
              ...prevState.calendars.slice(0, activeCalendarIndex),
              {
                ...prevState.calendars[activeCalendarIndex],
                emailsInvited: [
                  ...prevState.calendars[
                    activeCalendarIndex
                  ].emailsInvited.slice(0, inviteEmailIndex),
                  ...prevState.calendars[
                    activeCalendarIndex
                  ].emailsInvited.slice(inviteEmailIndex + 1)
                ]
              },
              ...prevState.calendars.slice(activeCalendarIndex + 1)
            ]
          };
        });
      }
    });
};

export const setDefaultCalendar = (calendarID, context) => {
  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/setDefault", {
      calendarID
    })
    .then(res => {
      const { success, err, message } = res.data;
      context.handleChange({ saving: false });

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
        context.handleChange({ defaultCalendarID: calendarID });
      }
    });
};
export const unlinkSocialAccount = (
  accountID,
  activeCalendarIndex,
  calendars,
  context
) => {
  const calendarID = calendars[activeCalendarIndex]._id;
  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/account/delete", { accountID, calendarID })
    .then(res => {
      const { success, err, message } = res.data;
      context.handleChange({ saving: false });

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
          context.handleChange(prevState => {
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
