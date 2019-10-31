import React from "react";
import axios from "axios";
import { getPostIcon, getPostColor } from "../../componentFunctions";

export const getCalendarEvents = (
  calendarEventCategories,
  campaigns,
  customPosts,
  facebookPosts,
  instagramPosts,
  linkedinPosts,
  twitterPosts
) => {
  let calendarEvents = [];

  const {
    All,
    Campaigns,
    Custom,
    Facebook,
    Instagram,
    Linkedin,
    Twitter
  } = calendarEventCategories;

  if (Custom || All)
    if (customPosts) calendarEvents = calendarEvents.concat(customPosts);
  if (Facebook || All)
    if (facebookPosts) calendarEvents = calendarEvents.concat(facebookPosts);
  if (Twitter || All)
    if (twitterPosts) calendarEvents = calendarEvents.concat(twitterPosts);
  if (Linkedin || All)
    if (linkedinPosts) calendarEvents = calendarEvents.concat(linkedinPosts);
  if (Instagram || All)
    if (instagramPosts) calendarEvents = calendarEvents.concat(instagramPosts);

  if (Campaigns || All)
    if (campaigns) calendarEvents = calendarEvents.concat(campaigns);
  if (!Campaigns && !All) {
    // only add the campaigns that have at least 1 post that passes the filter
    // and within that campaign, only include the qualifying posts
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = { ...campaigns[i], posts: [] };
      for (let j = 0; j < campaigns[i].posts.length; j++) {
        const post = campaigns[i].posts[j];
        switch (post.socialType) {
          case "facebook":
            if (Facebook) campaign.posts.push(post);
            break;
          case "twitter":
            if (Twitter) campaign.posts.push(post);
            break;
          case "linkedin":
            if (Linkedin) campaign.posts.push(post);
            break;
          case "instagram":
            if (Instagram) campaign.posts.push(post);
            break;
          case "custom":
            if (Custom) campaign.posts.push(post);
            break;
          default:
            break;
        }
      }
      if (campaign.posts.length > 0) {
        calendarEvents.push(campaign);
      }
    }
  }
  return calendarEvents;
};

export const getPosts = (
  calendars,
  activeCalendarIndex,
  calendarDate,
  handleChange
) => {
  // if this (or any of the getPosts/getBlogs/getCampaigns/etc fails,
  // we should maybe setState({ posts: [] })) so that we don't render
  // posts from a previous calendar

  if (!calendars || !calendars[activeCalendarIndex]) {
    console.log(calendars);
    console.log(activeCalendarIndex);
    console.log("calendar error");
    return handleChange({});
  }
  const calendarID = calendars[activeCalendarIndex]._id;
  let facebookPosts = [];
  let twitterPosts = [];
  let linkedinPosts = [];
  let customPosts = [];

  // Get all of user's posts to display in calendar
  axios
    .post("/api/calendar/posts/" + calendarID, { calendarDate })
    .then(res => {
      const { success, err, message, posts, loggedIn } = res.data;
      if (!success) {
        console.log(message);
        console.log(err);
      } else {
        if (loggedIn === false) this.props.history.push("/sign-in");

        for (let index in posts) {
          posts[index].startDate = posts[index].postingDate;
          posts[index].endDate = posts[index].postingDate;
        }

        for (let index in posts) {
          if (posts[index].socialType === "facebook") {
            facebookPosts.push(posts[index]);
          } else if (posts[index].socialType === "twitter") {
            twitterPosts.push(posts[index]);
          } else if (posts[index].socialType === "linkedin") {
            linkedinPosts.push(posts[index]);
          } else if (posts[index].socialType === "custom") {
            customPosts.push(posts[index]);
          }
        }
        return handleChange({
          facebookPosts,
          twitterPosts,
          linkedinPosts,
          customPosts,
          loading: false
        });
      }
    });
};

export const getCalendarAccounts = (
  activeCalendarIndex,
  calendars,
  handleCalendarChange
) => {
  axios
    .get("/api/calendar/accounts/extra/" + calendars[activeCalendarIndex]._id)
    .then(res => {
      const { success, err, message, accounts } = res.data;
      if (!success || err || !accounts) {
        console.log(
          "Retrieving calendar accounts from database was unsuccessful."
        );
        console.log(err);
        console.log(message);
      } else {
        handleCalendarChange("accounts", accounts, activeCalendarIndex);
      }
    });
};

export const getCalendarUsers = (
  activeCalendarIndex,
  calendars,
  handleCalendarChange
) => {
  axios
    .get("/api/calendar/users/" + calendars[activeCalendarIndex]._id)
    .then(res => {
      const { success, err, message, users } = res.data;
      if (!success || err || !users) {
        console.log(
          "Retrieving calendar users from database was unsuccessful."
        );
        console.log(err);
        console.log(message);
      } else {
        const adminIndex = users.findIndex(
          userObj => userObj._id === calendars[activeCalendarIndex].adminID
        );
        if (adminIndex !== -1 && adminIndex !== 0) {
          // swap admin to the top of the array so it always gets displayed first
          let temp = users[0];
          users[0] = users[adminIndex];
          users[adminIndex] = temp;
        }

        handleCalendarChange("users", users, activeCalendarIndex);
      }
    });
};

export const inviteUserToCalendar = (
  calendars,
  context,
  index,
  handleChange,
  inviteEmail
) => {
  const calendar = calendars[index];

  handleChange({ loading: true });
  axios
    .post("/api/calendar/invite", {
      email: inviteEmail.toLowerCase(),
      calendarID: calendar._id
    })
    .then(res => {
      handleChange({ loading: false });
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
        handleChange(prevState => {
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

export const getActiveCategoriesInArray = calendarEventCategories => {
  const temp = [];
  let i = 0;
  for (let index in calendarEventCategories) {
    if (calendarEventCategories[index]) temp.push(i);
    i++;
  }
  return temp;
};
export const isUserAdminOfCalendar = (calendar, user) => {
  if (!calendar || !user) return false;
  else if (calendar.adminID === user._id) return true;
  else return false;
};
export const updateActiveCategory = (
  calendarEventCategories,
  handleChange,
  key
) => {
  calendarEventCategories[key] = !calendarEventCategories[key];

  calendarEventCategories["All"] = false;

  if (key === "All") {
    handleChange({
      calendarEventCategories: {
        All: true,
        Facebook: false,
        Twitter: false,
        Linkedin: false,
        Campaigns: false,
        Custom: false
      }
    });
  } else {
    handleChange({ calendarEventCategories });
  }
};

export const addMonth = (calendarDate, onDateChange) => {
  calendarDate.add(1, "months");
  onDateChange(calendarDate);
};

export const subtractMonth = (calendarDate, onDateChange) => {
  calendarDate.subtract(1, "months");
  onDateChange(calendarDate);
};
