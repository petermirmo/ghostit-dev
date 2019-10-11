export const getAccountOptions = (
  account,
  calendar,
  context,
  handleChange,
  isUserAdminOfCalendar
) => {
  if (isUserAdminOfCalendar(calendar, context.getUser()))
    return [
      {
        className: "red",
        name: "Disconnect From Calendar",
        onClick: index =>
          handleChange({
            unlinkAccountPrompt: true,
            unLinkAccountID: calendar.accounts[index]._id
          })
      }
    ];
  else return undefined;
};
export const getCalendarOptions = (
  calendar,
  calendars,
  context,
  deleteCalendarClicked,
  handleChange,
  handleParentChange,
  isUserAdminOfCalendar,
  setDefaultCalendar
) => {
  return [
    {
      name: "Set as Default",
      onClick: index =>
        setDefaultCalendar(calendars[index]._id, context, handleParentChange)
    },
    {
      className: "red",
      name: isUserAdminOfCalendar(calendar, context.getUser())
        ? "Delete"
        : "Leave Calendar",
      onClick: isUserAdminOfCalendar(calendar, context.getUser())
        ? index => deleteCalendarClicked(index, calendars, handleChange)
        : index =>
            handleChange({
              leaveCalendarIndex: index,
              leaveCalendarPrompt: true
            })
    }
  ];
};

export const getUserOptions = (
  activeCalendarIndex,
  calendar,
  context,
  handleChange,
  handleParentChange,
  inviteEmailIndex,
  isUserAdminOfCalendar,
  removePendingEmail,
  user
) => {
  if (user) {
    if (isUserAdminOfCalendar(calendar, context.getUser())) {
      if (context.getUser()._id === user._id) return undefined;
      else
        return [
          {
            name: "Make Admin",
            onClick: index => {
              handleChange({
                promoteUserPrompt: true,
                promoteUserObj: {
                  userIndex: index,
                  calendarIndex: activeCalendarIndex
                }
              });
            }
          },
          {
            name: "Remove User",
            onClick: index => {
              handleChange({
                removeUserPrompt: true,
                removeUserObj: {
                  userIndex: index,
                  calendarIndex: activeCalendarIndex
                }
              });
            }
          }
        ];
    } else return undefined;
  } else {
    if (isUserAdminOfCalendar(calendar, context.getUser())) {
      return [
        {
          name: "Delete Invitation",
          onClick: () =>
            removePendingEmail(
              activeCalendarIndex,
              calendar,
              context,
              handleParentChange,
              inviteEmailIndex
            )
        }
      ];
    } else return undefined;
  }
};
