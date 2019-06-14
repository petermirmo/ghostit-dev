import moment from "moment-timezone";
import axios from "axios";

import {
  faFacebookSquare,
  faInstagram,
  faLinkedin,
  faTwitterSquare,
  faFacebookF,
  faTwitter,
  faLinkedinIn
} from "@fortawesome/free-brands-svg-icons";

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
  skip_checks
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
      sendEmailReminder
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
      linkCustomFiles
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
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Taken from stack overflow
export function mobileAndTabletcheck() {
  let check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
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
  linkCustomFiles
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
      linkCustomFiles
    })
    .then(res => {
      // Now we need to save images for post, Images are saved after post
      // Becuse they are handled so differently in the database
      // Text and images do not go well together
      const { post, success, message } = res.data;

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

export function postAttributeOptions(socialType) {
  if (socialType === "facebook") {
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: true
    };
  } else if (socialType === "twitter")
    return {
      canAddFilesToLink: false,
      canUploadPhoto: true,
      canUploadVideo: false,
      linkPreviewCanEdit: false,
      linkPreviewCanShow: false
    };
  else if (socialType === "linkedin")
    return {
      canAddFilesToLink: true,
      canUploadPhoto: false,
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
export function getPostColor(socialType) {
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
    return "var(--seven-purple-color)";
  } else {
    return "var(--five-purple-color)";
  }
}
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
