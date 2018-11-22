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
import { trySavePost } from "../../../componentFunctions";

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

    window.addEventListener("beforeunload", this.saveChangesOnClose);

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
    window.removeEventListener("beforeunload", this.saveChangesOnClose);
    this.saveChangesOnClose();
    this._ismounted = false;
  }
  saveChangesOnClose = () => {
    let { campaign, somethingChanged, socket, recipeEditing } = this.state;

    if (!recipeEditing && somethingChanged && campaign && socket) {
      socket.emit("campaign_editted", campaign);
      socket.on("campaign_saved", emitObject => {
        socket.off("campaign_saved");
        if (!emitObject || !emitObject.campaign) {
          this.props.notify(
            "danger",
            "Save Failed",
            "Campaign save was unsuccessful."
          );
        } else if (
          !emitObject.campaign.posts ||
          emitObject.campaign.posts.length < 1
        ) {
          if (campaign._id)
            this.props.triggerSocketPeers(
              "calendar_campaign_deleted",
              campaign._id
            );
          this.props.notify(
            "info",
            "Campaign Deleted",
            "Campaign had no scheduled posts and was deleted."
          );
        } else {
          const shareCampaignWithPeers = {
            ...emitObject.campaign,
            posts: this.state.posts
          };
          this.props.triggerSocketPeers(
            "calendar_campaign_saved",
            shareCampaignWithPeers
          );
          this.props.notify("success", "Campaign Saved", "", 3000);
        }
        socket.emit("close", campaign);
        this.props.updateCampaigns();
      });
    }
  };
  createStateVariable = props => {
    let startDate =
      new moment() > new moment(props.clickedCalendarDate)
        ? new moment()
        : new moment(props.clickedCalendarDate);
    let campaign = props.campaign
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
          color: "var(--campaign-color3)",
          calendarID: props.calendarID,
          recipeID: undefined
        };

    if (props.campaign && !moment.isMoment(campaign.startDate)) {
      campaign.startDate = new moment(campaign.startDate);
      campaign.endDate = new moment(campaign.endDate);
    }

    if (props.campaign && props.recipeEditing) {
      campaign.recipeID = campaign._id;
    }

    let activePostIndex;
    let posts = [];

    if (campaign.chosenStartDate) {
      // Only defined if made from recipe
      // set hour and minute of startDate
      const hour = campaign.startDate.get("hour");
      const minute = campaign.startDate.get("minute");
      campaign.chosenStartDate.set({ hour, minute });
    }

    let somethingChanged = props.campaign ? false : true;

    if (campaign.posts) {
      if (campaign.posts.length > 0) {
        posts = fillPosts(campaign, props.isRecipe, props.recipeEditing);
        activePostIndex = 0;
      }
      if (props.isRecipe && !props.recipeEditing) {
        // campaign is based off a recipe and the posts haven't been scheduled yet
        // so campaign.posts shouldn't exist as its only for saved posts
        delete campaign.posts;
        somethingChanged = true;
        campaign.userID = props.user.signedInAsUser
          ? props.user.signedInAsUser.id
            ? props.user.signedInAsUser.id
            : props.user._id
          : props.user._id;
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
      somethingChanged,
      confirmDelete: false,
      promptDeletePost: false,
      deleteIndex: undefined,
      campaignDeletedPrompt: false, // when user is working on a campaign and another user deletes that campaign
      postUpdatedPrompt: false, // when user's active post gets saved by another user, this prompt will let them know
      postDeletedPrompt: false, // ^^ but on delete
      showDeletePostPrompt: true, // give user option "Don't ask me again" for post deletion
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

    let socketConnected = false;

    if (!this.props.campaign || (isFromRecipe && !recipeEditing)) {
      socket.emit("new_campaign", campaign);
      socketConnected = true;

      socket.on("new_campaign_saved", campaignID => {
        socket.off("new_campaign_saved");
        campaign._id = campaignID;

        socket.emit("campaign_connect", {
          campaignID,
          name: this.props.user.email
        });

        this.props.notify(
          "info",
          "Campaign Created",
          "New campaign created.",
          2500
        );

        this.setState({ campaign, saving: false });
      });
    } else if (this.props.campaign && this.props.campaign._id) {
      socket.emit("campaign_connect", {
        campaignID: this.props.campaign._id,
        name: this.props.user.email
      });
      socketConnected = true;
      this.setState({ saving: false });
    } else this.setState({ saving: false });

    if (socketConnected) {
      socket.on("campaign_post_saved", post => {
        // update post if it's not active
        // if it is active, give user the option to load new changes or continue their edits.
        if (!post) return;
        const { posts, activePostIndex, listOfPostChanges } = this.state;
        const index = posts.findIndex(
          postObj => postObj._id.toString() === post._id.toString()
        );
        if (index === -1) {
          this.setState(prevState => {
            return { posts: [...prevState.posts, post] };
          });
        } else {
          // post exists already so we need to update it
          if (
            index === activePostIndex &&
            listOfPostChanges &&
            Object.keys(listOfPostChanges).length > 0
          ) {
            // the post that was updated is also the post currently being edited by this user
            // load the new post, but apply all the unsaved changes that this user has made
            // the user can change posts to discard their changes and see the updated post
            // or they can continue with their changes being applied to the updated post
            this.setState({ postUpdatedPrompt: true });
          }
          this.setState(prevState => {
            return {
              posts: [
                ...prevState.posts.slice(0, index),
                post,
                ...prevState.posts.slice(index + 1)
              ]
            };
          });
        }
      });

      socket.on("campaign_post_deleted", postID => {
        // remove post if it's not the active post
        // if it is the active post, notify user but give them the chance to save their edits
        const { posts, activePostIndex, listOfPostChanges } = this.state;
        if (
          posts[activePostIndex]._id.toString() === postID.toString() &&
          listOfPostChanges &&
          Object.keys(listOfPostChanges).length > 0
        ) {
          // post that was deleted is also the post that the user is in the middle of modifying
          this.setState(prevState => {
            return {
              postDeletedPrompt: true,
              posts: [
                ...prevState.posts.slice(0, activePostIndex),
                { ...prevState.posts[activePostIndex], _id: undefined },
                ...prevState.posts.slice(activePostIndex + 1)
              ]
            };
          });
        } else {
          const index = posts.findIndex(
            postObj => postObj._id.toString() === postID.toString()
          );
          if (index === -1) return;
          this.setState(
            prevState => {
              return {
                posts: [
                  ...prevState.posts.slice(0, index),
                  { ...prevState.posts[index], _id: undefined },
                  ...prevState.posts.slice(index + 1)
                ]
              };
            },
            () => this.deletePost(index)
          );
        }
      });

      socket.on("campaign_deleted", campaignID => {
        // give user the opportunity to re-save the campaign to save their work
        const { campaign, posts } = this.state;
        if (campaign._id.toString() !== campaignID.toString()) return;
        let newPosts = [];
        for (let i = 0; i < posts.length; i++) {
          newPosts.push({ ...posts[i], _id: undefined, campaignID: undefined });
        }
        this.setState({
          campaignDeletedPrompt: true,
          posts: newPosts,
          campaign: { ...campaign, _id: undefined }
        });
      });

      socket.on("campaign_modified", campaign => {
        // start/end dates, name, description, colour
        if (campaign._id.toString() !== this.state.campaign._id.toString())
          return;
        this.setState({ campaign });
      });
    }

    this.setState({ socket });
  };

  triggerCampaignPeers = (type, extra) => {
    const { socket, campaign } = this.state;
    if (socket && type && campaign) {
      socket.emit("trigger_campaign_peers", {
        campaignID: campaign._id,
        type,
        extra
      });
      this.props.triggerSocketPeers(type, extra, campaign._id);
    }
  };

  restoreCampaign = () => {
    // save campaign to get new campaignID
    // then apply that campaignID to each post
    const { socket, campaign } = this.state;
    socket.emit("new_campaign", { ...campaign, posts: [] });
    socket.on("new_campaign_saved", campaignID => {
      socket.off("new_campaign_saved");
      const { posts } = this.state;
      const newPosts = [];
      for (let i = 0; i < posts.length; i++) {
        newPosts.push({ ...posts[i], campaignID });
      }
      this.setState(prevState => {
        return {
          posts: newPosts,
          campaign: { ...prevState.campaign, _id: campaignID }
        };
      });
    });
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
      this.triggerCampaignPeers("campaign_deleted", campaign._id);
      this.props.triggerSocketPeers("calendar_campaign_deleted", campaign._id);
      this.props.close(false, "campaignModal");
      this.props.updateCampaigns();
    }
    this.setState({ confirmDelete: false });
  };

  updatePost = (updatedPost, index) => {
    let { posts, activePostIndex } = this.state;

    let post_index = index === undefined ? activePostIndex : index;

    let new_post = { ...posts[post_index], ...updatedPost };
    if (new_post.postingDate && !moment.isMoment(new_post.postingDate)) {
      new_post.postingDate = new moment(new_post.postingDate);
    }

    if (index === undefined) {
      // index is only defined if updatePost is being called because
      // the post's date is being changed to stay anchored to campaign.startDate.
      // in that case, we want listOfPostChanges to be unaffected, so only
      // reset it if we're saving because the user clicked Schedule Post.
      // also, the posts don't need to be re-sorted if all posts are moving the same amount
      posts = [
        ...posts.slice(0, post_index),
        new_post,
        ...posts.slice(post_index + 1)
      ];
      let returnObject = this.bubbleSortPosts(posts, activePostIndex);
      posts = returnObject.posts;
      this.setState({
        activePostIndex: returnObject.activePostIndex,
        listOfPostChanges: {},
        posts,
        somethingChanged: true
      });
    } else {
      this.setState(prevState => {
        return {
          posts: [
            ...prevState.posts.slice(0, post_index),
            new_post,
            ...prevState.posts.slice(post_index + 1)
          ],
          somethingChanged: true
        };
      });
    }
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

    let new_posts = [
      ...posts.slice(0, activePostIndex),
      updated_post,
      ...posts.slice(activePostIndex + 1)
    ];

    let new_activePostIndex = activePostIndex;

    let returnObject = this.bubbleSortPosts(new_posts, new_activePostIndex);

    this.setState({
      posts: returnObject.posts,
      activePostIndex: returnObject.activePostIndex,
      listOfPostChanges: {},
      somethingChanged: true
    });
  };

  deletePost = (index, dontAskAgain) => {
    const { posts, socket, campaign } = this.state;

    if (dontAskAgain) {
      this.setState({ showDeletePostPrompt: false });
    }

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
            this.triggerCampaignPeers(
              "campaign_post_deleted",
              posts[index]._id
            );
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
      listOfPostChanges,
      nextChosenPostIndex
    } = this.state;

    if (pendingPostType) {
      // this occurs when the user is trying to create a new post and their currently active post has unsaved changes
      this.setState({
        listOfPostChanges: {},
        promptChangeActivePost: false,
        pendingPostType: undefined,
        ...newPost(
          pendingPostType,
          posts,
          campaign,
          this.props.clickedCalendarDate,
          {}
        )
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

  tryChangingCampaignDates = (
    date,
    date_type,
    setDisplayAndMessage,
    anchorDates = false
  ) => {
    // function that gets passed to <DateTimePicker/> which lets it modify <CampaignModal/>'s start and end dates
    // before accepting the modifications, we must check to make sure that the new date doesn't invalidate any posts
    // for example, if you had a campaign from Sept 1 -> Sept 4 and a post on Sept 3,
    // then you tried to change the campaign to Sept 1 -> Sept 2, the post on Sept 3 will no longer be within the campaign dates
    // so we'll want to disallow this modification and let the user know what happened
    // it will be up to the user to either delete that post, or modify its posting date to within the intended campaign scope
    const { campaign, posts, activePostIndex, listOfPostChanges } = this.state;

    if (anchorDates && date_type === "startDate") {
      // modify each posting date and the campaign.endDate so that
      // each date stays the same distance away from startDate after startDate is changed
      const startDateDiff = date.diff(campaign.startDate); // difference in ms
      if (startDateDiff === 0) {
        return;
      }
      this.setState(
        prevState => {
          return {
            campaign: {
              ...prevState.campaign,
              startDate: date,
              endDate: new moment(
                prevState.campaign.endDate.add(startDateDiff, "milliseconds")
              )
            },
            somethingChanged: true
          };
        },
        () =>
          this.triggerCampaignPeers("campaign_modified", this.state.campaign)
      );
      for (let index = 0; index < posts.length; index++) {
        let post = posts[index];
        let new_date = new moment(post.postingDate).add(
          startDateDiff,
          "milliseconds"
        );
        if (
          index == activePostIndex &&
          listOfPostChanges &&
          Object.keys(listOfPostChanges).length > 0
        ) {
          // when the current post has changes, we should make sure that any date changes get
          // overwritten by this new date
          this.setState({
            listOfPostChanges: { ...listOfPostChanges, date: new_date }
          });
        }

        if (post._id) {
          // post is saved in DB so we need to save changes to DB
          // make sure that activePost's date gets changed but if it has other unsaved changes, those aren't discarded
          // date=postingDate, sendEmailReminder=emailReminder
          // postFinishedSavingCallback, setSaving
          let post_state = {
            ...post,
            date: new_date,
            sendEmailReminder: post.emailReminder ? true : false
          };
          let post_props = {
            setSaving: () => {
              this.setState({ saving: true });
            },
            postFinishedSavingCallback: savedPost => {
              this.updatePost(savedPost, index);
              this.triggerCampaignPeers("campaign_post_saved", savedPost);
              this.setState({ saving: false });
            }
          };
          trySavePost(post_state, post_props, true, true);
        } else {
          // post doesn't need to be updated in the DB so just update in this.state.posts
          let new_post = {
            ...post,
            postingDate: new_date
          };
          this.updatePost(new_post, index);
        }
      }
      return;
    }

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

  duplicatePost = post_index => {
    const { posts } = this.state;

    let new_post = {
      ...posts[post_index],
      postingDate: new moment(posts[post_index].postingDate),
      _id: undefined
    };

    this.setState(prevState => {
      return {
        posts: [
          ...prevState.posts.slice(0, post_index + 1),
          new_post,
          ...prevState.posts.slice(post_index + 1)
        ],
        somethingChanged: true
      };
    });
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
              socket.off("post_added");
              campaign.posts = emitObject.campaignPosts;
              this.setState({ campaign, saving: false });
              this.triggercampaignPeers("campaign_post_saved", savedPost);
            });
          }}
          setSaving={() => {
            this.setState({ saving: true });
          }}
          calendarID={this.props.calendarID}
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
              socket.off("post_added");
              campaign.posts = emitObject.campaignPosts;
              this.triggerCampaignPeers("campaign_post_saved", savedPost);
              this.setState({ campaign, saving: false });
            });
          }}
          setSaving={() => {
            this.setState({ saving: true });
          }}
          calendarID={this.props.calendarID}
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
          notify={this.props.notify}
        />
      );
    }
  };

  createRecipe = () => {
    let { campaign, posts } = this.state;

    if (campaign.name === "") {
      this.props.notify(
        "danger",
        "Save Cancelled",
        "To publish this campaign as a template, please give it a name!"
      );
      return;
    } else if (!posts || posts.length < 1) {
      this.props.notify(
        "danger",
        "Save Cancelled",
        "You cannot save a template with no posts."
      );
      return;
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
        this.props.notify(
          "danger",
          "Save Failed",
          "Template save failed. Try again and if it fails again, please take a screenshot of your template to send to GhostIt to help us fix the problem!"
        );
      }

      this.props.notify(
        "success",
        "Template Saved",
        "Template has been saved successfully."
      );

      if (res.data.recipe) {
        this.setState(prevState => {
          return {
            campaign: {
              ...prevState.campaign,
              recipeID: res.data.recipe._id
            },
            somethingChanged: true
          };
        });
      }

      if (res.data.campaign) {
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
      let { campaign, socket } = this.state;
      campaign[index] = value;

      this.setState({ campaign, somethingChanged: true });

      socket.emit("campaign_editted", campaign);
      socket.on("campaign_saved", emitObject => {
        socket.off("campaign_saved");
        if (!emitObject || !emitObject.campaign) {
        } else {
          this.triggerCampaignPeers("campaign_modified", campaign);
        }
      });
    }
  };
  bubbleSortPosts = (posts, activePostIndex) => {
    for (let i = 0; i < posts.length; i++) {
      for (var j = 0; j < posts.length - i - 1; j++) {
        if (posts[j].postingDate > posts[j + 1].postingDate) {
          if (j == activePostIndex) activePostIndex += 1;
          else if (j + 1 == activePostIndex) activePostIndex -= 1;
          let tmp = posts[j];
          posts[j] = posts[j + 1];
          posts[j + 1] = tmp;
        }
      }
    }
    return { posts, activePostIndex };
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
      recipeEditing,
      showDeletePostPrompt,
      promptDeletePost,
      deleteIndex,
      socket,
      postUpdatedPrompt,
      postDeletedPrompt,
      campaignDeletedPrompt
    } = this.state;
    const { clickedCalendarDate } = this.props;
    const { startDate, endDate, name, color } = campaign;

    let firstPostChosen = Array.isArray(posts) && posts.length > 0;

    return (
      <div className="modal" onClick={() => this.attemptToCloseModal()}>
        <div
          className="large-modal common-transition"
          onClick={e => e.stopPropagation()}
        >
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
              <div className="post-navigation-container">
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
                  deletePost={
                    showDeletePostPrompt
                      ? index => {
                          this.setState({
                            promptDeletePost: true,
                            deleteIndex: index
                          });
                        }
                      : index => {
                          this.deletePost(index);
                        }
                  }
                  handleChange={this.handleChange}
                  recipeEditing={recipeEditing}
                  duplicatePost={index => {
                    this.duplicatePost(index);
                  }}
                />
              </div>

              {activePostIndex !== undefined && (
                <div className="post-container light-scrollbar">
                  {this.getActivePost()}
                </div>
              )}
            </div>
          )}
          <div className="modal-footer">
            <div className="campaign-footer-options">
              <div className="campaign-footer-option left">
                <div
                  onClick={() => {
                    this.props.handleChange(false, "campaignModal");
                    this.props.handleChange(true, "recipeModal");
                  }}
                  className="round-button button pa8 ma8 round"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="back-button-arrow"
                  />
                  Back to Templates
                </div>
              </div>

              {!recipeEditing && (
                <div className="campaign-specific-footer">
                  <div className="campaign-footer-option right">
                    <div
                      className="round-button button pa8 ma8"
                      title={
                        "Save campaign now.\nCampaigns are saved automatically when making any changes or navigating away from the campaign window."
                      }
                      onClick={() => {
                        //this.setState({ saving: true });
                        socket.emit("campaign_editted", campaign);
                        socket.on("campaign_saved", emitObject => {
                          socket.off("campaign_saved");
                          if (!emitObject || !emitObject.campaign) {
                            this.props.notify(
                              "danger",
                              "Save Failed",
                              "Campaign save was unsuccesful."
                            );
                          } else {
                            this.props.triggerSocketPeers(
                              "calendar_campaign_saved",
                              {
                                ...emitObject.campaign,
                                posts: this.state.posts
                              }
                            );
                            this.props.notify(
                              "success",
                              "Campaign Saved",
                              "Campaign was saved!",
                              3000
                            );
                          }
                          this.setState({ saving: false });
                        });
                      }}
                    >
                      Save Campaign
                    </div>
                  </div>
                  <div className="campaign-footer-option left">
                    <div
                      className="round-button button pa8 ma8"
                      title="Save a template based on this campaign."
                      onClick={this.createRecipe}
                    >
                      Save as Template
                    </div>
                  </div>
                </div>
              )}
              {!recipeEditing && (
                <div
                  className="campaign-footer-option right"
                  title="Delete campaign."
                >
                  <FontAwesomeIcon
                    onClick={() => this.handleChange(true, "confirmDelete")}
                    className="delete"
                    icon={faTrash}
                    size="2x"
                  />
                </div>
              )}
              {recipeEditing && (
                <div className="campaign-footer-option">
                  <div
                    className="round-button button pa8 ma8"
                    title={
                      "Click to save template. Unlike campaigns, templates are not saved automatically."
                    }
                    onClick={this.createRecipe}
                  >
                    Save Template
                  </div>
                </div>
              )}
            </div>
          </div>
          {campaignDeletedPrompt && (
            <ConfirmAlert
              close={() => this.props.close()}
              title="Campaign Deleted"
              message="Another calendar user just deleted this campaign. To save the campaign, you'll need to click Restore and then save each post separately."
              firstButton="Restore"
              secondButton="Delete"
              callback={response => {
                if (response) {
                  this.setState({ campaignDeletedPrompt: false });
                  this.restoreCampaign();
                } else {
                  this.props.close();
                }
              }}
            />
          )}
          {postDeletedPrompt && (
            <ConfirmAlert
              close={() => this.setState({ postDeletedPrompt: false })}
              title="Current Post Deleted"
              message="Another calendar user just deleted the post you are currently working on. If you keep working and save your changes, they will be saved as a new post."
              firstButton="Keep Working"
              secondButton="Delete Now"
              callback={response => {
                this.setState({ postDeletedPrompt: false });
                if (!response) this.deletePost(activePostIndex);
              }}
              type="modify"
            />
          )}
          {postUpdatedPrompt && (
            <ConfirmAlert
              close={() => this.setState({ postUpdatedPrompt: false })}
              title="Current Post Updated"
              message="Another calendar user has saved an updated version of this post. Would you like to discard your changes and load the new version?"
              firstButton="Discard"
              callback={response => {
                this.setState({ postUpdatedPrompt: false });
                if (response) this.setState({ listOfPostChanges: {} });
              }}
              helpTooltip="We recommend selecting Cancel, screenshotting or copying your changes somewhere else, then switch to a different post and back to this one. This allows you to view the new post changes without completely losing your changes."
            />
          )}
          {confirmDelete && (
            <ConfirmAlert
              close={() => this.setState({ confirmDelete: false })}
              title="Delete Campaign"
              message="Are you sure you want to delete this campaign? Deleting this campaign will also delete all posts in it."
              callback={this.deleteCampaign}
              type="delete-campaign"
            />
          )}
          {promptDeletePost && (
            <ConfirmAlert
              close={() => this.setState({ promptDeletePost: false })}
              title="Delete Post"
              message="Are you sure you want to delete the post?"
              checkboxMessage="Don't ask me again."
              callback={(response, dontAskAgain) => {
                this.setState({ promptDeletePost: false });
                if (!response) {
                  return;
                }
                this.deletePost(deleteIndex, dontAskAgain);
              }}
              type="delete-post"
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
