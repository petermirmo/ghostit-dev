"use strict";
import moment from "moment-timezone";
import axios from "axios";

export const fillPosts = some_posts => {
  // function called when a user clicks on an existing recipe to edit
  let posts = [];
  for (let index in some_posts) {
    let new_post = some_posts[index];
    new_post.canEditPost = new moment(new_post.postingDate).isAfter(
      new moment()
    )
      ? true
      : false;

    /*postingDate: recipe.startDate.add(
        current_post.postingDate,
        "millisecond"
      )*/
    posts.push(new_post);
  }
  return posts;
};
/*  post_obj.socialType.charAt(0).toUpperCase() +
  post_obj.socialType.slice(1) +
  (post_obj.socialType === "custom" ? " Task - " : " Post - ") +
  new moment(post_obj.postingDate).format("lll");*/
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
