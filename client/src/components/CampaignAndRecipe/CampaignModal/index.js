import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";

import moment from "moment-timezone";
import io from "socket.io-client";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSocialCharacters } from "../../../extra/functions/CommonFunctions";

import Post from "../../Post";
import CustomTask from "../../CustomTask";
import Loader from "../../Notifications/Loader";
import ConfirmAlert from "../../Notifications/ConfirmAlert";

import PostTypePicker from "../CommonComponents/PostTypePicker";
import PostList from "../CommonComponents/PostList";
import CampaignRecipeHeader from "../CommonComponents/CampaignRecipeHeader";

import { fillPosts } from "../../../componentFunctions";

import "./styles/";

class CampaignModal extends Component {
  constructor(props) {
    super(props);
    let startDate =
      new moment() > new moment(props.clickedCalendarDate)
        ? new moment()
        : new moment(props.clickedCalendarDate);
    let campaign = props.campaign // only defined if user clicked on an existing campaign to edit
      ? props.campaign
      : {
          startDate,
          endDate: startDate.add(7, "days"),
          name: "",
          userID: props.user.signedInAsUser
            ? props.user.signedInAsUser.id
              ? props.user.signedInAsUser.id
              : props.user._id
            : props.user._id,
          color: "var(--campaign-color1)",
          recipeID: undefined
        };

    let stateVariable = {
      campaign,
      posts: [],
      listOfPostChanges: {},
      activePostIndex: undefined,

      saving: true,
      somethingChanged: props.campaign ? false : true,
      confirmDelete: false,
      newPostPromptActive: false, // when user clicks + for a new post to their campaign, show post type options for them to select
      promptChangeActivePost: false, // when user tries to change posts, if their current post hasn't been saved yet, ask them to save or discard
      nextChosenPostIndex: 0,
      datePickerMessage: "" // when user tries to set an invalid campaign start/end date, this message is displayed on the <DateTimePicker/>
    };

    this.state = stateVariable;
  }
  componentDidMount() {
    let { campaign } = this.props;

    document.addEventListener("keydown", this.handleKeyPress, false);

    if (campaign) {
      if (campaign.posts) {
        if (campaign.posts.length > 0) {
          this.setState({
            posts: fillPosts(campaign.posts),
            activePostIndex: 0
          });
        }
      }
    }

    this.initSocket();
  }

  componentWillUnmount() {
    let { campaign, somethingChanged, socket } = this.state;

    document.removeEventListener("keydown", this.handleKeyPress, false);

    if (somethingChanged && campaign && socket) {
      socket.emit("campaign_editted", campaign);
      socket.on("campaign_saved", emitObject => {
        socket.emit("close", campaign);

        this.props.updateCampaigns();
      });
    }
  }

  handleKeyPress = event => {
    const { confirmDelete, promptChangeActivePost } = this.state;
    if (confirmDelete || promptChangeActivePost) {
      return;
    }
    if (event.keyCode === 27) {
      // escape button pushed
      this.props.close();
    }
  };

  pauseEscapeListener = response => {
    if (response) {
      document.removeEventListener("keydown", this.handleKeyPress, false);
    } else {
      document.addEventListener("keydown", this.handleKeyPress, false);
    }
  };

  initSocket = () => {
    let { campaign, somethingChanged } = this.state;
    let { recipe } = this.props;
    let socket;

    if (process.env.NODE_ENV === "development")
      socket = io("http://localhost:5000");
    else socket = io();

    if (!this.props.campaign) {
      if (recipe) {
        campaign.name = recipe.name;
        campaign.color = recipe.color;
        campaign.startDate = recipe.startDate
          .set("hour", recipe.hour)
          .set("minute", recipe.minute);
        campaign.endDate = new moment(recipe.startDate).add(
          recipe.length,
          "millisecond"
        );
        campaign.recipeID = recipe._id;

        this.setState({ campaign });
      }
      socket.emit("new_campaign", campaign);

      socket.on("new_campaign_saved", campaignID => {
        campaign._id = campaignID;

        this.setState({ campaign, saving: false });

        if (recipe) {
          for (let index in recipe.posts) {
            recipe.posts[index].campaignID = campaignID;
            this.newPost(recipe.posts[index].socialType, recipe.posts[index]);
          }

          this.setState({ campaign });
        }
      });
    } else this.setState({ saving: false });

    this.setState({ socket });
  };

