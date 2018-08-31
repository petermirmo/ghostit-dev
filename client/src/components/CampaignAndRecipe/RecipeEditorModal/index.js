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

import Post from "../../Post";
import CustomTask from "../../CustomTask";
import Loader from "../../Notifications/Loader";
import ConfirmAlert from "../../Notifications/ConfirmAlert";

import PostTypePicker from "../CommonComponents/PostTypePicker";
import PostList from "../CommonComponents/PostList";
import CampaignRecipeHeader from "../CommonComponents/CampaignRecipeHeader";

import { fillPosts } from "../../../componentFunctions";

import "./styles/";

class RecipeEditorModal extends Component {
  constructor(props) {
    super(props);

    let recipe;
    if (props.recipe) {
      let dateNow = new moment();
      recipe = {
        startDate: dateNow,
        endDate: dateNow.add(props.recipe.length, "millisecond"),
        name: props.recipe.name,
        userID: props.recipe.userID,
        color: props.recipe.color,
        recipeID: props.recipe._id
      };
    } else {
      recipe = {
        startDate: new moment(),
        endDate: new moment().add(1, "day"),
        name: "",
        userID: props.user.signedInAsUser
          ? props.user.signedInAsUser.id
            ? props.user.signedInAsUser.id
            : props.user._id
          : props.user._id,
        color: "var(--campaign-color1)",
        recipeID: undefined
      };
    }

    let stateVariable = {
      recipe,
      posts: [],
      listOfPostChanges: {},
      activePostIndex: undefined,

      saving: false,
      somethingChanged: props.recipe ? false : true,
      confirmDelete: false,
      firstPostChosen: false, // when first creating a new campagin, prompt user to choose how they'd like to start the campaign
      newPostPromptActive: false, // when user clicks + for a new post to their campaign, show post type options for them to select
      promptChangeActivePost: false, // when user tries to change posts, if their current post hasn't been saved yet, ask them to save or discard
      nextChosenPostIndex: 0,
      datePickerMessage: "", // when user tries to set an invalid campaign start/end date, this message is displayed on the <DateTimePicker/>
      promptDiscardPostChanges: false, // when user tries to exit the modal but there are unsaved post changes
      promptDiscardRecipeChanges: false, // when user tries to exit the modal but there are unsaved recipe changes
      nextPostSocialType: undefined // when user attempts to make a new post, but has unsaved changes to their curernt post, we store the socialType so that if they decide to discard those changes, we know which type of post to create
    };

    this.state = stateVariable;
  }
  componentDidMount() {
    let { recipe } = this.props;

    document.addEventListener("keydown", this.handleKeyPress, false);

    if (recipe) {
      if (recipe.posts) {
        if (recipe.posts.length > 0) {
          this.setState({ posts: fillPosts(recipe.posts, this.state.recipe) });
          this.setState({ firstPostChosen: true, activePostIndex: 0 });
        }
      }
    }
  }

