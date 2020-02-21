import React from "react";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment-timezone";

import Loader from "../components/notifications/Loader";

try {
  var { testingUser, testingAccounts } = require("../keys");
} catch (ex) {
  console.log("live");
}

export const getAllAccountsFromAllCalendars = callback => {
  axios.get("/api/accounts/all").then(res => {
    const { allAccounts, success } = res.data;
    callback(allAccounts);
  });
};

export const getCampaigns = (calendars, activeCalendarIndex, callback) => {
  if (!calendars || !calendars[activeCalendarIndex]) {
    console.log(calendars);
    console.log(activeCalendarIndex);
    console.log("calendar error");
    return;
  }
  const calendarID = calendars[activeCalendarIndex]._id;

  axios.get("/api/calendar/campaigns/" + calendarID).then(res => {
    let { success, err, message, campaigns } = res.data;
    if (!success) {
      console.log(message);
      console.log(err);
    } else {
      for (let index in campaigns) {
        campaigns[index].campaign.posts = campaigns[index].posts;
        campaigns[index] = campaigns[index].campaign;
      }

      callback({ campaigns });
    }
  });
};
export const getAccounts = callback => {
  if (process.env.NODE_ENV === "development") {
    //  callback(testingAccounts);
  }
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

export const getGhostitBlogs = callback => {
  axios.get("/api/ghostit/blogs").then(res => {
    const { success, ghostitBlogs } = res.data;

    if (success) callback(ghostitBlogs);
    else {
      // TODO: handle error
    }
  });
};

export const getUser = callback => {
  if (process.env.NODE_ENV === "development") {
    //  return callback(undefined, testingUser);
  }
  axios.get("/api/user").then(res => {
    const { error, signedInAsUser, user } = res.data;
    if (!error) {
      callback(signedInAsUser, user);
    } else {
      callback();
      // TODO: handleerror
    }
  });
};

export const getUserEmail = user => {
  if (user && user.signedInAsUser && user.signedInAsUser.fullName)
    return user.signedInAsUser.fullName;
  else return user.email;
};
export const useAppropriateFunctionForEscapeKey = getKeyListenerFunction => {
  document.removeEventListener("keydown", getKeyListenerFunction[1], false);
  document.addEventListener("keydown", getKeyListenerFunction[0], false);
};

export const getCalendars = callback => {
  axios.get("/api/calendars").then(res => {
    const { success, calendars, defaultCalendarID } = res.data;
    if (!success || !calendars || calendars.length === 0) {
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

export const getNotifications = callback => {
  axios.get("/api/notifications").then(res => {
    const { notifications, success } = res.data;
    if (success) callback({ notifications });
  });
};

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

export const initSocket = (
  callback,
  calendars,
  activeCalendarIndex,
  campaigns = [],
  getPostArrays,
  updateSocketCalendar
) => {
  let socket;

  if (process.env.NODE_ENV === "development")
    socket = io("http://localhost:5000");
  else socket = io();

  socket.on("calendar_post_saved", post => {
    post.startDate = post.postingDate;
    post.endDate = post.postingDate;

    if (
      calendars[activeCalendarIndex]._id.toString() !==
      post.calendarID.toString()
    ) {
      return;
    } else {
      let targetListName;
      if (post.socialType === "facebook") targetListName = "facebookPosts";
      else if (post.socialType === "twitter") targetListName = "twitterPosts";
      else if (post.socialType === "linkedin") targetListName = "linkedinPosts";
      else if (post.socialType === "custom") targetListName = "customPosts";
      else console.log(`unhandled post socialType: ${post.socialType}`);
      if (targetListName) {
        const index = getPostArrays()[targetListName].findIndex(
          postObj => postObj._id.toString() === post._id.toString()
        );
        if (index === -1) {
          // new post so just add it to the list
          callback(prevState => {
            return {
              [targetListName]: [...prevState[targetListName], post]
            };
          });
        } else {
          // post exists so we just need to update it
          callback(prevState => {
            return {
              [targetListName]: [
                ...prevState[targetListName].slice(0, index),
                post,
                ...prevState[targetListName].slice(index + 1)
              ]
            };
          });
        }
      }
    }
  });

  socket.on("calendar_post_deleted", reqObj => {
    const { postID, socialType } = reqObj;
    if (!postID || !socialType) return;

    let targetListName;
    if (socialType === "facebook") targetListName = "facebookPosts";
    else if (socialType === "twitter") targetListName = "twitterPosts";
    else if (socialType === "linkedin") targetListName = "linkedinPosts";
    else if (socialType === "custom") targetListName = "customPosts";
    else console.log(`unhandled post socialType: ${socialType}`);

    const index = getPostArrays()[targetListName].findIndex(post => {
      return post._id.toString() === postID.toString();
    });
    if (index === -1) return;
    callback(prevState => {
      return {
        [targetListName]: [
          ...prevState[targetListName].slice(0, index),
          ...prevState[targetListName].slice(index + 1)
        ]
      };
    });
  });

  socket.on("calendar_campaign_saved", campaign => {
    if (
      campaign.calendarID.toString() !==
      calendars[activeCalendarIndex]._id.toString()
    )
      return;
    const index = campaigns.findIndex(
      camp => camp._id.toString() === campaign._id.toString()
    );
    if (index !== -1) {
      callback(prevState => {
        return {
          campaigns: [
            ...prevState.campaigns.slice(0, index),
            campaign,
            ...prevState.campaigns.slice(index + 1)
          ]
        };
      });
    } else {
      callback(prevState => {
        return {
          campaigns: [...prevState.campaigns, campaign]
        };
      });
    }
  });

  socket.on("calendar_campaign_deleted", campaignID => {
    const index = campaigns.findIndex(
      campaign => campaign._id.toString() === campaignID.toString()
    );
    if (index !== -1) {
      callback(prevState => {
        return {
          campaigns: [
            ...prevState.campaigns.slice(0, index),
            ...prevState.campaigns.slice(index + 1)
          ]
        };
      });
    }
  });

  socket.on("campaign_post_saved", reqObj => {
    const { calendarID, campaignID } = reqObj;
    const post = reqObj.extra;

    if (calendarID.toString() !== calendars[activeCalendarIndex]._id.toString())
      return;

    const index = campaigns.findIndex(
      campaign => campaign._id.toString() === campaignID.toString()
    );
    if (index === -1) return; // campaign doesnt exist yet for this user so can't add a post to it

    const campaign = campaigns[index];
    const postIndex = campaign.posts.findIndex(
      postObj => postObj._id.toString() === post._id.toString()
    );

    if (postIndex === -1) {
      // post doesn't exist in the campaign yet so just need to add it
      callback(prevState => {
        return {
          campaigns: [
            ...prevState.campaigns.slice(0, index),
            {
              ...prevState.campaigns[index],
              posts: [...prevState.campaigns[index].posts, post]
            },
            ...prevState.campaigns.slice(index + 1)
          ]
        };
      });
    } else {
      // post exists already so need to update it
      callback(prevState => {
        return {
          campaigns: [
            ...prevState.campaigns.slice(0, index),
            {
              ...prevState.campaigns[index],
              posts: [
                ...prevState.campaigns[index].posts.slice(0, postIndex),
                post,
                ...prevState.campaigns[index].posts.slice(postIndex + 1)
              ]
            },
            ...prevState.campaigns.slice(index + 1)
          ]
        };
      });
    }
  });

  socket.on("campaign_post_deleted", reqObj => {
    const { calendarID, campaignID } = reqObj;
    const postID = reqObj.extra;

    if (calendarID.toString() !== calendars[activeCalendarIndex]._id.toString())
      return;

    const index = campaigns.findIndex(
      campaign => campaign._id.toString() === campaignID.toString()
    );
    if (index === -1) return; // campaign doesnt exist yet for this user so can't add a post to it

    const campaign = campaigns[index];
    const postIndex = campaign.posts.findIndex(
      postObj => postObj._id.toString() === postID.toString()
    );

    if (postIndex === -1) {
      // post doesn't exist in the campaign yet so don't need to delete it
      return;
    } else {
      // post exists so just need to remove it
      callback(prevState => {
        return {
          campaigns: [
            ...prevState.campaigns.slice(0, index),
            {
              ...prevState.campaigns[index],
              posts: [
                ...prevState.campaigns[index].posts.slice(0, postIndex),
                ...prevState.campaigns[index].posts.slice(postIndex + 1)
              ]
            },
            ...prevState.campaigns.slice(index + 1)
          ]
        };
      });
    }
  });

  socket.on("campaign_modified", reqObj => {
    const { calendarID, campaignID } = reqObj;
    const campaign = reqObj.extra;

    if (calendarID.toString() !== calendars[activeCalendarIndex]._id.toString())
      return;

    const index = campaigns.findIndex(
      campaign => campaign._id.toString() === campaignID.toString()
    );
    if (index === -1) return; // campaign doesnt exist yet for this user so can't add a post to it

    callback(prevState => {
      return {
        campaigns: [
          ...prevState.campaigns.slice(0, index),
          {
            ...prevState.campaigns[index],
            ...campaign,
            posts: prevState.campaigns[index].posts
          },
          ...prevState.campaigns.slice(index + 1)
        ]
      };
    });
  });
  socket.on("socket_user_list", reqObj => {
    const { roomID, userList } = reqObj;

    if (roomID.toString() !== calendars[activeCalendarIndex]._id.toString())
      return;

    callback({ userList });
  });
  callback({ socket });
  if (updateSocketCalendar) updateSocketCalendar(socket);
};

export const isStillLoading = (page, user) => {
  if (user) return page;
  else return Loader;
};
