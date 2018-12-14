import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import DateTimePicker from "../DateTimePicker";
import SelectAccountDiv from "../SelectAccountDiv/";
import LinkPreview from "../LinkPreview";
import ImagesDiv from "../ImagesDiv/";
import { linkPreviewOptions } from "../../componentFunctions";
import { trySavePost } from "../../componentFunctions";

import ConfirmAlert from "../Notifications/ConfirmAlert";

import "./style.css";

class PostingOptions extends Component {
  constructor(props) {
    super(props);

    this.state = this.createState(props);
    this.state.promptLinkAccountToCalendar = false;
    this.state.linkAccountToCalendarID = undefined;
  }

  componentDidMount() {
    this._ismounted = true;
    this.findLink(this.state.content);
    this.getCalendarAccounts();
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listOfChanges) {
      // this is run when the campaignModal's state changes which results in a re-render of this
      // Post component. this block will make sure all the previous unsaved changes to the Post component are reapplied
      // it is also run when switching between tabs in the single task creation modal
      if (Object.keys(nextProps.listOfChanges).length > 0) {
        if (this._ismounted)
          this.setState({ ...nextProps.listOfChanges, somethingChanged: true });
      } else {
        if (this._ismounted) this.setState({ somethingChanged: false });
      }
      const currentAccount = this.state.calendarAccounts
        ? this.state.calendarAccounts.find(
            act => act.socialID === this.state.accountID
          )
        : undefined;
      if (
        this.state.accountID === "" ||
        (currentAccount && currentAccount.socialType !== nextProps.socialType)
      ) {
        const returnObj = this.getDefaultAccount(nextProps);
        if (this._ismounted)
          this.setState({
            accountID: returnObj.id,
            accountType: returnObj.type
          });
      }
    } else {
      // this block is entered when a new post is created within a campaign,
      // or when changing to a different post within a campaign
      // or at the beginning of a new single post creation,
      // or when a post/campaign that already exists is opened from the calendar
      if (this._ismounted) this.setState(this.createState(nextProps));
    }
  }
  createState = props => {
    let stateVariable = {
      _id: undefined,
      accountID: "",
      link: "",
      linkImage: "",
      images: [],
      accountType: "",
      socialType: props.socialType,
      content: "",
      instructions: "",
      name: "",
      promptModifyCampaignDates: false,
      calendarID: props.calendarID
    };
    if (props.post) {
      const returnObj = this.getDefaultAccount(props);
      stateVariable._id = props.post._id ? props.post._id : undefined;
      stateVariable.accountID = props.post.accountID
        ? props.post.accountID
        : returnObj.id;
      stateVariable.link = props.post.link ? props.post.link : "";
      stateVariable.linkImage = props.post.linkImage
        ? props.post.linkImage
        : "";
      stateVariable.images = props.post.images ? props.post.images : [];
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

    stateVariable.deleteImagesArray = [];
    stateVariable.linkImagesArray = [];
    stateVariable.somethingChanged = false;

    stateVariable.date =
      props.post && props.post.postingDate
        ? new moment(props.post.postingDate)
        : props.campaignStartDate
        ? new moment(props.campaignStartDate)
        : new moment(props.clickedCalendarDate);

    if (this.state) {
      if (this.state.showInstructions === true)
        stateVariable.showInstructions = true;
      else stateVariable.showInstructions = false;
    } else stateVariable.showInstructions = true;

    return stateVariable;
  };

  getCalendarAccounts = () => {
    const { calendarID } = this.state;
    axios.get("/api/calendar/accounts/" + calendarID).then(res => {
      const { success, err, message, accounts } = res.data;
      if (!success) {
        console.log(err);
        console.log(message);
        console.log("error while fetching calendar social accounts");
      } else {
        if (this._ismounted)
          this.setState({ calendarAccounts: accounts }, () => {
            const result = this.getDefaultAccount(this.props);
            if (result && result.id && result.type) {
              this.setState({ accountID: result.id, accountType: result.type });
            }
          });
      }
    });
  };

  getDefaultAccount = props => {
    if (!this.state) return { id: "", type: "" };
    const { socialType } = props;
    const { calendarAccounts } = this.state;
    if (calendarAccounts) {
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
    }
    return { id: "", type: "" };
  };

  handleChange = (value, index) => {
    if (this._ismounted)
      this.setState({
        [index]: value,
        somethingChanged: true
      });
    if (this.props.backupChanges) {
      this.props.backupChanges(value, index);
    }
  };

  pushToImageDeleteArray = image => {
    let temp = this.state.deleteImagesArray;
    temp.push(image);
    if (this._ismounted) this.setState({ deleteImagesArray: temp });
  };
  findLink(textAreaString) {
    // Url regular expression
    let urlRegularExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

    let regex = new RegExp(urlRegularExpression);

    // Finds url
    let match = textAreaString.match(regex);

    let link;
    // Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
    if (match) {
      link = match[0];
      this.getDataFromURL(link);
    } else if (this._ismounted) this.setState({ link: "" });
  }
  getDataFromURL = newLink => {
    let { linkImage, link } = this.state;
    console.log("going to backend");
    axios.post("/api/link", { link: newLink }).then(res => {
      let { loggedIn } = res.data;
      if (loggedIn === false) this.props.history.push("/sign-in");

      console.log("back to front end");
      console.log(res.data);
      console.log("\n");

      if (this._ismounted && res.data) {
        if (!linkImage) linkImage = res.data[0];
        if (link !== newLink) linkImage = res.data[0];
        if (this._ismounted)
          this.setState({
            link: newLink,
            linkImagesArray: res.data,
            linkImage: linkImage
          });
      }
    });
  };

  modifyCampaignDate = response => {
    if (!response) {
      if (this._ismounted) this.setState({ promptModifyCampaignDates: false });
      return;
    }
    const { date } = this.state;
    if (this._ismounted) this.setState({ promptModifyCampaignDates: false });
    if (this._ismounted)
      this.setState(trySavePost(this.state, this.props, true));
    this.props.modifyCampaignDates(date);
  };

  createActiveAccounts = (compareValue, compareValue2, accounts) => {
    let activePageAccountsArray = [];
    for (let index in accounts) {
      let account = accounts[index];
      if (
        account.accountType === "profile" &&
        account.socialType === "facebook"
      )
        continue;

      if (account[compareValue] === compareValue2) {
        activePageAccountsArray.push(account);
      }
    }
    return activePageAccountsArray;
  };

  linkAccountToCalendar = response => {
    const { linkAccountToCalendarID, calendarID } = this.state;
    if (!response)
      if (this._ismounted)
        return this.setState({
          promptLinkAccountToCalendar: false,
          linkAccountToCalendarID: undefined
        });
    if (this._ismounted)
      this.setState({
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
        if (this._ismounted) this.setState({ saving: false });
        if (!success) {
          console.log(err);
          this.props.notify("danger", "Link Account Failed", message);
        } else {
          this.props.notify("success", "Link Account Successful", message);
          if (this._ismounted)
            this.setState(prevState => {
              return {
                calendarAccounts: [...prevState.calendarAccounts, account]
              };
            });
        }
      });
  };

  render() {
    let {
      _id,
      content,
      instructions,
      link,
      linkImage,
      linkImagesArray,
      images,
      socialType,
      accountID,
      accountType,
      deleteImagesArray,
      somethingChanged,
      promptModifyCampaignDates,
      showInstructions,
      campaignID,
      name,
      date,
      calendarAccounts,
      calendarID,
      promptLinkAccountToCalendar
    } = this.state;

    const {
      postFinishedSavingCallback,
      setSaving,
      accounts,
      canEditPost,
      maxCharacters,
      accountsHomePage
    } = this.props;
    if (accountsHomePage) calendarAccounts = accountsHomePage;

    const returnOfLinkPreviewOptions = linkPreviewOptions(socialType);

    const linkPreviewCanShow = returnOfLinkPreviewOptions[0];
    const linkPreviewCanEdit = returnOfLinkPreviewOptions[1];

    // Loop through all accounts
    let inactivePageAccountsArray = [];
    let activePageAccountsArray = [];
    if (canEditPost) {
      activePageAccountsArray = this.createActiveAccounts(
        "socialType",
        socialType,
        calendarAccounts
      );
      inactivePageAccountsArray = this.createActiveAccounts(
        "socialType",
        socialType,
        accounts
      );
    } else {
      activePageAccountsArray = this.createActiveAccounts(
        "socialID",
        accountID,
        calendarAccounts
      );
    }

    if (
      activePageAccountsArray.length === 0 &&
      inactivePageAccountsArray.length === 0
    ) {
      let tempMessage = socialType;
      if (socialType === "facebook") tempMessage += " group/page";
      return (
        <div className="flex hc mt32 no-accounts">
          Connect {tempMessage} account! (Go to Social Profiles in the sidebar)
        </div>
      );
    }

    return (
      <div className="post-instruction-container">
        <div
          className="posting-container common-transition light-scrollbar pa16"
          style={{ width: showInstructions ? "60%" : "100%" }}
        >
          <Textarea
            className="posting-textarea pa8"
            placeholder="Success doesn't write itself!"
            onChange={event => {
              this.findLink(event.target.value);
              this.handleChange(event.target.value, "content");
            }}
            value={content}
            readOnly={!canEditPost}
          />
          <div className="post-images-and-linkPreview">
            <ImagesDiv
              postImages={images}
              handleChange={images => this.handleChange(images, "images")}
              imageLimit={4}
              canEdit={canEditPost}
              pushToImageDeleteArray={this.pushToImageDeleteArray}
            />
          </div>

          {maxCharacters && (
            <div className="max-characters">
              {maxCharacters - content.length}
            </div>
          )}

          <div className="flex wrap">
            <div className="flex column flex1">
              {linkPreviewCanShow && link && (
                <LinkPreview
                  linkPreviewCanEdit={linkPreviewCanEdit && canEditPost}
                  linkImagesArray={linkImagesArray}
                  linkImage={linkImage}
                  handleChange={image => this.handleChange(image, "linkImage")}
                  className="mx16 mt16"
                />
              )}
              <DateTimePicker
                date={date}
                dateFormat="MMMM Do YYYY hh:mm A"
                handleChange={date => this.handleChange(date, "date")}
                style={{
                  bottom: "100%",
                  top: "auto"
                }}
                canEdit={canEditPost}
                dateLowerBound={new moment()}
                dateUpperBound={undefined}
                className="mx16 mt16"
              />
            </div>
            {!this.props.recipeEditing && (
              <div className="flex1">
                <SelectAccountDiv
                  activePageAccountsArray={activePageAccountsArray}
                  inactivePageAccountsArray={inactivePageAccountsArray}
                  linkAccountToCalendarPrompt={actID => {
                    if (this._ismounted)
                      this.setState({
                        promptLinkAccountToCalendar: true,
                        linkAccountToCalendarID: actID
                      });
                  }}
                  activeAccount={accountID}
                  handleChange={account => {
                    this.handleChange(account.socialID, "accountID");
                    this.handleChange(account.accountType, "accountType");
                  }}
                  canEdit={canEditPost}
                />
              </div>
            )}
          </div>
          {canEditPost &&
            (somethingChanged || (!this.props.recipeEditing && !_id)) && (
              <button
                className="schedule-post-button button br4 pa8 mt8"
                onClick={() => {
                  if (this._ismounted)
                    this.setState(trySavePost(this.state, this.props));
                }}
              >
                {this.props.recipeEditing ? "Save Post" : "Schedule Post!"}
              </button>
            )}

          {!showInstructions && (
            <div
              className="show-more center-vertically right"
              onClick={() => {
                if (this._ismounted)
                  this.setState({
                    showInstructions: true
                  });
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
          )}

          {promptModifyCampaignDates && (
            <ConfirmAlert
              close={() => {
                if (this._ismounted)
                  this.setState({ promptModifyCampaignDates: false });
              }}
              title="Modify Campaign Dates"
              message="Posting date is not within campaign start and end dates. Do you want to adjust campaign dates accordingly?"
              callback={this.modifyCampaignDate}
              type="modify"
            />
          )}
          {promptLinkAccountToCalendar && (
            <ConfirmAlert
              close={() => {
                if (this._ismounted)
                  this.setState({ promptLinkAccountToCalendar: false });
              }}
              title="Link Account to Calendar"
              message={
                "To post to this calendar with this social account, the account must be linked to the calendar.\nWould you like to link them?\n(Every user within the calendar will be able to post to the account)."
              }
              callback={this.linkAccountToCalendar}
              type="link-account"
              firstButton="Link"
              secondButton="Cancel"
            />
          )}
        </div>
        <div
          className="instructions-container common-shadow light-scrollbar pa16"
          style={{
            width: showInstructions ? "40%" : "0",
            padding: showInstructions ? undefined : 0
          }}
        >
          {showInstructions && (
            <input
              onChange={event => this.handleChange(event.target.value, "name")}
              value={name}
              className="pa8 mb8 br4"
              placeholder="Title"
              readOnly={!canEditPost}
            />
          )}
          {showInstructions && (
            <Textarea
              className="instruction-textarea br4 pa8"
              placeholder="Include any comments or instructions here."
              onChange={event => {
                this.handleChange(event.target.value, "instructions");
              }}
              value={instructions}
              readOnly={!canEditPost}
            />
          )}
          {showInstructions && (
            <div
              className="show-more center-vertically left"
              onClick={() =>
                this.setState({
                  showInstructions: false
                })
              }
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
function isDifferentPost(nextProps, id) {
  if (nextProps) {
    if (nextProps.post) {
      if (nextProps._id !== id) return true;
    }
  }
  return false;
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}
export default connect(mapStateToProps)(PostingOptions);
