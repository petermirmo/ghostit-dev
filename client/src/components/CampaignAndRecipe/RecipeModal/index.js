import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction, setTutorial } from "../../../redux/actions/";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faFile from "@fortawesome/fontawesome-free-solid/faFile";

import LoaderSimpleCircle from "../../Notifications/LoaderSimpleCircle";
import DateTimePicker from "../../DateTimePicker";
import ConfirmAlert from "../../Notifications/ConfirmAlert";
import Tutorial from "../../Tutorial/";

import { getPostColor, getPostIcon } from "../../../componentFunctions";

import "./style.css";

class RecipeModal extends Component {
  state = {
    usersRecipes: [],
    allRecipes: [],
    activeRecipes: [],
    loading: true,

    clientX: 0,
    clientY: 0,

    startDate: new moment(this.props.clickedCalendarDate),

    chooseRecipeDate: false,

    previewRecipeLocation: undefined,
    activePost: undefined,
    userID: undefined,
    promptDeleteRecipe: false
  };
  componentDidMount() {
    this._ismounted = true;
    if (this.props.tutorial.on) {
      let temp = { ...this.props.tutorial };
      temp.value = 5;

      let somethingChanged = false;
      for (let index in temp) {
        if (temp[index] != this.props.tutorial[index]) somethingChanged = true;
      }
      if (somethingChanged) this.props.setTutorial(temp);
    }

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.handleChange(false, "recipeModal"); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);

    this.getRecipes();
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  getRecipes = () => {
    axios.get("/api/recipes").then(res => {
      let { usersRecipes, allRecipes } = res.data;

      if (!usersRecipes) usersRecipes = [];
      if (!allRecipes) allRecipes = [];

      if (this._ismounted) {
        this.setState({
          usersRecipes,
          allRecipes,
          activeRecipes: usersRecipes,
          loading: false,
          userID: usersRecipes.length > 0 ? usersRecipes[0].userID : undefined
        });
      }
    });
  };

  createRecipeList = activeRecipes => {
    const {
      previewRecipeLocation,
      activePost,
      chooseRecipeDate,
      startDate,
      userID
    } = this.state;
    let recipeArray = [];

    let recipeIndex = -3;
    for (
      let recipeRow = 0;
      recipeRow <= Math.floor((activeRecipes.length + 3) / 3);
      recipeRow++
    ) {
      let rowArray = [];

      for (let recipeColumn = 0; recipeColumn < 3; recipeColumn++) {
        let recipeIndex2 = recipeIndex;
        let recipe = activeRecipes[recipeIndex2];
        if (recipeRow === 0 && recipeColumn === 0) {
          rowArray.push(this.customCampaignDiv(recipeIndex2));
          recipeIndex++;
          continue;
          newRecipeDiv;
        }
        if (recipeRow === 0 && recipeColumn === 1) {
          rowArray.push(this.newRecipeDiv(recipeIndex2));
          recipeIndex++;
          continue;
        }
        if (recipeRow === 0 && recipeColumn === 2) {
          rowArray.push(this.singleTask(recipeIndex2));
          recipeIndex++;
          continue;
        }

        // Preview when a recipe is clicked
        if (previewRecipeLocation === recipeIndex2) {
          recipeArray[recipeArray.length + 1] = this.previewRecipeDiv(
            recipeRow,
            recipeColumn,
            recipe,
            activePost,
            chooseRecipeDate
          );
        }

        // Put in blank divs to account for empty slots in final row
        if (!recipe) {
          recipe = {
            _id: recipeIndex2 + "recipe",
            name: "",
            cursor: "default"
          };
        }
        let opacity;
        if (!recipe.color) opacity = 0;
        rowArray.push(
          <div
            className="recipe-container pa8 ma8 flex column button"
            key={recipeIndex2 + "recipe"}
            onClick={e => {
              if (!activeRecipes[recipeIndex2]) return;
              e.stopPropagation();
              if (previewRecipeLocation === recipeIndex2) {
                this.setState({
                  previewRecipeLocation: undefined,
                  activePost: undefined
                });
              } else {
                window.setTimeout(() => {
                  if (document.getElementById("current-displayed-recipe"))
                    document
                      .getElementById("current-displayed-recipe")
                      .scrollIntoView();
                }, 10);

                this.setState({
                  previewRecipeLocation: recipeIndex2,
                  activePost: recipe.posts[0]
                });
              }
            }}
            style={{ opacity, cursor: recipe.cursor }}
          >
            <div className="recipe-name">{recipe.name}</div>
            <div className="recipe-description">{recipe.description}</div>
            <div className="recipe-information-container">
              <div className="recipe-uses">
                Use count:{" "}
                <span className="blue">
                  {recipe.useCount ? recipe.useCount : 0}
                </span>
                <br />
                {recipe.creator && (
                  <span className="italic">{recipe.creator}</span>
                )}
              </div>
            </div>
          </div>
        );
        recipeIndex++;
      }
      if (
        recipeArray[recipeArray.length - 2] ||
        recipeArray.length === 0 ||
        recipeArray.length === 1
      ) {
        recipeArray.push(
          <div className="recipes-container" key={recipeRow + "each_row"}>
            {rowArray}
          </div>
        );
      } else {
        recipeArray[recipeArray.length - 2] = (
          <div className="recipes-container" key={recipeRow + "each_row"}>
            {rowArray}
          </div>
        );
      }
    }

    return recipeArray;
  };
  deleteRecipe = deleteResponse => {
    if (deleteResponse) {
      const { activeRecipes, previewRecipeLocation } = this.state;
      const recipe = activeRecipes[previewRecipeLocation];
      axios.delete("/api/recipe/" + recipe._id, { recipe }).then(res => {
        this.getRecipes();
        this.setState({
          promptDeleteRecipe: false,
          previewRecipeLocation: undefined
        });
      });
    } else this.setState({ promptDeleteRecipe: false });
  };

