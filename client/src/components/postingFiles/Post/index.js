import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";
import Textarea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";
import { faCommentAltLines } from "@fortawesome/pro-light-svg-icons/faCommentAltLines";
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

import GIContainer from "../../containers/GIContainer";
import GIButton from "../../views/GIButton";
import GIText from "../../views/GIText";
import Dropdown from "../../views/Dropdown";

import DateTimePicker from "../../DateTimePicker";
import SelectAccountDiv from "../SelectAccountDiv/";
import LinkPreview from "../../LinkPreview";
import FileUpload from "../../views/FileUpload";
import { postAttributeOptions } from "../../../componentFunctions";
import { trySavePost } from "../../../componentFunctions";

import ConfirmAlert from "../../notifications/ConfirmAlert";

import Consumer from "../../../context";

import {
  anyVideos,
  createState,
  createActiveAccounts,
  findCurrentTypingStringInTextarea,
  findLink,
  getDefaultAccount,
  getMaxCharacters,
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

    const {
      calendarID,
      linkDescription,
      link,
      linkTitle,
      socialType
    } = this.state;

    findLink(
      this.handleChangeRegular,
      linkDescription,
      linkTitle,
      undefined,
      link,
      socialType
    );
  }
  componentWillUnmount() {
    this._ismounted = false;
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
      calendarID,
      content,
      files,
      filesToDelete,
      instructions,
      link,
      linkAccountToCalendarID,
      linkCustomFiles,
      linkTitle,
      linkDescription,
      linkImagesArray,
      name,
      promptModifyCampaignDates,
      promptLinkAccountToCalendar,
      socialType,
      somethingChanged,
      videoTitle,
      _id
    } = this.state;

    const {
      accounts,
      calendarAccounts,
      canEditPost,
      deletePost,
      recipeEditing,
      saveButtons
    } = this.props; // Variables
    const { close, modifyCampaignDates, switchTabState } = this.props; // Functions

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
        calendarAccounts,
        close,
        "socialType",
        socialType
      );
      inactivePageAccountsArray = createActiveAccounts(
        accounts,
        close,
        "socialType",
        socialType
      );
    } else {
      activePageAccountsArray = createActiveAccounts(
        calendarAccounts,
        close,
        "socialID",
        accountID
      );
    }

    if (
      activePageAccountsArray.length === 0 &&
      inactivePageAccountsArray.length === 0
    ) {
      return (
        <GIContainer className="bg-light-grey column x-fill pa32">
          <GIContainer className="bg-white common-border x-fill full-center column relative pa32 br8">
            {close && (
              <FontAwesomeIcon
                className="close"
                icon={faTimes}
                onClick={close}
                size="2x"
              />
            )}
            <GIText
              className="bold tac fs-26"
              text={`You don't have any social accounts connected!`}
              type="h4"
            />
            <Link to="/social-accounts">Go to Social Accounts Page</Link>
          </GIContainer>
          <GIContainer className="py16">{saveButtons}</GIContainer>
        </GIContainer>
      );
    }

    return (
      <Consumer>
        {context => (
          <GIContainer className="bg-light-grey column x-fill pa32">
            <GIContainer className="bg-white common-border x-fill relative pa32 br8">
              {close && (
                <FontAwesomeIcon
                  className="close"
                  icon={faTimes}
                  onClick={close}
                  size="2x"
                />
              )}
              <GIContainer className="column x-70 pr8">
                {!recipeEditing && (
                  <SelectAccountDiv
                    activeAccount={accountID}
                    activePageAccountsArray={activePageAccountsArray}
                    canEdit={canEditPost}
                    handleChange={account => {
                      this.handleChange(account.socialID, "accountID");
                      this.handleChange(account.accountType, "accountType");
                      this.handleChange(account.socialType, "socialType");
                    }}
                    inactivePageAccountsArray={inactivePageAccountsArray}
                    linkAccountToCalendarPrompt={actID =>
                      this.handleChangeRegular({
                        promptLinkAccountToCalendar: true,
                        linkAccountToCalendarID: actID
                      })
                    }
                    switchTabState={switchTabState}
                  />
                )}
                <GIContainer className="align-center justify-start">
                  <GIText className="fs-16 pr8" text="Post Date:" type="p" />
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

                {anyVideos(files) && (
                  <Textarea
                    className="mb8 pa8 br8"
                    onChange={event =>
                      this.handleChange(event.target.value, "videoTitle")
                    }
                    placeholder="Video Title"
                    readOnly={!canEditPost}
                    value={videoTitle}
                  />
                )}
                <GIContainer className="relative">
                  <Textarea
                    className="posting-textarea light-scrollbar pa8"
                    id="myTextArea"
                    onChange={event => {
                      const currentTypingString = findCurrentTypingStringInTextarea(
                        event.target.value,
                        content
                      );
                      findLink(
                        this.handleChangeRegular,
                        linkDescription,
                        linkTitle,
                        event.target.value,
                        link,
                        socialType
                      );
                      this.handleChange(event.target.value, "content");
                    }}
                    placeholder="Success doesn't write itself!"
                    readOnly={!canEditPost}
                    value={content}
                  />
                  {false && (
                    <Dropdown
                      className="shadow-medium"
                      dropdownActiveDisplayClassName=""
                      dropdownClassName=""
                      dropdownItems={[]}
                      handleParentChange={dropdownClickedItemObj =>
                        this.handleChangeRegular({
                          something: dropdownClickedItemObj.item
                        })
                      }
                      noTitle={true}
                      search
                    />
                  )}
                </GIContainer>
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
                      imageContainerClassName="align-end"
                      imageOnly={!canUploadVideo}
                    />
                  )}
                </GIContainer>
                {getMaxCharacters(link, socialType) && (
                  <GIContainer>
                    {getMaxCharacters(link, socialType) - content.length}
                  </GIContainer>
                )}

                {linkPreviewCanShow && link && (
                  <GIContainer className="x-300px column mx16 mt16">
                    <LinkPreview
                      canAddFilesToLink={canAddFilesToLink && canEditPost}
                      canEdit={canEditPost}
                      handleChange={this.handleChange}
                      handleChangeRegular={this.handleChangeRegular}
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
            <GIContainer className="x-fill py8">
              {saveButtons}
              <GIContainer className="fill-flex justify-end">
                {deletePost && (
                  <GIButton
                    className="common-border dark bg-white shadow-6 primary-font py8 px16 mr8 br4"
                    onClick={deletePost}
                    text="Delete"
                  />
                )}
                {canEditPost && (somethingChanged || (!recipeEditing && !_id)) && (
                  <GIButton
                    className="bg-orange-fade shadow-orange-2 white py8 px16 br4"
                    onClick={() =>
                      this.handleChangeRegular(
                        trySavePost(
                          this.state,
                          this.props,
                          undefined,
                          undefined,
                          context
                        )
                      )
                    }
                  >
                    <FontAwesomeIcon className="mr8" icon={faCheck} />
                    {recipeEditing ? "Save Post" : "Save & Schedule Post!"}
                  </GIButton>
                )}
              </GIContainer>
            </GIContainer>

            {promptModifyCampaignDates && (
              <ConfirmAlert
                callback={response =>
                  modifyCampaignDate(
                    date,
                    this.handleChangeRegular,
                    modifyCampaignDates,
                    this.props,
                    response,
                    this.state,
                    context
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
