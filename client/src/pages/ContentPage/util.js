export const triggerSocketPeers = (
  type,
  extra,
  calendars,
  activeCalendarIndex,
  socket,
  campaignID
) => {
  if (
    calendars &&
    activeCalendarIndex !== undefined &&
    calendars[activeCalendarIndex]
  ) {
    socket.emit("trigger_socket_peers", {
      calendarID: calendars[activeCalendarIndex]._id,
      campaignID,
      type,
      extra
    });
  }
};