  customCampaignDiv = recipeIndex2 => {
    return (
      <div
        className="recipe-container pa8 ma8 flex column button"
        key={recipeIndex2 + "recipe"}
      >
        <div
          className="custom-option"
          onClick={() => {
            this.props.handleChange(undefined, "clickedEvent");
            this.props.handleChange(false, "clickedEventIsRecipe");
            this.props.handleChange(false, "recipeEditing");
            this.props.handleChange(true, "campaignModal");
            this.props.handleChange(false, "recipeModal");
          }}
        >
          <FontAwesomeIcon size="2x" icon={faFile} className="file-icon-new" />
          <div className="new-campaign-text">
            New <br />
            Campaign
          </div>
          <div className="hover-active-div br4 px32 py8">Create</div>
        </div>
      </div>
    );
  };

  newRecipeDiv = recipeIndex2 => {
    return (
      <div
        className="recipe-container pa8 ma8 flex column button"
        key={recipeIndex2 + "recipe"}
      >
        <div
          className="custom-option"
          onClick={() => {
            this.props.handleChange(undefined, "clickedEvent");
            this.props.handleChange(false, "clickedEventIsRecipe");
            this.props.handleChange(true, "recipeEditing");
            this.props.handleChange(true, "campaignModal");
            this.props.handleChange(false, "recipeModal");
          }}
        >
          <FontAwesomeIcon size="2x" icon={faFile} className="file-icon-new" />
          <div className="new-campaign-text">
            New <br />
            Template
          </div>
          <div className="hover-active-div br4 px32 py8">Create</div>
        </div>
      </div>
    );
  };
  singleTask = recipeIndex2 => {
    const { tutorial } = this.props;
    return (
      <div
        className="recipe-container pa8 ma8 flex column button"
        key={recipeIndex2 + "recipe"}
      >
        <div
          className="custom-option"
          onClick={() => {
            this.props.handleChange(undefined, "clickedEvent");
            this.props.handleChange(true, "contentModal");
            this.props.handleChange(false, "recipeModal");
          }}
        >
          <FontAwesomeIcon size="2x" icon={faFile} className="file-icon-new" />
          <div className="new-campaign-text">
            Single
            <br /> Task
          </div>
          <div className="hover-active-div br4 px32 py8">Create</div>
          {tutorial.on && tutorial.value === 5 && (
            <Tutorial
              title="Tutorial"
              message="Click on 'Single Task' to create your first post!"
              position="bottom"
            />
          )}
        </div>
      </div>
    );
  };

