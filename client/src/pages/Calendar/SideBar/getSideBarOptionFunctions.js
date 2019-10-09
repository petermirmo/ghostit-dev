export const getAccountOptions = (account, handleChange) => {
  [
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
      name: isUserAdminOfCalendar(calendar, context.user)
        ? "Delete"
        : "Leave Calendar",
      onClick: isUserAdminOfCalendar(calendar, context.user)
        ? index => deleteCalendarClicked(index, calendars, handleChange)
        : () => handleChange({ leaveCalendarPrompt: true })
    }
  ];
};

export const getUserOptions = (
  activeCalendarIndex,
  calendar,
  context,
  handleChange,
  isUserAdminOfCalendar,
  user
) => {
  if (isUserAdminOfCalendar(calendar, context.user)) {
    if (context.user._id === user._id) return undefined;
    else
      return [
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
};