  newPost = (socialType, recipePost) => {
    const { posts, socket, campaign } = this.state;
    const { clickedCalendarDate } = this.props;
    const { startDate, _id } = campaign;

    let postingDate = clickedCalendarDate;
    if (clickedCalendarDate < campaign.startDate)
      postingDate = campaign.startDate;
    let instructions;

    if (recipePost) {
      postingDate = new moment(startDate).add(
        recipePost.postingDate,
        "millisecond"
      );
      instructions = recipePost.instructions;
    }

    this.setState({
      posts: [
        ...this.state.posts,

        {
          postingDate,
          socialType,
          campaignID: _id,
          instructions,
          canEditPost: true,
          name:
            socialType.charAt(0).toUpperCase() + socialType.slice(1) + " Post"
        }
      ],
      activePostIndex: posts.length,
      listOfPostChanges: {},

      newPostPromptActive: false
    });
  };

  deleteCampaign = response => {
    let { socket, campaign } = this.state;

    if (response) {
      socket.emit("delete", campaign);
      this.props.close(false, "campaignModal");
      this.props.updateCampaigns();
    }
    this.setState({ confirmDelete: false });
  };

  updatePost = updatedPost => {
    const { posts, activePostIndex } = this.state;

    let new_post = { ...posts[activePostIndex], ...updatedPost };

    this.setState({
      posts: [
        ...posts.slice(0, activePostIndex),
        new_post,
        ...posts.slice(activePostIndex + 1)
      ],
      listOfPostChanges: {},
      somethingChanged: true
    });
    return;
  };

  deletePost = (e, index) => {
    e.preventDefault();
    const { posts, socket, campaign } = this.state;

    let nextActivePost = this.state.activePostIndex;
    if (index === this.state.activePostIndex) {
      // deleting the currently active post so we should make the post above it active
      nextActivePost = index - 1 < 0 ? 0 : index - 1;
    } else if (index < this.state.activePostIndex) {
      // this makes it so the active post stays the same despite the array indexes being adjusted
      nextActivePost = this.state.activePostIndex - 1;
    }

    if (index === -1) {
      console.log("couldn't find post to delete.");
      return;
    } else if (!posts[index]._id) {
      // post hasn't been scheduled yet so don't need to delete it from DB

      this.setState(prevState => {
        return {
          posts: [
            ...prevState.posts.slice(0, index),
            ...prevState.posts.slice(index + 1)
          ],
          somethingChanged: true,
          activePostIndex: nextActivePost,
          firstPostChosen: prevState.posts.length <= 1 ? false : true,
          listOfPostChanges:
            index === prevState.activePostIndex
              ? {}
              : prevState.listOfPostChanges
        };
      });
    } else {
      socket.emit("delete-post", { post: posts[index], campaign });
      socket.on("post-deleted", emitObject => {
        socket.off("post-deleted");
        const { removedPost, removedFromCampaign, newCampaign } = emitObject;
        if (!removedPost) {
          console.log("failed to remove post from db");
        }
        if (!removedFromCampaign) {
          console.log("failed to remove post from campaign in db");
        }
        if (removedPost && removedFromCampaign) {
          if (!newCampaign) {
            console.log(
              "post removed from db and in campaign in db but no newCampaign object???"
            );
          } else {
            this.setState(prevState => {
              return {
                posts: [
                  ...prevState.posts.slice(0, index),
                  ...prevState.posts.slice(index + 1)
                ],
                campaign: { ...prevState.campaign, posts: newCampaign.posts },
                somethingChanged: true,
                activePostIndex: nextActivePost,
                listOfPostChanges:
                  index === prevState.activePostIndex
                    ? {}
                    : prevState.listOfPostChanges
              };
            });
          }
        }
      });
    }
  };

  selectPost = (e, arrayIndex) => {
    e.preventDefault();
    const { listOfPostChanges, activePostIndex } = this.state;

    if (activePostIndex === arrayIndex) {
      return;
    }
    if (Object.keys(listOfPostChanges).length > 0) {
      this.setState({
        promptChangeActivePost: true,
        nextChosenPostIndex: arrayIndex
      });
    } else {
      this.setState({ activePostIndex: arrayIndex });
    }
  };

  changeActivePost = response => {
    if (!response) {
      this.setState({ promptChangeActivePost: false });
      return;
    }
    const { nextChosenPostIndex } = this.state;
    this.setState({
      activePostIndex: nextChosenPostIndex,
      promptChangeActivePost: false,
      listOfPostChanges: {}
    });
  };

