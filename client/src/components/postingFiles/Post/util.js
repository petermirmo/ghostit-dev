import axios from "axios";
import moment from "moment-timezone";
import { trySavePost } from "../../../componentFunctions";

import { isVideo } from "../../views/FileUpload/util";

export const anyVideos = files => {
  for (let index in files) {
    if (isVideo(files[index])) return true;
  }
  return false;
};

export const createState = (calendarAccounts, props) => {
  let stateVariable = {
    _id: undefined,
    accountID: "",
    accountType: "",
    calendarID: props.calendarID,
    content: "",
    files: [],
    filesToDelete: [],
    instructions: "",
    linkCustomFiles: [],
    linkDescription: "",
    linkImage: "",
    linkTitle: "",
    linkImagesArray: [],
    name: "",
    promptModifyCampaignDates: false,
    socialType: props.socialType,
    somethingChanged: false,
    videoTitle: ""
  };

  if (props.post) {
    const returnObj = getDefaultAccount(calendarAccounts, props);
    stateVariable._id = props.post._id ? props.post._id : undefined;
    stateVariable.accountID = props.post.accountID
      ? props.post.accountID
      : returnObj.id;
    stateVariable.link = props.post.link ? props.post.link : "";
    stateVariable.linkCustomFiles = props.post.linkCustomFiles
      ? props.post.linkCustomFiles
      : [];
    stateVariable.linkDescription = props.post.linkDescription
      ? props.post.linkDescription
      : "";
    stateVariable.linkImage = props.post.linkImage ? props.post.linkImage : "";
    stateVariable.linkTitle = props.post.linkTitle ? props.post.linkTitle : "";
    stateVariable.files = props.post.files ? props.post.files : [];
    stateVariable.accountType = props.post.accountType
      ? props.post.accountType
      : returnObj.type;
    stateVariable.socialType = props.post.socialType
      ? props.post.socialType
      : props.socialType;
    stateVariable.content = props.post.content ? props.post.content : "";
    stateVariable.instructions = props.post.instructions
      ? props.post.instructions
      : "";
    stateVariable.campaignID = props.post.campaignID
      ? props.post.campaignID
      : undefined;
    stateVariable.name = props.post.name ? props.post.name : "";
    stateVariable.videoTitle = props.post.videoTitle
      ? props.post.videoTitle
      : "";
  }

  stateVariable.date =
    props.post && props.post.postingDate
      ? new moment(props.post.postingDate)
      : props.campaignStartDate
      ? new moment(props.campaignStartDate)
      : new moment(props.clickedCalendarDate);
  return stateVariable;
};

export const createActiveAccounts = (
  accounts,
  close,
  compareValue,
  compareValue2
) => {
  let activePageAccountsArray = [];
  for (let index in accounts) {
    let account = accounts[index];
    if (account.accountType === "profile" && account.socialType === "facebook")
      continue;

    if (close) {
      if (account[compareValue] === compareValue2)
        activePageAccountsArray.push(account);
    } else activePageAccountsArray.push(account);
  }
  return activePageAccountsArray;
};

export const getMaxCharacters = (link, socialType) => {
  if (socialType) {
    if (socialType === "linkedin") return 700;
    else if (socialType === "twitter") {
      if (link) return 280 - 23 + link.length;
      else return 280;
    } else return undefined;
  } else return undefined;
};

export const findLink = (
  handleChangeRegular,
  linkDescription,
  linkTitle,
  textAreaString,
  link2,
  socialType
) => {
  // Url regular expression
  let urlRegularExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

  let regex = new RegExp(urlRegularExpression);

  // Finds url
  let match;
  if (textAreaString) match = textAreaString.match(regex);
  let link;
  // Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
  if (match) {
    link = match[0];
    handleChangeRegular({
      link
    });
    getDataFromURL(
      handleChangeRegular,
      linkDescription,
      linkTitle,
      link,
      link2
    );
  } else if (match == undefined && socialType == "twitter") {
    handleChangeRegular({
      link: "",
      linkTitle: "",
      linkImage: "",
      linkDescription: ""
    });
  } else if (link2) {
    getDataFromURL(handleChangeRegular, linkDescription, linkTitle, link2);
  }
};

