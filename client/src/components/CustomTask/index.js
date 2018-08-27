import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import DateTimePicker from "../DateTimePicker";
import ImagesDiv from "../ImagesDiv/";
import Textarea from "react-textarea-autosize";

import ConfirmAlert from "../Notifications/ConfirmAlert";

import { savePost } from "../../extra/functions/CommonFunctions";

class CustomTask extends Component {
  constructor(props) {
    super(props);

    this.state = this.createState(props);
  }
  createState = props => {
    let stateVariable = {
      _id: undefined,
      images: [],
      socialType: props.socialType,
      content: "",
      instructions: "",
      name: "Custom Task"
    };
    if (props.post) {
      stateVariable._id = props.post._id ? props.post._id : undefined;
      stateVariable.images = props.post.images ? props.post.images : [];
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
      stateVariable.name = props.post.name ? props.post.name : "Custom Task";
    }

    stateVariable.deleteImagesArray = [];
    stateVariable.timezone = props.timezone;
    stateVariable.somethingChanged = false;
    stateVariable.date = props.post
      ? new moment(props.post.postingDate)
      : new moment() > new moment(props.clickedCalendarDate)
        ? new moment()
        : new moment(props.clickedCalendarDate);

    if (props.recipePost) {
      stateVariable.date = props.recipePost.postingDate;
    }
    return stateVariable;
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.somethingChanged && nextProps.post && nextProps.post._id) {
      if (nextProps.post._id !== this.state._id) {
        // if we are changing to a different post, make sure somethingChanged is false so the schedule post button doesn't show
        this.setState({ somethingChanged: false });
      } else if (
        !nextProps.listOfChanges ||
        nextProps.listOfChanges.length === 0
      ) {
        this.setState({ somethingChanged: false });
      }
    }
    if (nextProps.post) {
      if (nextProps.post.campaignID) {
        this.setState(this.createState(nextProps));
      }
    }

    if (nextProps.listOfChanges) {
      // this is run when the campaignModal's state changes which results in a re-render of this
      // Post component. this block will make sure all the previous unsaved changes to the Post component are reapplied
      this.setState((prevState, nextProps) => {
        let changes = {};
        let somethingChanged = false;

        for (let index in nextProps.listOfChanges) {
          const change = nextProps.listOfChanges[index];
          if (prevState[index] !== change) {
            somethingChanged = true;
            changes[index] = change;
          }
        }
        if (somethingChanged) {
          changes.somethingChanged = true;
          return changes;
        }
      });
    }
  }
  componentDidMount() {
    this._ismounted = true;

    let {
      campaignID,
      campaignDateLowerBound,
      campaignDateUpperBound
    } = this.props;
    let { date } = this.state;

    if (campaignID) {
      if (
        date < new moment(campaignDateLowerBound) ||
        date > new moment(campaignDateUpperBound)
      ) {
        this.setState({ date: new moment(campaignDateLowerBound) });
      }
    }
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

  pushToImageDeleteArray = image => {
    let temp = this.state.deleteImagesArray;
    temp.push(image);
    if (this._ismounted) this.setState({ deleteImagesArray: temp });
  };
  postingDateWithinCampaign = () => {
    // check to see if the posting date is within the scope of the start and end of campaign
    const { date } = this.state;
    const { campaignStartDate, campaignEndDate } = this.props;
    if (date < campaignStartDate || date > campaignEndDate) {
      return false;
    }
    return true;
  };

  trySavePost = (campaignStartDate, campaignEndDate) => {
    const {
      _id,
      content,
      images,
      socialType,
      deleteImagesArray,
      somethingChanged,
      campaignID,
      name
    } = this.state;
    let { date } = this.state;

    const { postFinishedSavingCallback, setSaving } = this.props;

    if (campaignStartDate && campaignEndDate) {
      if (!this.postingDateWithinCampaign(campaignStartDate, campaignEndDate)) {
        // prompt user to cancel the save or modify campaign dates
        if (this.props.pauseEscapeListener)
          this.props.pauseEscapeListener(true);
        this.setState({ promptModifyCampaignDates: true });
        return;
      }
    }

    setSaving();

    savePost(
      _id,
      content,
      new moment(date).utcOffset(0),
      undefined,
      undefined,
      images,
      undefined,
      socialType,
      undefined,
      postFinishedSavingCallback,
      deleteImagesArray,
      campaignID,
      content,
      name
    );

    this.setState({ somethingChanged: false });
  };

  modifyCampaignDate = response => {
    if (this.props.pauseEscapeListener) this.props.pauseEscapeListener(false);
    if (!response) {
      this.setState({ promptModifyCampaignDates: false });
      return;
    }
    const { date } = this.state;
    this.setState({ promptModifyCampaignDates: false });
    this.trySavePost();
    this.props.modifyCampaignDates(date);
  };

  render() {
    const {
      _id,
      content,
      instructions,
      images,
      socialType,
      accountID,
      accountType,
      deleteImagesArray,
      somethingChanged,
      promptModifyCampaignDates,
      campaignID,
      name
    } = this.state;
    let { date } = this.state;

    const { postFinishedSavingCallback, setSaving, canEditPost } = this.props;

    return (
      <div className="posting-form">
        <input
          onChange={event => this.handleChange(event.target.value, "name")}
          value={name}
          className="title-input"
          placeholder="Title"
          readOnly={!canEditPost}
        />
        <Textarea
          className="instruction-textarea"
          placeholder="Describe this task!"
          onChange={event => this.handleChange(event.target.value, "content")}
          value={content}
          readOnly={!canEditPost}
        />
        <ImagesDiv
          postImages={images}
          handleChange={images => this.handleChange(images, "images")}
          imageLimit={4}
          canEdit={canEditPost}
          pushToImageDeleteArray={this.pushToImageDeleteArray}
        />
        {somethingChanged && (
          <button
            className="schedule-post-button"
            onClick={() =>
              this.trySavePost(
                this.props.campaignStartDate,
                this.props.campaignEndDate
              )
            }
          >
            Schedule Post!
          </button>
        )}
        <div className="time-picker-and-save-post">
          <DateTimePicker
            date={date}
            dateFormat="MMMM Do YYYY hh:mm A"
            handleChange={date => this.handleChange(date, "date")}
            style={{
              bottom: "-80px"
            }}
            dateLowerBound={new moment()}
            dateUpperBound={undefined}
          />
        </div>
        {promptModifyCampaignDates && (
          <ConfirmAlert
            close={() => {
              if (this.props.pauseEscapeListener)
                this.props.pauseEscapeListener(false);
              this.setState({ promptModifyCampaignDates: false });
            }}
            title="Modify Campaign Dates"
            message="Posting date is not within campaign start and end dates. Do you want to adjust campaign dates accordingly?"
            callback={this.modifyCampaignDate}
            type="modify"
          />
        )}
      </div>
    );
  }
}
export default CustomTask;