  backupPostChanges = (value, index) => {
    // function that gets called by <Post/> function to store all the changes that have happened
    // if the changes are saved, this list gets set back to empty
    // if this component's (campaignModal) state changes which causes a re-render,
    // we send this list of changes into the <Post/> component so it can re-execute those changes
    // otherwise the <Post/> component would lose all unsaved changes everytime a campaign attribute changed
    // say that when typing, this function would receive a series of calls such as:
    // backupPostChanges("t", "content"), backupPostChanges("tw", "content"), backupPostChanges("twi", "content"),
    // backupPostChanges("twit", "content"), etc..
    // we should probably only store one copy of each index ("content") since only the most recent matters
    const { listOfPostChanges, posts, activePostIndex } = this.state;
    const post = posts[activePostIndex];
    if (index === "date" && value.isSame(post.postingDate)) {
      delete listOfPostChanges[index];
    } else if (post[index] === value) {
      // same value that it originally was so no need to save its backup
      delete listOfPostChanges[index];
    } else {
      listOfPostChanges[index] = value;
    }
    this.setState({ listOfPostChanges });
  };

  modifyCampaignDates = postingDate => {
    // function that gets passed to <Post/> as a prop
    // <Post/> will use this function to push the campaign start/end dates in order to fit its posting date
    const { campaign, socket } = this.state;
    if (campaign.startDate > postingDate) {
      campaign.startDate = new moment(postingDate);
    } else if (campaign.endDate < postingDate) {
      campaign.endDate = new moment(postingDate);
    } else {
      console.log(
        "attempting to modify campaign date so post date fits, but posting date already fits?"
      );
    }
    socket.emit("campaign_editted", campaign); // make sure this saves in the DB in case the page crashes or reloads
    this.setState({ campaign, somethingChanged: true });
  };

  tryChangingCampaignDates = (date, date_type) => {
    /*
		this.handleCampaignChange(date, "endDate");
		if (date <= new moment(startDate)) {
			this.handleCampaignChange(date, "startDate");
		} */
    // function that gets passed to <DateTimePicker/> which lets it modify <CampaignModal/>'s start and end dates
    // before accepting the modifications, we must check to make sure that the new date doesn't invalidate any posts
    // for example, if you had a campaign from Sept 1 -> Sept 4 and a post on Sept 3,
    // then you tried to change the campaign to Sept 1 -> Sept 2, the post on Sept 3 will no longer be within the campaign dates
    // so we'll want to disallow this modification and let the user know what happened
    // it will be up to the user to either delete that post, or modify its posting date to within the intended campaign scope
    const { campaign, posts } = this.state;
    const dates = {
      startDate: campaign.startDate,
      endDate: campaign.endDate
    };
    dates[date_type] = date;
    const { startDate, endDate } = dates;

    let count_invalid = 0;

    for (let index in posts) {
      const postingDate = new moment(posts[index].post.postingDate);
      if (postingDate < startDate || postingDate > endDate) {
        count_invalid++;
      }
    }

    if (count_invalid === 0) {
      this.setState({ datePickerMessage: "" });
      if (date_type === "endDate") {
        this.handleCampaignChange(date, "endDate");
        if (date <= startDate) {
          this.handleCampaignChange(date, "startDate");
        }
      } else {
        this.handleCampaignChange(date, "startDate");
        if (date >= endDate) {
          this.handleCampaignChange(date, "endDate");
        }
      }
    } else {
      let post_string = count_invalid > 1 ? " posts" : " post";
      post_string =
        "Date/time change rejected due to " +
        count_invalid +
        post_string +
        " being outside the campaign scope.";
      this.setState({ datePickerMessage: post_string });
    }
  };

  getActivePost = () => {
    const {
      activePostIndex,
      posts,
      socket,
      campaign,
      listOfPostChanges
    } = this.state;
    const post_obj = posts[activePostIndex];

    if (post_obj.socialType === "custom") {
      return (
        <CustomTask
          post={post_obj}
          clickedCalendarDate={post_obj.postingDate}
          postFinishedSavingCallback={savedPost => {
            socket.emit("new_post", { campaign, post: savedPost });
            this.updatePost(savedPost);
            socket.on("post_added", emitObject => {
              campaign.posts = emitObject.campaignPosts;
              this.setState({ campaign, saving: false });
            });
          }}
          setSaving={() => {
            this.setState({ saving: true });
          }}
          socialType={post_obj.socialType}
          canEditPost={true}
          listOfChanges={
            Object.keys(listOfPostChanges).length > 0
              ? listOfPostChanges
              : undefined
          }
          backupChanges={this.backupPostChanges}
          campaignStartDate={campaign.startDate}
          campaignEndDate={campaign.endDate}
          modifyCampaignDates={this.modifyCampaignDates}
          pauseEscapeListener={this.pauseEscapeListener}
        />
      );
    } else {
      return (
        <Post
          post={post_obj}
          newActivePost={true}
          clickedCalendarDate={post_obj.postingDate}
          postFinishedSavingCallback={savedPost => {
            socket.emit("new_post", { campaign, post: savedPost });
            this.updatePost(savedPost);
            socket.on("post_added", emitObject => {
              campaign.posts = emitObject.campaignPosts;
              this.setState({ campaign, saving: false });
            });
          }}
          setSaving={() => {
            this.setState({ saving: true });
          }}
          socialType={post_obj.socialType}
          maxCharacters={getSocialCharacters(post_obj.socialType)}
          canEditPost={true}
          listOfChanges={
            Object.keys(listOfPostChanges).length > 0
              ? listOfPostChanges
              : undefined
          }
          backupChanges={this.backupPostChanges}
          campaignStartDate={campaign.startDate}
          campaignEndDate={campaign.endDate}
          modifyCampaignDates={this.modifyCampaignDates}
          pauseEscapeListener={this.pauseEscapeListener}
        />
      );
    }
  };

