import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import DateTimePicker from "../DateTimePicker";
import ImagesDiv from "../ImagesDiv/";
import Textarea from "react-textarea-autosize";

import ConfirmAlert from "../Notifications/ConfirmAlert";

import { savePost } from "../../extra/functions/CommonFunctions";

import "./styles/";

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
      instructions: "",
      name: "Custom Task",
      sendEmailReminder: true
    };
    if (props.post) {
      stateVariable._id = props.post._id ? props.post._id : undefined;
      stateVariable.images = props.post.images ? props.post.images : [];
      stateVariable.socialType = props.post.socialType
        ? props.post.socialType
        : props.socialType;
      stateVariable.instructions = props.post.instructions
        ? props.post.instructions
        : "";
      stateVariable.campaignID = props.post.campaignID
        ? props.post.campaignID
        : undefined;
      stateVariable.name = props.post.name ? props.post.name : "Custom Task";
      stateVariable.sendEmailReminder = props.post.emailReminder ? true : false;
    }

    stateVariable.deleteImagesArray = [];
    stateVariable.somethingChanged = false;

    if (props.recipeEditor) {
      stateVariable.instructions = props.instructions;
      stateVariable.date = new moment(props.clickedCalendarDate);
      stateVariable.socialType = props.socialType;
      stateVariable.name =
        props.name && props.name !== "" ? props.name : "Custom Task";
    } else {
      stateVariable.date = props.post
        ? new moment(props.post.postingDate)
        : new moment() > new moment(props.clickedCalendarDate)
          ? new moment()
          : new moment(props.clickedCalendarDate);
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

    if (nextProps.recipeEditor) {
      this.setState(this.createState(nextProps));
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

  trySavePostInRecipe = (campaignStartDate, campaignEndDate) => {
    // function for saving a post within a recipe. the post does not get saved to the DB.
    const { name, instructions } = this.state;

    // validity checks
    if (!name || name === "") {
      alert("Posts must be named.");
      return;
    } else if (!instructions || instructions === "") {
      alert(
        "Posts cannot be empty. Please write some instructions in the text area."
      );
      return;
    }

    // date checking
    if (campaignStartDate && campaignEndDate) {
      if (!this.postingDateWithinCampaign(campaignStartDate, campaignEndDate)) {
        // prompt user to cancel the save or modify campaign dates

        this.setState({ promptModifyCampaignDates: true });
        return;
      }
    }

    this.props.savePostChanges(this.state);
    this.setState({ somethingChanged: false });
  };

  trySavePost = (campaignStartDate, campaignEndDate) => {
    const {
      _id,
      images,
      socialType,
      deleteImagesArray,
      somethingChanged,
      campaignID,
      name,
      sendEmailReminder,
      instructions
    } = this.state;
    let { date } = this.state;

    const { postFinishedSavingCallback, setSaving } = this.props;

    if (campaignStartDate && campaignEndDate) {
      if (!this.postingDateWithinCampaign(campaignStartDate, campaignEndDate)) {
        // prompt user to cancel the save or modify campaign dates
        this.setState({ promptModifyCampaignDates: true });
        return;
      }
    }

    setSaving();

    savePost(
      _id,
      undefined,
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
      instructions,
      name,
      sendEmailReminder
    );

    this.setState({ somethingChanged: false });
  };

  modifyCampaignDate = response => {
    if (!response) {
      this.setState({ promptModifyCampaignDates: false });
      return;
    }
    const { date } = this.state;
    this.setState({ promptModifyCampaignDates: false });
    if (this.props.recipeEditor) {
      this.trySavePostInRecipe();
    } else {
      this.trySavePost();
    }
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
      name,
      sendEmailReminder
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
          onChange={event =>
            this.handleChange(event.target.value, "instructions")
          }
          value={instructions}
          readOnly={!canEditPost}
        />
        {somethingChanged && (
          <button
            className="schedule-post-button"
            onClick={
              this.props.recipeEditor
                ? () =>
                    this.trySavePostInRecipe(
                      this.props.campaignStartDate,
                      this.props.campaignEndDate
                    )
                : () =>
                    this.trySavePost(
                      this.props.campaignStartDate,
                      this.props.campaignEndDate
                    )
            }
          >
            {this.props.recipeEditor ? "Save Changes" : "Save Task!"}
          </button>
        )}
        <div className="checkbox-and-writing-container">
          <div
            className="checkbox-box"
            onClick={() =>
              this.handleChange(!sendEmailReminder, "sendEmailReminder")
            }
          >
            <div
              className="checkbox-check"
              style={{ display: sendEmailReminder ? undefined : "none" }}
            />
          </div>
          Send an email reminder 30 minutes before scheduled time
        </div>
        <ImagesDiv
          postImages={images}
          handleChange={images => this.handleChange(images, "images")}
          imageLimit={4}
          canEdit={canEditPost}
          pushToImageDeleteArray={this.pushToImageDeleteArray}
        />
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
            close={() => this.setState({ promptModifyCampaignDates: false })}
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
