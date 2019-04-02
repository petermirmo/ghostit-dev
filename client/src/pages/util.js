import axios from "axios";
import moment from "moment-timezone";

export const getUser = callback => {
  axios.get("/api/user").then(res => {
    const { error, user } = res.data;

    if (!error) {
      callback(user);
    } else {
      callback();
      // TODO: handleerror
    }
  });
};
export const getAccounts = callback => {
  axios.get("/api/accounts").then(res => {
    // Set user's accounts to state
    let { accounts } = res.data;
    if (!accounts) {
      // TODO: handle error
      accounts = [];
      callback(accounts);
    }

    callback(accounts);
  });
};

export const getBlogs = callback => {
  axios.get("/api/ghostit/blogs").then(res => {
    const { error, ghostitBlogs } = res.data;
    if (!error) callback(ghostitBlogs);
    else {
      // TODO: handle error
    }
  });
};

export const useAppropriateFunctionForEscapeKey = getKeyListenerFunction => {
  document.removeEventListener("keydown", getKeyListenerFunction[1], false);
  document.addEventListener("keydown", getKeyListenerFunction[0], false);
};

export const getCalendars = callback => {
  axios.get("/api/calendars").then(res => {
    const { success, calendars, defaultCalendarID } = res.data;
    if (!success || !calendars || calendars.length === 0) {
      console.log(res.data.err);
      console.log(res.data.message);
      console.log(calendars);
    } else {
      calendars.sort((a, b) => {
        if (a.calendarName > b.calendarName) return 1;
        else return -1;
      });

      let activeCalendarIndex = calendars.findIndex(
        calObj => calObj._id.toString() === defaultCalendarID.toString()
      );

      if (activeCalendarIndex === -1) activeCalendarIndex = 0;
      moment.tz.setDefault(calendars[activeCalendarIndex].timezone);

      return callback({
        calendars,
        activeCalendarIndex,
        defaultCalendarID,
        timezone: calendars[activeCalendarIndex].timezone,
        calendarDate: new moment()
      });
    }
  });
};

export const getCalendarInvites = callback => {
  axios.get("/api/calendars/invites").then(res => {
    const { success, err, message, calendars } = res.data;
    if (!success) {
      console.log(err);
      console.log(message);
      console.log("failed to retrieve calendar invites.");
    } else {
      if (!calendars || calendars.length === 0) {
        return;
      } else {
        // calendars is an array of all calendars that have this user's email in its emailsInvited array
        return callback({ calendarInvites: calendars });
      }
    }
  });
};
