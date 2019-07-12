import React from "react";

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

export const getPosts = (calendars, activeCalendarIndex, calendarDate) => {
  // if this (or any of the getPosts/getBlogs/getCampaigns/etc fails,
  // we should maybe setState({ posts: [] })) so that we don't render
  // posts from a previous calendar

  if (!calendars || !calendars[activeCalendarIndex]) {
    console.log(calendars);
    console.log(activeCalendarIndex);
    console.log("calendar error");
    return {};
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
        if (this._ismounted) {
          return {
            facebookPosts,
            twitterPosts,
            linkedinPosts,
            customPosts,
            loading: false
          };
        }
      }
    });
};

const createQueuePostDiv = (key, onSelectPost, post) => {
  let content = post.content;
  if (post.socialType === "custom") content = post.instructions;
  if (post.socialType === "newsletter") content = post.notes;
  if (post.socialType === "blog") content = post.title;

  return (
    <div
      key={key}
      className="queue-post-container flex py8 button"
      onClick={() => onSelectPost(post)}
    >
      <div className="queue-post-attribute flex">
        {getPostIcon(post.socialType) && (
          <FontAwesomeIcon
            icon={getPostIcon(post.socialType)}
            style={{ color: getPostColor(post.socialType) }}
            size="2x"
          />
        )}
        {!getPostIcon(post.socialType) && <div>{post.socialType}</div>}
      </div>

      <div className="queue-post-attribute">
        {new moment(post.postingDate).format("LLL")}
      </div>
      <div className="queue-post-attribute important">{content}</div>
      <div className="queue-post-attribute">
        <FileUpload
          currentFiles={post.files ? post.files : []}
          hideUploadButton={true}
          id="xyz"
          imageClassName="flex image tiny"
        />
      </div>
    </div>
  );
};

export const addMonth = (calendarDate, onDateChange) => {
  calendarDate.add(1, "months");
  onDateChange(calendarDate);
};

export const subtractMonth = (calendarDate, onDateChange) => {
  calendarDate.subtract(1, "months");
  onDateChange(calendarDate);
};
