"use strict";
import moment from "moment-timezone";
import axios from "axios";

export const fillPosts = campaign => {
  // function called when a user clicks on an existing recipe to edit
  let posts = [];
  for (let index in campaign.posts) {
    let new_post = campaign.posts[index];
    new_post.canEditPost = new moment(new_post.postingDate).isAfter(
      new moment()
    )
      ? true
      : false;

    if (campaign.beginDate) {
      new_post.postingDate = createAppropriateDate(
        campaign.beginDate,
        campaign.startDate,
        new_post.postingDate
      );
    }

    posts.push(new_post);
  }
  return posts;
};

export const newPost = (socialType, posts, campaign, clickedCalendarDate) => {
  const { startDate, _id } = campaign;

  let postingDate = clickedCalendarDate;
  if (clickedCalendarDate < new moment(campaign.startDate))
    postingDate = campaign.startDate;

  return {
    posts: [
      ...posts,

      {
        postingDate,
        socialType,
        campaignID: _id,
        canEditPost: true,
        name: socialType.charAt(0).toUpperCase() + socialType.slice(1) + " Post"
      }
    ],
    activePostIndex: posts.length,
    listOfPostChanges: {}
  };
};

export const createAppropriateDate = (
  chosenStartDate,
  recipeStartDate,
  dateToModify
) => {
  return new moment(chosenStartDate).add(
    new moment(dateToModify).diff(new moment(recipeStartDate)),
    "milliseconds"
  );
};