export const findCurrentTypingStringInTextarea = (newContent, oldContent) => {
  // First get index of where the user is typing by comparing two strings
  let indexOfChange = 0;
  for (let index in newContent) {
    if (newContent[index] !== oldContent[index]) {
      indexOfChange = index;
      break;
    }
  }
  let currentTypingString = "";
  for (let index = indexOfChange; index < newContent.length; index++) {
    if (newContent[index] === " ") break;
    else currentTypingString += newContent[index];
  }
  for (let index = indexOfChange - 1; index >= 0; index--) {
    if (newContent[index] === " ") break;
    else currentTypingString = newContent[index] + currentTypingString;
  }

  return currentTypingString;
};

export const findTaggedPeople = (callback, text) => {
  // Find last @som string
  return sendTextToBackEndToGetListOfNames(text);
};
const sendTextToBackEndToGetListOfNames = text => {
  return ["james", "paul", "allen"];
};

const getDataFromURL = (
  handleChangeRegular,
  linkDescription1,
  linkTitle1,
  link1,
  link2
) => {
  axios.post("/api/link", { link: link1 }).then(res => {
    const { loggedIn } = res.data;

    const { imgSrc = "", linkDescription = "", linkTitle = "" } = res.data;

    if (res.data && imgSrc[0]) {
      const linkImage = imgSrc[0];

      handleChangeRegular({
        linkImagesArray: imgSrc,
        linkImage
      });
      if (link1 !== link2 && (link2 || !linkTitle1))
        handleChangeRegular({
          linkTitle,
          linkDescription
        });
    }
  });
};

export const getDefaultAccount = (calendarAccounts, props) => {
  const { socialType } = props;
  if (calendarAccounts && calendarAccounts.length !== 0) {
    // by default, set accountID to the first account
    for (let index in calendarAccounts) {
      let account = calendarAccounts[index];
      if (
        account.socialType === "facebook" &&
        account.accountType === "profile"
      )
        continue;
      if (account.socialType === socialType) {
        return { id: account.socialID, type: account.accountType };
      }
    }
  } else return { id: "", type: "" };
};

export const linkAccountToCalendar = (
  calendarID,
  context,
  handleChangeRegular,
  linkAccountToCalendarID,
  response
) => {
  if (!response)
    return handleChangeRegular({
      promptLinkAccountToCalendar: false,
      linkAccountToCalendarID: undefined
    });

  handleChangeRegular({
    promptLinkAccountToCalendar: false,
    linkAccountToCalendarID: undefined
  });
  context.handleChange({ saving: true });
  axios
    .post("/api/calendar/account", {
      accountID: linkAccountToCalendarID,
      calendarID
    })
    .then(res => {
      const { success, err, message, account } = res.data;
      context.handleChange({ saving: false });
      if (!success) {
        console.log(err);
        context.notify({
          type: "danger",
          title: "Link Account Failed",
          message
        });
      } else {
        context.notify({
          type: "success",
          title: "Link Account Successful",
          message
        });

        context.handleChange(prevState => {
          prevState.calendars[prevState.activeCalendarIndex].accounts.push(
            account
          );
          return {
            calendars: prevState.calendars
          };
        });
      }
    });
};

export const modifyCampaignDate = (
  context,
  date,
  handleChangeRegular,
  modifyCampaignDates,
  props,
  response,
  state
) => {
  if (!response)
    return handleChangeRegular({ promptModifyCampaignDates: false });

  handleChangeRegular({ promptModifyCampaignDates: false });
  handleChangeRegular(trySavePost(state, props, true, undefined, context));
  modifyCampaignDates(date);
};
