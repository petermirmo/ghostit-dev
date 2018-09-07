import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";

import moment from "moment-timezone";
import io from "socket.io-client";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import { getSocialCharacters } from "../../../extra/functions/CommonFunctions";

import Post from "../../Post";
import CustomTask from "../../CustomTask";
import Loader from "../../Notifications/Loader";
import ConfirmAlert from "../../Notifications/ConfirmAlert";

import PostTypePicker from "../CommonComponents/PostTypePicker";
import PostList from "../CommonComponents/PostList";
import CampaignRecipeHeader from "../CommonComponents/CampaignRecipeHeader";

import {
  fillPosts,
  newPost,
  createAppropriateDate
} from "../../../componentFunctions";

import "./styles/";

class CampaignModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.createStateVariable(this.props);
  }
  componentDidMount() {
    this._ismounted = true;

    if (!this.props.recipeEditing) this.initSocket();

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.attemptToCloseModal(); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);
  }

  componentWillUnmount() {
    let { campaign, somethingChanged, socket, recipeEditing } = this.state;

    if (!recipeEditing && somethingChanged && campaign && socket) {
      socket.emit("campaign_editted", campaign);
      socket.on("campaign_saved", emitObject => {
        socket.emit("close", campaign);

        this.props.updateCampaigns();
      });
    }
    this._ismounted = false;
  }
  createStateVariable = props => {
    let startDate =
      new moment() > new moment(props.clickedCalendarDate)
        ? new moment()
        : new moment(props.clickedCalendarDate);
    let campaign = props.campaign // only defined if user clicked on an existing campaign to edit
      ? props.campaign
      : {
          startDate,
          endDate: new moment(startDate).add(7, "days"),
          name: "",
          description: "",
          userID: props.user.signedInAsUser
            ? props.user.signedInAsUser.id
              ? props.user.signedInAsUser.id
              : props.user._id
            : props.user._id,
          color: "var(--campaign-color1)",
          recipeID: undefined
        };

    if (props.campaign && props.recipeEditing) {
      campaign.recipeID = campaign._id;
    }

    let activePostIndex;
    let posts = [];

    if (campaign.chosenStartDate) {
      // Only defined if made from recipe
      // set hour and minute of startDate
      campaign.startDate = new moment(campaign.startDate);
      const hour = campaign.startDate.get("hour");
      const minute = campaign.startDate.get("minute");
      campaign.chosenStartDate.set({ hour, minute });
    }

    if (campaign.posts) {
      if (campaign.posts.length > 0) {
        posts = fillPosts(campaign, props.isRecipe);
        activePostIndex = 0;
      }
    }
    if (campaign.chosenStartDate) {
      // Only defined if made from recipe
      campaign.endDate = createAppropriateDate(
        campaign.chosenStartDate,
        campaign.startDate,
        campaign.endDate
      );
      campaign.startDate = campaign.chosenStartDate;
    }

    let stateVariable = {
      campaign,
      posts,
      listOfPostChanges: {},
      activePostIndex,

      saving: !props.recipeEditing,
      somethingChanged: props.campaign ? false : true,
      confirmDelete: false,
      promptChangeActivePost: false, // when user tries to change posts, if their current post hasn't been saved yet, ask them to save or discard
      promptDiscardPostChanges: false, // when user tries to exit modal while the current post has unsaved changes
      nextChosenPostIndex: 0,
      isFromRecipe: props.isRecipe,
      recipeEditing: props.recipeEditing,
      pendingPostType: undefined // when user tries to create a new post, but their current post has unsaved changes
    };

    return stateVariable;
  };

  initSocket = () => {
    let {
      campaign,
      somethingChanged,
      posts,
      isFromRecipe,
      recipeEditing
    } = this.state;
    let { clickedCalendarDate } = this.props;
    let socket;

    if (process.env.NODE_ENV === "development")
      socket = io("http://localhost:5000");
    else socket = io();

    if (!this.props.campaign || (isFromRecipe && !recipeEditing)) {
      socket.emit("new_campaign", campaign);

      socket.on("new_campaign_saved", campaignID => {
        campaign._id = campaignID;

        this.setState({ campaign, saving: false });
      });
    } else this.setState({ saving: false });

    this.setState({ socket });
  };

  closeChecks = () => {
    const { listOfPostChanges, somethingChanged } = this.state;

    if (Object.keys(listOfPostChanges).length > 0) {
      // unsaved post changes
      this.setState({ promptDiscardPostChanges: true });
      return false;
    }

    return true;
  };

  attemptToCloseModal = () => {
    // function called when the user tries to close the modal
    // we check to see if there are any unsaved changes on the current post and the recipe
    if (!this.closeChecks()) {
      return;
    }
    this.props.close();
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

  savePostChanges = date => {
    // function called when user saves a post as part of a recipe and not part of a campaign
    // post doesn't get saved in DB so we need to store it within this modal's state instead
    const { activePostIndex, listOfPostChanges, posts } = this.state;
    const updated_post = {
      ...posts[activePostIndex],
      ...listOfPostChanges,
      postingDate: date
    };

    this.setState(prevState => {
      return {
        posts: [
          ...prevState.posts.slice(0, activePostIndex),
          updated_post,
          ...prevState.posts.slice(activePostIndex + 1)
        ],
        listOfPostChanges: {},
        somethingChanged: true
      };
    });
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

  changeActivePost = response => {
    if (!response) {
      this.setState({
        promptChangeActivePost: false,
        pendingPostType: undefined
      });
      return;
    }
    const {
      pendingPostType,
      posts,
      campaign,
      clickedCalendarDate,
      listOfPostChanges,
      nextChosenPostIndex
    } = this.state;

    if (pendingPostType) {
      // this occurs when the user is trying to create a new post and their currently active post has unsaved changes
      this.setState({
        listOfPostChanges: {},
        promptChangeActivePost: false,
        pendingPostType: undefined,
        ...newPost(pendingPostType, posts, campaign, clickedCalendarDate, {})
      });
    } else {
      this.setState({
        activePostIndex: nextChosenPostIndex,
        promptChangeActivePost: false,
        listOfPostChanges: {}
      });
    }
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
    const { campaign, socket, recipeEditing } = this.state;
    if (campaign.startDate > postingDate) {
      campaign.startDate = new moment(postingDate);
    } else if (campaign.endDate < postingDate) {
      campaign.endDate = new moment(postingDate);
    } else {
      console.log(
        "attempting to modify campaign date so post date fits, but posting date already fits?"
      );
    }
    if (!recipeEditing) socket.emit("campaign_editted", campaign); // make sure this saves in the DB in case the page crashes or reloads
    this.setState({ campaign, somethingChanged: true });
  };

  tryChangingCampaignDates = (date, date_type, setDisplayAndMessage) => {
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
      const postingDate = new moment(posts[index].postingDate);
      if (postingDate < startDate || postingDate > endDate) {
        count_invalid++;
      }
    }

    if (count_invalid === 0) {
      setDisplayAndMessage(false, "");
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
      setDisplayAndMessage(true, post_string);
    }
  };

  getActivePost = () => {
    const {
      activePostIndex,
      posts,
      socket,
      campaign,
      listOfPostChanges,
      recipeEditing
    } = this.state;
    const post_obj = posts[activePostIndex];

    if (post_obj.socialType === "custom") {
      return (
        <CustomTask
          post={post_obj}
          postFinishedSavingCallback={savedPost => {
            this.setState({ saving: true });
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
          recipeEditing={recipeEditing}
          savePostChanges={this.savePostChanges}
        />
      );
    } else {
      return (
        <Post
          post={post_obj}
          postFinishedSavingCallback={savedPost => {
            this.setState({ saving: true });
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
          recipeEditing={recipeEditing}
          savePostChanges={this.savePostChanges}
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
    for (let index in posts) {
      const post = posts[index];
      if (!post.instructions || post.instructions === "") {
        alert(
          "All posts in a recipe must have instructions. Make sure each post has instructions then try saving again."
        );
        return;
      }
    }

    this.setState({ saving: true });

    axios.post("/api/recipe", { campaign, posts }).then(res => {
      const { success } = res.data;

      this.setState({ saving: false });

      if (!success) {
        console.log(
          "recipe save unsuccessful. res.data.message then res.data.campaign"
        );
        console.log(res.data.message);
        console.log(res.data.campaign);
        if (res.data.message) {
          alert(res.data.message);
        }
      }

      if (res.data.campaign) {
        campaign.recipeID = res.data.campaign.recipeID;
        this.setState(prevState => {
          return {
            campaign: {
              ...prevState.campaign,
              recipeID: res.data.campaign.recipeID
            }
          };
        });
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
      posts,
      saving,
      confirmDelete,
      campaign,
      activePostIndex,
      nextChosenPostIndex,
      promptChangeActivePost,
      promptDiscardPostChanges,
      listOfPostChanges,
      recipeEditing
    } = this.state;
    const { clickedCalendarDate } = this.props;
    const { startDate, endDate, name, color } = campaign;

    let firstPostChosen = Array.isArray(posts) && posts.length > 0;

    return (
      <div className="modal" onClick={() => this.attemptToCloseModal()}>
        <div className="large-modal" onClick={e => e.stopPropagation()}>
          <CampaignRecipeHeader
            campaign={campaign}
            handleChange={this.handleCampaignChange}
            tryChangingDates={this.tryChangingCampaignDates}
            backToRecipes={() => {
              this.props.handleChange(false, "campaignModal");
              this.props.handleChange(true, "recipeModal");
            }}
            close={() => this.attemptToCloseModal()}
          />

          {!firstPostChosen && (
            <div className="campaign-start-container">
              <div className="new-campaign-post-selection-write-up">
                How do you want to start off your campaign?
              </div>
              <PostTypePicker
                newPost={socialType => {
                  this.setState(
                    newPost(socialType, posts, campaign, clickedCalendarDate)
                  );
                }}
              />
            </div>
          )}

          {firstPostChosen && (
            <div className="post-navigation-and-post-container">
              <PostList
                campaign={campaign}
                posts={posts}
                activePostIndex={activePostIndex}
                listOfPostChanges={listOfPostChanges}
                clickedCalendarDate={clickedCalendarDate}
                newPost={(
                  socialType,
                  posts,
                  campaign,
                  clickedCalendarDate,
                  callback
                ) =>
                  this.setState(
                    newPost(
                      socialType,
                      posts,
                      campaign,
                      clickedCalendarDate,
                      listOfPostChanges
                    )
                  )
                }
                deletePost={this.deletePost}
                handleChange={this.handleChange}
              />

              {activePostIndex !== undefined && (
                <div className="post-container" style={{ borderColor: color }}>
                  {this.getActivePost()}
                </div>
              )}
            </div>
          )}

          <div className="modal-footer">
            <div className="campaign-footer-options">
              <div
                className="campaign-footer-option blue"
                onClick={() => {
                  this.props.handleChange(false, "campaignModal");
                  this.props.handleChange(true, "recipeModal");
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="back-button-arrow"
                />
                Back to Templates
              </div>

              {!recipeEditing && (
                <div className="campaign-specific-footer">
                  <div
                    className="campaign-footer-option green"
                    onClick={() => this.props.close()}
                  >
                    Save Campaign
                  </div>
                  <div
                    className="campaign-footer-option blue"
                    onClick={this.createRecipe}
                  >
                    Save Campaign as Template
                  </div>
                  <div className="campaign-footer-option right blue">
                    <FontAwesomeIcon
                      onClick={() => this.handleChange(true, "confirmDelete")}
                      className="delete"
                      icon={faTrash}
                      size="2x"
                    />
                  </div>
                </div>
              )}
              {recipeEditing && (
                <div className="recipe-specific-footer">
                  <div
                    className="campaign-footer-option green"
                    onClick={this.createRecipe}
                  >
                    Save Template
                  </div>
                  <div className="campaign-footer-option right blue">
                    <FontAwesomeIcon
                      onClick={() => {}}
                      className="delete"
                      icon={faTrash}
                      size="2x"
                    />
                  </div>
                </div>
              )}
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
          {promptDiscardPostChanges && (
            <ConfirmAlert
              close={() => this.setState({ promptDiscardPostChanges: false })}
              title="Discard Unsaved Changes"
              message="Your current post has unsaved changes. Cancel and schedule the post if you'd like to save those changes."
              callback={response => {
                if (!response) {
                  this.setState({ promptDiscardPostChanges: false });
                  return;
                }
                this.setState(
                  { listOfPostChanges: {}, promptDiscardPostChanges: false },
                  this.attemptToCloseModal
                );
              }}
              type="change-post"
            />
          )}
        </div>
        {saving && <Loader />}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction
    },
    dispatch
  );
}
function mapStateToProps(state) {
  return {
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignModal);
