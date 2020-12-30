import moment from "moment-timezone";
import axios from "axios";

import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons/faFacebookSquare";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons/faTwitterSquare";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons/faFacebookF";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons/faLinkedinIn";

export const fillPosts = (campaign, isFromRecipe, recipeEditing) => {
  // function called when a user clicks on an existing recipe to edit
  let posts = [];
  for (let index in campaign.posts) {
    let new_post = campaign.posts[index];
    if (!moment.isMoment(new_post.postingDate))
      new_post.postingDate = new moment(new_post.postingDate);

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
  if (clickedCalendarDate < new moment(startDate)) postingDate = startDate;

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
    dateToModify.diff(recipeStartDate),
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

export const trySavePost = (
  post_state,
  post_props,
  skip_dates,
  skip_checks,
  context
) => {
  if (post_props.recipeEditing) {
    return trySavePostInRecipe(post_state, post_props, skip_dates);
  }
  const {
    accountID,
    accountType,
    calendarID,
    campaignID,
    content,
    date,
    files,
    filesToDelete,
    instructions,
    link,
    linkCustomFiles,
    linkDescription,
    linkImage,
    linkTitle,
    name,
    sendEmailReminder,
    socialType,
    videoTitle,
    _id
  } = post_state;
  const {
    campaignEndDate,
    campaignStartDate,
    maxCharacters,
    postFinishedSavingCallback,
    setSaving
  } = post_props;

  const setStateObj = {};

  let newDate = new moment(date).utcOffset(0);
  if (
    !skip_checks &&
    socialType !== "custom" &&
    !postChecks(
      accountID,
      newDate,
      link,
      files,
      content,
      maxCharacters,
      socialType
    )
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
      files,
      undefined,
      socialType,
      undefined,
      postFinishedSavingCallback,
      filesToDelete,
      campaignID,
      instructions,
      name,
      calendarID,
      sendEmailReminder,
      undefined,
      undefined,
      undefined,
      undefined,
      context
    );
  } else {
    savePost(
      _id,
      content,
      newDate,
      link,
      linkImage,
      files,
      accountID,
      socialType,
      accountType,
      postFinishedSavingCallback,
      filesToDelete,
      campaignID,
      instructions,
      name,
      calendarID,
      undefined,
      linkTitle,
      linkDescription,
      linkCustomFiles,
      videoTitle,
      context
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
      "Posts in templates must have instructions. Please make sure the instructions text area is not empty."
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

export const getArrayIndexWithHint = (
  array,
  trueOrFalseFunction,
  probableIndex
) => {
  // function used when you want to double check an array index
  // but dont want to run a search for it unless your copy of the index is wrong
  if (array[probableIndex] && trueOrFalseFunction(array[probableIndex])) {
    return probableIndex;
  } else {
    return array.indexOf(trueOrFalseFunction);
  }
};

// Taken from stack overflow
export function capitolizeWordsInString(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
export function capitolizeFirstChar(string) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
}
export function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
export async function savePost(
  _id,
  content,
  dateToPostInUtcTime,
  link,
  linkImage,
  postFiles,
  accountID,
  socialType,
  accountType,
  callback,
  filesToDelete,
  campaignID,
  instructions,
  name,
  calendarID,
  sendEmailReminder,
  linkTitle,
  linkDescription,
  linkCustomFiles,
  videoTitle,
  context
) {
  if (filesToDelete) {
    if (filesToDelete.length !== 0) {
      await axios.post("/api/post/delete/files/" + _id, filesToDelete);
    }
  }

  // Get current files
  let filesToSave = [];
  if (postFiles)
    for (let i = 0; i < postFiles.length; i++) {
      if (!postFiles[i].url) filesToSave.push(postFiles[i]);
    }

  // Everything seems okay, save post to database!
  if (context) context.handleChange({ saving: true });
  axios
    .post("/api/post", {
      _id,
      accountID,
      content,
      instructions,
      postingDate: dateToPostInUtcTime,
      link,
      linkImage,
      accountType,
      socialType,
      campaignID,
      name,
      calendarID,
      sendEmailReminder,
      linkTitle,
      linkDescription,
      linkCustomFiles,
      videoTitle
    })
    .then(res => {
      // Now we need to save images for post, Images are saved after post
      // Becuse they are handled so differently in the database
      // Text and images do not go well together
      const { post, success, message } = res.data;
      if (context) context.handleChange({ saving: false });

      if (success) {
        if (post._id && filesToSave.length !== 0) {
          // Make sure post actually saved
          // Now we add images

          // Make post request for files
          axios
            .post("/api/post/files", { postID: post._id, files: filesToSave })
            .then(response => {
              if (response.data.success) {
                callback(response.data.savedPost, true);
              } else {
                callback(post, true);
              }
            });
        } else {
          callback(post, true);
        }
      } else {
        callback(undefined, false, message);
      }
    });
}
export function postChecks(
  postingToAccountId,
  dateToPostInUtcTime,
  link,
  currentFiles,
  content,
  maxCharacters,
  socialType
) {
  let remainingCharacters = maxCharacters - content.length;
  if (link && socialType === "twitter") remainingCharacters += link.length - 23;

  if (remainingCharacters > maxCharacters) {
    alert("There are too many characters in this post!");
    return false;
  }
  if (socialType === "linkedin" && currentFiles && currentFiles.length > 1) {
    alert("You can only post one image to LinkedIn!");
    return false;
  }
  let currentUtcDate = moment()
    .utcOffset(0)
    .subtract("2", "minutes");
  // Make sure that the date is not in the past
  if (currentUtcDate > dateToPostInUtcTime) {
    alert(
      "Time travel is not yet possible! Please select a date in the future not in the past!"
    );
    return false;
  }

  if (postingToAccountId === "") {
    alert("Please select an account to post to!");
    return false;
  }

  // Check to make sure we have atleast a link, content, or an image
  if (content === "" && link === "" && currentFiles === []) {
    alert(
      "You are trying to create an empty post. We will not let you shoot yourself in the foot."
    );
    return;
  }
  return true;
}

export const getSocialTypeNumber = socialTypeString => {
  if (socialTypeString === "facebook") return 0;
  else if (socialTypeString === "twitter") return 1;
  else if (socialTypeString === "linkedin") return 2;
  else if (socialTypeString === "instagram") return 3;
};
export const getSocialTypeString = socialTypeIndex => {
  if (socialTypeIndex === 0) return "facebook";
  else if (socialTypeIndex === 1) return "twitter";
  else if (socialTypeIndex === 2) return "linkedin";
  else if (socialTypeIndex === 3) return "instagram";
};

export function postAttributeOptions(socialType) {
  if (socialType === "facebook") {
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: true,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: true
    };
  } else if (socialType === "twitter")
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: true
    };
  else if (socialType === "linkedin")
    return {
      canAddFilesToLink: true,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: true,
      linkPreviewCanShow: true
    };
  else if (socialType === "instagram")
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: false
    };
  else if (socialType === "blog")
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: false
    };
  else if (socialType === "newsletter")
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: false
    };
  else
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: false
    };
}
export const getPostColor = socialType => {
  if (socialType === "facebook") {
    return "#4267b2";
  } else if (socialType === "twitter") {
    return "#1da1f2";
  } else if (socialType === "linkedin") {
    return "#0077b5";
  } else if (socialType === "instagram") {
    return "#cd486b";
  } else if (socialType === "blog") {
    return "#e74c3c";
  } else if (socialType === "newsletter") {
    return "#fd651c";
  } else if (socialType === "custom") {
    return "#3dd6b4";
  } else {
    return "var(--five-purple-color)";
  }
};
export const getSocialCharacters = post_type => {
  if (post_type === "twitter") {
    return 280;
  } else if (post_type === "linkedin") {
    return 700;
  } else return undefined;
};
export const getPostIcon = socialType => {
  if (socialType === "facebook") return faFacebookSquare;
  else if (socialType === "twitter") return faTwitterSquare;
  else if (socialType === "linkedin") return faLinkedin;
  else if (socialType === "instagram") return faInstagram;
  else return false;
};
export const getPostIconRound = socialType => {
  if (socialType === "facebook") return faFacebookF;
  else if (socialType === "twitter") return faTwitter;
  else if (socialType === "linkedin") return faLinkedinIn;
  else if (socialType === "instagram") return faInstagram;
  else return false;
};

export const getSocialDisplayName = account => {
  let name;
  if (account.givenName)
    name =
      account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
  if (account.familyName)
    name +=
      " " +
      account.familyName.charAt(0).toUpperCase() +
      account.familyName.slice(1);
  if (account.username !== "" && account.username) name = account.username;

  return name;
};
