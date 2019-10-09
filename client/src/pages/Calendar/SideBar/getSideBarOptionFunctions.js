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