  createRecipe = () => {
    let { campaign, posts } = this.state;

    if (campaign.name === "") {
      alert("To publish this campaign as a recipe, please give it a name!");
      return;
    }

    axios.post("/api/recipe", { campaign, posts }).then(res => {
      const { success } = res.data;

      if (res.data.campaign) {
        campaign.recipeID = res.data.campaign.recipeID;
        this.setState({ campaign });
      }
    });
  };

  handleChange = (value, index, index2) => {
    if (index2) {
      let object = this.state[index];
      object[index2] = value;

      this.setState({ [index]: object });
    } else {
      this.setState({ [index]: value });
    }
  };

  handleCampaignChange = (value, index) => {
    if (index) {
      let { campaign } = this.state;
      campaign[index] = value;

      this.setState({ campaign, somethingChanged: true });
    }
  };

  render() {
    const {
      colors,
      posts,
      saving,
      confirmDelete,
      campaign,
      activePostIndex,
      newPostPromptActive,
      datePickerMessage,
      nextChosenPostIndex,
      promptChangeActivePost,
      listOfPostChanges
    } = this.state;
    const { startDate, endDate, name, color } = campaign;

    let firstPostChosen = Array.isArray(posts) && posts.length;

    return (
      <div className="modal" onClick={() => this.props.close()}>
        <div className="large-modal" onClick={e => e.stopPropagation()}>
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.props.close()}
          />
          <div
            className="back-button-top"
            onClick={() => {
              this.props.handleChange(false, "campaignModal");
              this.props.handleChange(true, "recipeModal");
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="back-button-arrow" />{" "}
            Back to Recipes
          </div>
          <CampaignRecipeHeader
            campaign={campaign}
            datePickerMessage={datePickerMessage}
            colors={colors}
            handleChange={this.handleCampaignChange}
            tryChangingDates={this.tryChangingCampaignDates}
          />

          {!firstPostChosen && (
            <div className="campaign-start-container">
              <div className="new-campaign-post-selection-write-up">
                How do you want to start off your campaign?
              </div>
              <PostTypePicker newPost={this.newPost} />
            </div>
          )}

          {firstPostChosen && (
            <div className="post-navigation-and-post-container">
              <PostList
                campaign={campaign}
                posts={posts}
                activePostIndex={activePostIndex}
                listOfPostChanges={listOfPostChanges}
                newPostPromptActive={newPostPromptActive}
                newPost={this.newPost}
                selectPost={this.selectPost}
                deletePost={this.deletePost}
                handleChange={this.handleChange}
                createRecipe={this.createRecipe}
              />

              {activePostIndex !== undefined && (
                <div className="post-container" style={{ borderColor: color }}>
                  {this.getActivePost()}
                </div>
              )}
            </div>
          )}

          <div className="modal-footer">
            <FontAwesomeIcon
              onClick={() => this.handleChange(true, "confirmDelete")}
              className="delete"
              icon={faTrash}
              size="2x"
            />
            <div
              className="back-button-bottom"
              onClick={() => this.props.close()}
            >
              <FontAwesomeIcon
                className="back-button-arrow"
                icon={faArrowLeft}
              />{" "}
              Back to Calendar
            </div>
          </div>
          {confirmDelete && (
            <ConfirmAlert
              close={() => this.setState({ confirmDelete: false })}
              title="Delete Campaign"
              message="Are you sure you want to delete this campaign? Deleting this campaign will also delete all posts in it."
              callback={this.deleteCampaign}
              type="delete-campaign"
            />
          )}
          {promptChangeActivePost && (
            <ConfirmAlert
              close={() => this.setState({ promptChangeActivePost: false })}
              title="Discard Unsaved Changes"
              message="Your current post has unsaved changes. Cancel and schedule the post if you'd like to save those changes."
              callback={this.changeActivePost}
              type="change-post"
            />
          )}
        </div>
        {saving && <Loader />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(CampaignModal);