  componentWillUnmount() {
    let { recipe, somethingChanged } = this.state;

    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleKeyPress = event => {
    const { confirmDelete, promptChangeActivePost } = this.state;
    if (confirmDelete || promptChangeActivePost) {
      return;
    }
    if (event.keyCode === 27) {
      // escape button pushed
      this.attemptToCloseModal();
    }
  };

  pauseEscapeListener = response => {
    if (response) {
      document.removeEventListener("keydown", this.handleKeyPress, false);
    } else {
      document.addEventListener("keydown", this.handleKeyPress, false);
    }
  };

  newPost = socialType => {
    const { recipe, posts, activePostIndex, listOfPostChanges } = this.state;
    if (Object.keys(listOfPostChanges).length > 0) {
      // check to make sure we don't discard any unsaved changes to the current post
      this.setState({
        promptChangeActivePost: true,
        nextChosenPostIndex: undefined,
        nextPostSocialType: socialType
      });
      return;
    }
    const post = {
      postingDate: new moment(recipe.startDate),
      socialType,
      instructions: "",
      name: ""
    };
    this.setState(prevState => {
      return {
        posts: [...prevState.posts, post],
        activePostIndex: prevState.posts.length,
        newPostPromptActive: false,
        somethingChanged: true
      };
    });
  };

  deleteRecipe = response => {};

  deletePost = (e, index) => {
    e.preventDefault();

    let nextActivePost = this.state.activePostIndex;
    if (index === this.state.activePostIndex) {
      // deleting the currently active post so we should make the post above it active
      nextActivePost = index - 1 < 0 ? 0 : index - 1;
    } else if (index < this.state.activePostIndex) {
      // this makes it so the active post stays the same despite the array indexes being adjusted
      nextActivePost = this.state.activePostIndex - 1;
    }

    this.setState(prevState => {
      return {
        posts: [
          ...prevState.posts.slice(0, index),
          ...prevState.posts.slice(index + 1)
        ],
        activePostIndex: nextActivePost,
        somethingChanged: true,
        firstPostChosen: prevState.posts.length <= 1 ? false : true,
        listOfPostChanges:
          index === prevState.activePostIndex ? {} : prevState.listOfPostChanges
      };
    });
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
    const {
      nextChosenPostIndex,
      activePostIndex,
      posts,
      nextPostSocialType
    } = this.state;

    if (nextChosenPostIndex === undefined && nextPostSocialType) {
      // this occurs when the user is trying to create a new post and their currently active post has unsaved changes
      this.setState(
        {
          listOfPostChanges: {},
          promptChangeActivePost: false,
          nextPostSocialType: undefined
        },
        () => {
          this.newPost(nextPostSocialType);
        }
      );
    }

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

  modifyRecipeDates = postingDate => {
    // function that gets passed to <Post/> as a prop
    // <Post/> will use this function to push the campaign start/end dates in order to fit its posting date
    const { recipe } = this.state;
    if (recipe.startDate > postingDate) {
      recipe.startDate = new moment(postingDate);
    } else if (recipe.endDate < postingDate) {
      recipe.endDate = new moment(postingDate);
    } else {
      console.log(
        "attempting to modify recipe date so post date fits, but posting date already fits?"
      );
    }
    this.setState({ recipe, somethingChanged: true });
  };

  tryChangingRecipeDates = (date, date_type) => {
    // function that gets passed to <DateTimePicker/> which lets it modify <CampaignModal/>'s start and end dates
    // before accepting the modifications, we must check to make sure that the new date doesn't invalidate any posts
    // for example, if you had a campaign from Sept 1 -> Sept 4 and a post on Sept 3,
    // then you tried to change the campaign to Sept 1 -> Sept 2, the post on Sept 3 will no longer be within the campaign dates
    // so we'll want to disallow this modification and let the user know what happened
    // it will be up to the user to either delete that post, or modify its posting date to within the intended campaign scope
    const { recipe, posts } = this.state;
    const dates = {
      startDate: recipe.startDate,
      endDate: recipe.endDate
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
      this.setState({ datePickerMessage: "" });
      if (date_type === "endDate") {
        this.handleRecipeChange(date, "endDate");
        if (date <= startDate) {
          this.handleRecipeChange(date, "startDate");
        }
      } else {
        this.handleRecipeChange(date, "startDate");
        if (date >= endDate) {
          this.handleRecipeChange(date, "endDate");
        }
      }
    } else {
      let post_string = count_invalid > 1 ? " posts" : " post";
      post_string =
        "Date/time change rejected due to " +
        count_invalid +
        post_string +
        " being outside the recipe scope.";
      this.setState({ datePickerMessage: post_string });
    }
  };

  closeChecks = () => {
    const { listOfPostChanges, somethingChanged } = this.state;

    if (Object.keys(listOfPostChanges).length > 0) {
      // unsaved post changes
      this.setState({ promptDiscardPostChanges: true });
      return false;
    } else if (somethingChanged) {
      // unsaved recipe changes
      this.setState({ promptDiscardRecipeChanges: true });
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

  saveRecipe = () => {
    const { posts, recipe } = this.state;
    if (posts.length < 1) {
      alert("Cannot save a recipe with no posts.");
      return;
    } else if (!recipe.name || recipe.name === "") {
      alert("Recipes must have a name.");
      return;
    }
    this.setState({ saving: true });
    axios.post("/api/saveRecipe", { recipe, posts }).then(res => {
      // need error checking here so we can display error msg to user
      // for example to let them know the save failed
      const { success } = res.data;

      this.setState({ saving: false });

      if (!success) {
        alert(res.data.message);
        return;
      }

      const dbRecipe = res.data.recipe ? res.data.recipe : undefined;

      if (success && dbRecipe) {
        this.setState(prevState => {
          return {
            recipe: {
              ...prevState.recipe,
              recipeID: dbRecipe._id
            },
            somethingChanged: false
          };
        });
      }
    });
  };

  savePostChanges = post_state => {
    const { activePostIndex, posts } = this.state;

    const post = Object.assign({}, posts[activePostIndex]);
    post.name = post_state.name;
    post.instructions = post_state.instructions;
    post.postingDate = post_state.date;
    post.socialType = post_state.socialType;

    this.setState(prevState => {
      return {
        posts: [
          ...prevState.posts.slice(0, activePostIndex),
          post,
          ...prevState.posts.slice(activePostIndex + 1)
        ],
        somethingChanged: true,
        listOfPostChanges: {}
      };
    });
  };

  getActivePost = () => {
    const { posts, activePostIndex, listOfPostChanges, recipe } = this.state;
    const post = posts[activePostIndex];
    if (post.socialType === "custom") {
      return (
        <CustomTask
          recipeEditor={true}
          clickedCalendarDate={post.postingDate}
          socialType={post.socialType}
          instructions={post.instructions}
          name={post.name}
          listOfChanges={
            Object.keys(listOfPostChanges).length > 0
              ? listOfPostChanges
              : undefined
          }
          backupChanges={this.backupPostChanges}
          campaignStartDate={recipe.startDate}
          campaignEndDate={recipe.endDate}
          modifyCampaignDates={this.modifyRecipeDates}
          pauseEscapeListener={this.pauseEscapeListener}
          savePostChanges={this.savePostChanges}
          canEditPost={true}
        />
      );
    } else {
      return (
        <Post
          recipeEditor={true}
          clickedCalendarDate={post.postingDate}
          socialType={post.socialType}
          instructions={post.instructions}
          name={post.name}
          listOfChanges={
            Object.keys(listOfPostChanges).length > 0
              ? listOfPostChanges
              : undefined
          }
          backupChanges={this.backupPostChanges}
          campaignStartDate={recipe.startDate}
          campaignEndDate={recipe.endDate}
          modifyCampaignDates={this.modifyRecipeDates}
          pauseEscapeListener={this.pauseEscapeListener}
          savePostChanges={this.savePostChanges}
          canEditPost={true}
        />
      );
    }
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

  handleRecipeChange = (value, index) => {
    this.setState(prevState => {
      return {
        recipe: {
          ...prevState.recipe,
          [index]: value
        },
        somethingChanged: true
      };
    });
  };

  render() {
    const {
      colors,
      posts,
      saving,
      confirmDelete,
      recipe,
      firstPostChosen,
      activePostIndex,
      newPostPromptActive,
      datePickerMessage,
      promptChangeActivePost,
      promptDiscardPostChanges,
      promptDiscardRecipeChanges,
      listOfPostChanges,
      somethingChanged
    } = this.state;
    const { startDate, endDate, name, color } = recipe;

    return (
      <div className="modal" onClick={() => this.attemptToCloseModal()}>
        <div className="large-modal" onClick={e => e.stopPropagation()}>
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.attemptToCloseModal()}
          />
          <div
            className="back-button-top"
            onClick={() => {
              this.props.handleChange(false, "recipeEditorModal");
              this.props.handleChange(true, "recipeModal");
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="back-button-arrow" />{" "}
            Back to Recipes
          </div>
          <CampaignRecipeHeader
            campaign={recipe}
            datePickerMessage={datePickerMessage}
            colors={colors}
            handleChange={this.handleRecipeChange}
            tryChangingDates={this.tryChangingRecipeDates}
          />

          {!firstPostChosen && (
            <div className="campaign-start-container">
              <div className="new-campaign-post-selection-write-up">
                How do you want to start off your recipe?
              </div>
              <PostTypePicker newPost={this.newPost} />
            </div>
          )}

          {firstPostChosen && (
            <div className="post-navigation-and-post-container">
              <PostList
                recipeEditor={true}
                showRecipeSaveButton={somethingChanged}
                saveRecipe={this.saveRecipe}
                campaign={recipe}
                posts={posts}
                activePostIndex={activePostIndex}
                listOfPostChanges={listOfPostChanges}
                newPostPromptActive={newPostPromptActive}
                newPost={this.newPost}
                selectPost={this.selectPost}
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
            <FontAwesomeIcon
              onClick={() => this.handleChange(true, "confirmDelete")}
              className="delete"
              icon={faTrash}
              size="2x"
            />
            <div
              className="back-button-bottom"
              onClick={() => this.attemptToCloseModal()}
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
              title="Delete Recipe"
              message="Are you sure you want to delete this recipe?"
              callback={this.deleteRecipe}
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
              title="Unsaved Post Changes"
              message="Your current post has unsaved changes. Cancel and save the post if you'd like to save those changes."
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
          {promptDiscardRecipeChanges && (
            <ConfirmAlert
              close={() => this.setState({ promptDiscardRecipeChanges: false })}
              title="Unsaved Recipe Changes"
              message="This recipe has unsaved changes. Cancel and save the recipe if you'd like to save those changes."
              callback={response => {
                if (!response) {
                  this.setState({ promptDiscardRecipeChanges: false });
                  return;
                }
                this.setState(
                  { somethingChanged: false },
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

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(RecipeEditorModal);