  previewRecipeDiv = (
    recipeRow,
    recipeColumn,
    recipe,
    activePost,
    chooseRecipeDate
  ) => {
    let postDay;
    let lastPostDay;
    let signedInUserID = this.props.user.signedInAsUser
      ? this.props.user.signedInAsUser.id
      : this.props.user._id;
    if (recipe.posts)
      recipe.posts.sort((a, b) => {
        if (new moment(a.postingDate) < new moment(b.postingDate)) return -1;
        if (new moment(a.postingDate) > new moment(b.postingDate)) return 1;
      });
    return (
      <div
        className="preview-recipe"
        key={recipeRow + "preview_recipe" + recipeColumn}
        id="current-displayed-recipe"
      >
        <div className="recipe-posts-navigation">
          {recipe.posts.map((post_obj, index) => {
            let postDay =
              new moment(post_obj.postingDate).diff(recipe.startDate, "days") +
              1;
            if (postDay === lastPostDay) postDay = undefined;
            else lastPostDay = postDay;

            return (
              <div key={index + "post-div"}>
                {postDay && <div className="post-day">Day {postDay}</div>}
                <div
                  className="post-entry"
                  onClick={e => this.setState({ activePost: post_obj })}
                >
                  {getPostIcon(post_obj.socialType) && (
                    <FontAwesomeIcon
                      icon={getPostIcon(post_obj.socialType)}
                      color={getPostColor(post_obj.socialType)}
                      style={{ backgroundColor: "var(--white-theme-color)" }}
                      size="2x"
                    />
                  )}
                  {!getPostIcon(post_obj.socialType) && (
                    <div
                      className="custom-task-block-color"
                      style={{ backgroundColor: post_obj.color }}
                    />
                  )}

                  <div className="recipe-post-name">{post_obj.name}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="recipe-post-and-use-container">
          {activePost && (
            <div className="post-preview">
              <div className="title">{recipe.name}</div>
              <div className="preview-recipe-description">
                {recipe.description}
              </div>
              {signedInUserID === recipe.userID && (
                <div className="recipe-edit-delete-container">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="recipe-edit-button"
                    size="2x"
                    onClick={() => {
                      this.props.handleChange(recipe, "clickedEvent");
                      this.props.handleChange(true, "clickedEventIsRecipe");
                      this.props.handleChange(true, "recipeEditing");
                      this.props.handleChange(false, "recipeModal");
                      this.props.handleChange(true, "campaignModal");
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="recipe-delete-button"
                    size="2x"
                    onClick={() => this.setState({ promptDeleteRecipe: true })}
                  />
                </div>
              )}
            </div>
          )}
          <div className="use-recipe-date-container">
            {!chooseRecipeDate && (
              <div
                className="use-this-recipe"
                onClick={() => this.setState({ chooseRecipeDate: true })}
              >
                Use This Template
              </div>
            )}

            {chooseRecipeDate && (
              <div className="label">Choose Start Date: </div>
            )}
            {chooseRecipeDate && (
              <DateTimePicker
                date={this.props.clickedCalendarDate}
                dateFormat="MMMM Do YYYY"
                handleChange={date => {
                  recipe.chosenStartDate = date;
                  recipe.recipeID = recipe._id;
                  recipe.calendarID = this.props.calendarID;
                  this.props.handleChange(recipe, "clickedEvent");
                  this.props.handleChange(true, "clickedEventIsRecipe");
                  this.props.handleChange(false, "recipeEditing");
                  this.props.handleChange(false, "recipeModal");
                  this.props.handleChange(true, "campaignModal");
                }}
                dateLowerBound={new moment()}
                disableTime={true}
                style={{
                  bottom: "100%",
                  top: "auto"
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    let {
      activeRecipes,
      loading,
      recipe,
      clientX,
      clientY,
      startDate,
      promptDeleteRecipe
    } = this.state;

    let recipeArray = this.createRecipeList(activeRecipes);

    return (
      <div
        className="modal"
        onClick={() => this.props.handleChange(false, "recipeModal")}
      >
        <div
          className="large-modal common-transition"
          onClick={e => e.stopPropagation()}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.props.close(false, "recipeModal")}
          />

          <div className="recipe-navigation-container">
            <div
              className={
                activeRecipes === this.state.usersRecipes
                  ? "recipe-navigation-option pa4 button mx8 active"
                  : "recipe-navigation-option pa4 button mx8"
              }
              onClick={() => {
                this.setState({
                  activeRecipes: this.state.usersRecipes,
                  previewRecipeLocation: undefined,
                  activePost: undefined
                });
              }}
            >
              Your Templates
            </div>
            <div
              className={
                activeRecipes === this.state.allRecipes
                  ? "recipe-navigation-option pa4 button mx8 active"
                  : "recipe-navigation-option pa4 button mx8"
              }
              onClick={() => {
                this.setState({
                  activeRecipes: this.state.allRecipes,
                  previewRecipeLocation: undefined,
                  activePost: undefined
                });
              }}
            >
              All Templates
            </div>
          </div>
          <div className="recipes-container-container">{recipeArray}</div>
          {loading && <LoaderSimpleCircle />}
          {promptDeleteRecipe && (
            <ConfirmAlert
              close={() => this.setState({ promptDeleteRecipe: false })}
              title="Delete Recipe"
              message="Are you sure you want to delete this recipe?"
              callback={this.deleteRecipe}
            />
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction,
    tutorial: state.tutorial
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction,
      setTutorial
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeModal);
