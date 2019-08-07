import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";
import Textarea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCommentAltLines } from "@fortawesome/pro-light-svg-icons";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";

import DateTimePicker from "../../DateTimePicker";
import SelectAccountDiv from "../SelectAccountDiv/";
import LinkPreview from "../../LinkPreview";
import FileUpload from "../../views/FileUpload";
import { postAttributeOptions } from "../../../componentFunctions";
import { trySavePost } from "../../../componentFunctions";

import ConfirmAlert from "../../notifications/ConfirmAlert";

import Consumer from "../../../context";

import {
  createState,
  createActiveAccounts,
  findLink,
  getCalendarAccounts,
  getDefaultAccount,
  linkAccountToCalendar,
  modifyCampaignDate
} from "./util";

import "./style.css";

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = createState(undefined, props);
    this.state.promptLinkAccountToCalendar = false;
    this.state.linkAccountToCalendarID = undefined;
  }

  componentDidMount() {
    this._ismounted = true;

    const { calendarID, content, linkDescription, linkTitle } = this.state;
    findLink(this.handleChangeRegular, linkDescription, linkTitle, content);
    getCalendarAccounts(calendarID, this.handleChangeRegular, this.props);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  componentWillReceiveProps(nextProps) {
    const { accountID, calendarAccounts } = this.state;
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
      const currentAccount = calendarAccounts
        ? calendarAccounts.find(act => act.socialID === accountID)
        : undefined;
      if (
        accountID === "" ||
        (currentAccount && currentAccount.socialType !== nextProps.socialType)
      ) {
        const returnObj = getDefaultAccount(calendarAccounts, nextProps);

        this.handleChangeRegular({
          accountID: returnObj.id,
          accountType: returnObj.type
        });
      }
    } else {
      // this block is entered when a new post is created within a campaign,
      // or when changing to a different post within a campaign
      // or at the beginning of a new single post creation,
      // or when a post/campaign that already exists is opened from the calendar
      this.handleChangeRegular(createState(calendarAccounts, nextProps));
    }
  }

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

  handleChangeRegular = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };

  render() {
    const {
      accountID,
      date,
      calendarAccounts,
      content,
      files,
      filesToDelete,
      instructions,
      link,
      linkCustomFiles,
      linkTitle,
      linkDescription,
      linkImagesArray,
      name,
      promptModifyCampaignDates,
      promptLinkAccountToCalendar,
      socialType,
      somethingChanged,
      _id
    } = this.state;

    const { accounts, canEditPost, maxCharacters, recipeEditing } = this.props; // Variables
    const { modifyCampaignDates } = this.props; // Functions

    const {
      canAddFilesToLink,
      canUploadPhoto,
      canUploadVideo,
      linkPreviewCanEdit,
      linkPreviewCanShow
    } = postAttributeOptions(socialType);

    // Loop through all accounts
    let inactivePageAccountsArray = [];
    let activePageAccountsArray = [];
    if (canEditPost) {
      activePageAccountsArray = createActiveAccounts(
        "socialType",
        socialType,
        calendarAccounts
      );
      inactivePageAccountsArray = createActiveAccounts(
        "socialType",
        socialType,
        accounts
      );
    } else {
      activePageAccountsArray = createActiveAccounts(
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
        <GIContainer className="column fill-parent relative mt32">
          <GIText
            className="bold tac fs-26"
            text={`Connect ${tempMessage} account!`}
            type="h4"
          />

          <Link to="/social-accounts">Go to Social Accounts Page</Link>
        </GIContainer>
      );
    }
    let remainingCharacters = maxCharacters - content.length;
    if (link && socialType === "twitter")
      remainingCharacters += link.length - 23;

    return (
      <Consumer>
        {context => (
          <GIContainer className="bg-light-grey column fill-parent ov-auto pa32">
            <GIContainer className="bg-white common-border x-fill pa32 br8">
              <GIContainer className="column x-70 pr8">
                {!recipeEditing && (
                  <SelectAccountDiv
                    activeAccount={accountID}
                    activePageAccountsArray={activePageAccountsArray}
                    canEdit={canEditPost}
                    handleChange={account => {
                      this.handleChange(account.socialID, "accountID");
                      this.handleChange(account.accountType, "accountType");
                    }}
                    inactivePageAccountsArray={inactivePageAccountsArray}
                    linkAccountToCalendarPrompt={actID =>
                      this.handleChangeRegular({
                        promptLinkAccountToCalendar: true,
                        linkAccountToCalendarID: actID
                      })
                    }
                  />
                )}
                <GIContainer className="align-center justify-start">
                  <GIText text="Post Date:" type="p" />
                  <GIContainer>
                    <DateTimePicker
                      canEdit={canEditPost}
                      className="mx16 my8"
                      date={date}
                      dateFormat="MMMM Do YYYY hh:mm A"
                      dateLowerBound={new moment()}
                      dateUpperBound={undefined}
                      handleChange={date => this.handleChange(date, "date")}
                    />
                  </GIContainer>
                </GIContainer>
                <Textarea
                  className="posting-textarea light-scrollbar pa8"
                  onChange={event => {
                    findLink(
                      this.handleChangeRegular,
                      linkDescription,
                      linkTitle,
                      event.target.value
                    );
                    this.handleChange(event.target.value, "content");
                  }}
                  placeholder="Success doesn't write itself!"
                  readOnly={!canEditPost}
                  value={content}
                />
                {maxCharacters && (
                  <GIContainer className="ml16">
                    {remainingCharacters}
                  </GIContainer>
                )}
                <GIContainer className="common-border bg-light-grey pa16">
                  {(canUploadPhoto || canUploadVideo) && (
                    <FileUpload
                      canEdit={canEditPost}
                      className="pa8"
                      currentFiles={files}
                      fileLimit={4}
                      filesToDelete={filesToDelete}
                      id="pdm"
                      handleParentChange={parentStateChangeObject =>
                        this.handleChangeRegular(parentStateChangeObject)
                      }
                      imageClassName="flex image tiny"
                      imageOnly={!canUploadVideo}
                    />
                  )}
                </GIContainer>

                {linkPreviewCanShow && link && (
                  <GIContainer className="container-box column medium mx16 mt16">
                    <LinkPreview
                      canAddFilesToLink={canAddFilesToLink && canEditPost}
                      canEdit={canEditPost}
                      handleChange={this.handleChange}
                      link={link}
                      linkCustomFiles={linkCustomFiles}
                      linkDescription={linkDescription}
                      linkImagesArray={linkImagesArray}
                      linkPreviewCanEdit={linkPreviewCanEdit && canEditPost}
                      linkTitle={linkTitle}
                      setCustomImages={linkImagesArray => {
                        this.handleChange(linkImagesArray[0], "linkImage");
                        this.handleChange(linkImagesArray, "linkImagesArray");
                      }}
                    />
                  </GIContainer>
                )}
              </GIContainer>

              <GIContainer className="fill-flex column">
                <GIContainer className="align-center mb16">
                  <FontAwesomeIcon
                    className="primary-font mr8"
                    icon={faCommentAltLines}
                  />
                  <GIText className="bold" text="Comments" type="p" />
                </GIContainer>
                <Textarea
                  className="fill-flex light-scrollbar common-border pa8 br8"
                  onChange={event => {
                    this.handleChange(event.target.value, "instructions");
                  }}
                  placeholder="Include any comments or instructions here."
                  readOnly={!canEditPost}
                  value={instructions}
                />
              </GIContainer>
            </GIContainer>
            {canEditPost && (somethingChanged || (!recipeEditing && !_id)) && (
              <GIContainer className="justify-end py8">
                <button
                  className="bg-orange-fade shadow-orange-2 white py8 br4"
                  onClick={() =>
                    this.handleChangeRegular(
                      trySavePost(this.state, this.props)
                    )
                  }
                >
                  <FontAwesomeIcon className="mr8" icon={faCheck} />
                  {recipeEditing ? "Save Post" : "Schedule Post!"}
                </button>
              </GIContainer>
            )}

            {promptModifyCampaignDates && (
              <ConfirmAlert
                callback={response =>
                  modifyCampaignDate(
                    date,
                    this.handleChangeRegular,
                    modifyCampaignDates,
                    this.props,
                    response,
                    this.state
                  )
                }
                close={() => {
                  if (this._ismounted)
                    this.setState({ promptModifyCampaignDates: false });
                }}
                message="Posting date is not within campaign start and end dates. Do you want to adjust campaign dates accordingly?"
                title="Modify Campaign Dates"
                type="modify"
              />
            )}
            {promptLinkAccountToCalendar && (
              <ConfirmAlert
                callback={response =>
                  linkAccountToCalendar(
                    calendarID,
                    context,
                    this.handleChangeRegular,
                    linkAccountToCalendarID,
                    response
                  )
                }
                close={() =>
                  this.handleChangeRegular({
                    promptLinkAccountToCalendar: false
                  })
                }
                firstButton="Link"
                message={
                  "To post to this calendar with this social account, the account must be linked to the calendar.\nWould you like to link them?\n(Every user within the calendar will be able to post to the account)."
                }
                secondButton="Cancel"
                title="Link Account to Calendar"
                type="link-account"
              />
            )}
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}
export default connect(mapStateToProps)(Post);
