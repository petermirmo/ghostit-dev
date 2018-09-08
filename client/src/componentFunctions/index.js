"use strict";
import moment from "moment-timezone";
import axios from "axios";

import { postChecks, savePost } from "../extra/functions/CommonFunctions";

export const fillPosts = (campaign, isFromRecipe, recipeEditing) => {
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

    if (isFromRecipe) {
      delete new_post._id;
      if (!recipeEditing) {
        new_post.campaignID = campaign._id;
      }
    }

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

  if (listOfPostChanges && Object.keys(listOfPostChanges).length > 0) {
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

const postingDateWithinCampaign = (startDate, endDate, date) => {
  // this function assumes all arguments are moment objects
  if (date < startDate || date > endDate) {
    return false;
  }
  return true;
};

export const trySavePost = (post_state, post_props, skip_dates) => {
  if (post_props.recipeEditing) {
    return trySavePostInRecipe(post_state, post_props, skip_dates);
  }
  const {
    _id,
    content,
    instructions,
    link,
    linkImage,
    images,
    socialType,
    accountID,
    accountType,
    deleteImagesArray,
    somethingChanged,
    campaignID,
    name,
    date,
    sendEmailReminder
  } = post_state;
  const {
    recipeEditing,
    campaignStartDate,
    campaignEndDate,
    postFinishedSavingCallback,
    setSaving,
    maxCharacters
  } = post_props;

  const setStateObj = {};

  let newDate = new moment(date).utcOffset(0);
  if (
    socialType !== "custom" &&
    !postChecks(accountID, newDate, link, images, content, maxCharacters)
  ) {
    return setStateObj;
  }

  if (!skip_dates && campaignStartDate && campaignEndDate) {
    if (!postingDateWithinCampaign(campaignStartDate, campaignEndDate, date)) {
      // prompt user to cancel the save or modify campaign dates
      setStateObj.promptModifyCampaignDates = true;
      return setStateObj;
    }
  }

  setSaving();

  if (socialType === "custom") {
    savePost(
      _id,
      undefined,
      newDate,
      undefined,
      undefined,
      images,
      undefined,
      socialType,
      undefined,
      postFinishedSavingCallback,
      deleteImagesArray,
      campaignID,
      instructions,
      name,
      sendEmailReminder
    );
  } else {
    savePost(
      _id,
      content,
      newDate,
      link,
      linkImage,
      images,
      accountID,
      socialType,
      accountType,
      postFinishedSavingCallback,
      deleteImagesArray,
      campaignID,
      instructions,
      name
    );
  }
  setStateObj.somethingChanged = false;

  return setStateObj;
};

export const trySavePostInRecipe = (post_state, post_props, skip_dates) => {
  // function for saving a post within a recipe. the post does not get saved to the DB.
  const { name, instructions, date } = post_state;
  const { savePostChanges, campaignStartDate, campaignEndDate } = post_props;

  const setStateObj = {};

  // validity checks
  if (!name || name === "") {
    alert("Posts must be named.");
    return setStateObj;
  } else if (!instructions || instructions === "") {
    alert(
      "Posts cannot be empty. Please write some instructions in the text area."
    );
    return setStateObj;
  }

  // date checking
  if (!skip_dates && campaignStartDate && campaignEndDate) {
    if (!postingDateWithinCampaign(campaignStartDate, campaignEndDate, date)) {
      // prompt user to cancel the save or modify campaign dates
      setStateObj.promptModifyCampaignDates = true;
      return setStateObj;
    }
  }

  savePostChanges(date);
  setStateObj.somethingChanged = false;

  return setStateObj;
};
