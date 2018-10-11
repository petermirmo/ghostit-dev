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
import Carousel from "../Carousel";
import ImagesDiv from "../ImagesDiv/";
import { carouselOptions } from "../../extra/functions/CommonFunctions";
import { trySavePost } from "../../componentFunctions";

import ConfirmAlert from "../Notifications/ConfirmAlert";

import "./styles";

class PostingOptions extends Component {
  state = {
    showInstructions: true
  };
  constructor(props) {
    super(props);

    this.state = this.createState(props);
  }

  componentDidMount() {
    this._ismounted = true;
    this.findLink(this.state.content);
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
        this.setState({ ...nextProps.listOfChanges, somethingChanged: true });
      } else {
        this.setState({ somethingChanged: false });
      }
      if (this.state.accountID === "") {
        const returnObj = this.getDefaultAccount(nextProps);
        this.setState({ accountID: returnObj.id, accountType: returnObj.type });
      }
    } else {
      // this block is entered when a new post is created within a campaign,
      // or when changing to a different post within a campaign
      // or at the beginning of a new single post creation,
      // or when a post/campaign that already exists is opened from the calendar
      this.setState(this.createState(nextProps));
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
      promptModifyCampaignDates: false
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

    return stateVariable;
  };

  getDefaultAccount = props => {
    const { accounts, socialType } = props;
    if (accounts) {
      // by default, set accountID to the first account
      for (let index in accounts) {
        let account = accounts[index];
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
    } else {
      this.setState({ link: "" });
    }
  }
  getDataFromURL = newLink => {
    let { linkImage, link } = this.state;
    axios.post("/api/link", { link: newLink }).then(res => {
      let { loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();
      if (this._ismounted && res.data) {
        if (!linkImage) linkImage = res.data[0];
        if (link !== newLink) linkImage = res.data[0];
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
      this.setState({ promptModifyCampaignDates: false });
      return;
    }
    const { date } = this.state;
    this.setState({ promptModifyCampaignDates: false });
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

  render() {
    const {
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
      date
    } = this.state;

    const {
      postFinishedSavingCallback,
      setSaving,
      accounts,
      canEditPost,
      maxCharacters
    } = this.props;

    const returnOfCarouselOptions = carouselOptions(socialType);

    const linkPreviewCanShow = returnOfCarouselOptions[0];
    const linkPreviewCanEdit = returnOfCarouselOptions[1];

    // Loop through all accounts
    let activePageAccountsArray = [];
    if (canEditPost) {
      activePageAccountsArray = this.createActiveAccounts(
        "socialType",
        socialType,
        accounts
      );
    } else {
      activePageAccountsArray = this.createActiveAccounts(
        "socialID",
        accountID,
        accounts
      );
    }

    if (activePageAccountsArray.length === 0) {
      let tempMessage = socialType;
      if (socialType === "facebook") tempMessage += " group/page";
      return (
        <div className="flex hc mt32 no-accounts">
          Connect {tempMessage} account! (Go to Social Profiles in the sidebar)
        </div>
      );
    }

    return (
      <div className="post-instruction-container light-scrollbar">
        <div
          className="posting-container"
          style={{ width: showInstructions ? "60%" : "100%" }}
        >
          <Textarea
            className="posting-textarea"
            placeholder="Success doesn't write itself!"
            onChange={event => {
              this.findLink(event.target.value);
              this.handleChange(event.target.value, "content");
            }}
            value={content}
            readOnly={!canEditPost}
          />
          <div className="post-images-and-carousel">
            <ImagesDiv
              postImages={images}
              handleChange={images => this.handleChange(images, "images")}
              imageLimit={4}
              canEdit={canEditPost}
              pushToImageDeleteArray={this.pushToImageDeleteArray}
            />
            {linkPreviewCanShow &&
              link && (
                <Carousel
                  linkPreviewCanEdit={linkPreviewCanEdit && canEditPost}
                  linkImagesArray={linkImagesArray}
                  linkImage={linkImage}
                  handleChange={image => this.handleChange(image, "linkImage")}
                />
              )}
          </div>
          {maxCharacters && (
            <div className="max-characters">
              {maxCharacters - content.length}
            </div>
          )}

          <div className="flex vc wrap spacing top">
            {!this.props.recipeEditing && (
              <SelectAccountDiv
                activePageAccountsArray={activePageAccountsArray}
                activeAccount={accountID}
                handleChange={account => {
                  this.handleChange(account.socialID, "accountID");
                  this.handleChange(account.accountType, "accountType");
                }}
                canEdit={canEditPost}
              />
            )}
            <DateTimePicker
              date={date}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={date => this.handleChange(date, "date")}
              style={{
                bottom: "-80px"
              }}
              canEdit={canEditPost}
              dateLowerBound={new moment()}
              dateUpperBound={undefined}
            />
          </div>
          {canEditPost &&
            (somethingChanged || (!this.props.recipeEditing && !_id)) && (
              <button
                className="schedule-post-button"
                onClick={() =>
                  this.setState(trySavePost(this.state, this.props))
                }
              >
                {this.props.recipeEditing ? "Save Post" : "Schedule Post!"}
              </button>
            )}

          {!showInstructions && (
            <div
              className="show-more center-vertically right"
              onClick={() =>
                this.setState({
                  showInstructions: true
                })
              }
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
          )}

          {promptModifyCampaignDates && (
            <ConfirmAlert
              close={() => this.setState({ promptModifyCampaignDates: false })}
              title="Modify Campaign Dates"
              message="Posting date is not within campaign start and end dates. Do you want to adjust campaign dates accordingly?"
              callback={this.modifyCampaignDate}
              type="modify"
            />
          )}
        </div>
        <div
          className="instructions-container common-shadow"
          style={{
            width: showInstructions ? "40%" : "0",
            padding: showInstructions ? undefined : 0
          }}
        >
          {showInstructions && (
            <input
              onChange={event => this.handleChange(event.target.value, "name")}
              value={name}
              className="pl4 mb8"
              placeholder="Title"
              readOnly={!canEditPost}
            />
          )}
          {showInstructions && (
            <Textarea
              className="instruction-textarea"
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
