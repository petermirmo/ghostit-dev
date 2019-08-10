import axios from "axios";
import moment from "moment-timezone";
import { trySavePost } from "../../../componentFunctions";

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
    link: "",
    linkCustomFiles: [],
    linkDescription: "",
    linkImage: "",
    linkTitle: "",
    linkImagesArray: [],
    name: "",
    promptModifyCampaignDates: false,
    socialType: props.socialType,
    somethingChanged: false,
    videos: []
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
    stateVariable.videos = props.post.videos ? props.post.videos : [];
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

export const getCalendarAccounts = (calendarID, handleChangeRegular, props) => {
  axios.get("/api/calendar/accounts/" + calendarID).then(res => {
    const { success, err, message, accounts } = res.data;

    if (!success) {
      console.log(err);
      console.log(message);
      console.log("error while fetching calendar social accounts");
    } else {
      handleChangeRegular({ calendarAccounts: accounts }, () => {
        const result = getDefaultAccount(accounts, props);
        if (result && result.id && result.type) {
          handleChangeRegular({
            accountID: result.id,
            accountType: result.type
          });
        }
      });
    }
  });
};

export const findLink = (
  handleChangeRegular,
  linkDescription,
  linkTitle,
  textAreaString
) => {
  // Url regular expression
  let urlRegularExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

  let regex = new RegExp(urlRegularExpression);

  // Finds url
  let match = textAreaString.match(regex);

  let link;
  // Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
  if (match) {
    link = match[0];
    handleChangeRegular({
      link
    });
    getDataFromURL(handleChangeRegular, linkDescription, linkTitle, link);
  } else
    handleChangeRegular({
      link: "",
      linkTitle: "",
      linkImage: "",
      linkDescription: ""
    });
};

const getDataFromURL = (
  handleChangeRegular,
  linkDescription1,
  linkTitle1,
  newLink
) => {
  axios.post("/api/link", { link: newLink }).then(res => {
    const { loggedIn } = res.data;

    const { imgSrc, linkDescription, linkTitle } = res.data;

    if (!linkTitle1) linkTitle1 = linkTitle;
    if (!linkDescription1) linkDescription1 = linkDescription;

    if (res.data && imgSrc[0]) {
      const linkImage = imgSrc[0];

      handleChangeRegular({
        linkImagesArray: imgSrc,
        linkImage,
        linkTitle: linkTitle1,
        linkDescription: linkDescription1
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
    linkAccountToCalendarID: undefined,
    saving: true
  });
  axios
    .post("/api/calendar/account", {
      accountID: linkAccountToCalendarID,
      calendarID
    })
    .then(res => {
      const { success, err, message, account } = res.data;
      handleChangeRegular({ saving: false });
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

        handleChangeRegular(prevState => {
          return {
            calendarAccounts: [...prevState.calendarAccounts, account]
          };
        });
      }
    });
};

export const modifyCampaignDate = (
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
  handleChangeRegular(trySavePost(state, props, true));
  modifyCampaignDates(date);
};
