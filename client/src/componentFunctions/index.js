"use strict";
import moment from "moment-timezone";
import axios from "axios";

export const fillPosts = campaign => {
  // function called when a user clicks on an existing recipe to edit
  let posts = [];
  for (let index in campaign.posts) {
    let new_post = campaign.posts[index];

    if (campaign.chosenStartDate) {
      new_post.postingDate = createAppropriateDate(
        campaign.chosenStartDate,
        campaign.startDate,
        new_post.postingDate
      );
    }
    new_post.canEditPost = new moment(new_post.postingDate).isAfter(
      new moment()
    )
      ? true
      : false;

    posts.push(new_post);
  }
  return posts;
};

export const newPost = (
  socialType,
  posts,
  campaign,
  clickedCalendarDate,
  listOfPostChanges
) => {
  const { startDate, _id } = campaign;

  let postingDate = clickedCalendarDate;
  if (clickedCalendarDate < new moment(campaign.startDate))
    postingDate = campaign.startDate;

  if (Object.keys(listOfPostChanges).length > 0) {
    // current post has unsaved changes
    return {
      pendingPostType: socialType,
      promptChangeActivePost: true
    };
  }

  const post = {
    postingDate,
    socialType,
    campaignID: _id,
    canEditPost: true,
    name:
      socialType.charAt(0).toUpperCase() +
      socialType.slice(1) +
      (socialType === "custom" ? " Task" : " Post")
  };

  return {
    posts: [...posts, post],
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
