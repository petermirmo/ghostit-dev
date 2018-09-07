import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import LoaderSimpleCircle from "../../Notifications/LoaderSimpleCircle";
import DateTimePicker from "../../DateTimePicker";
import ConfirmAlert from "../../Notifications/ConfirmAlert";

import { getPostColor } from "../../../extra/functions/CommonFunctions";

import "./styles/";

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

      this.setState({
        usersRecipes,
        allRecipes,
        activeRecipes: allRecipes,
        loading: false,
        userID: usersRecipes.length > 0 ? usersRecipes[0].userID : undefined
      });
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
    let signedInUserID = this.props.user.signedInAsUser
      ? this.props.user.signedInAsUser.id
      : this.props.user._id;
    let recipeArray = [];

    let recipeIndex = 0;

    for (
      let recipeRow = 0;
      recipeRow <= activeRecipes.length / 4;
      recipeRow++
    ) {
      let rowArray = [];

      for (let recipeColumn = 0; recipeColumn <= 3; recipeColumn++) {
        let recipeIndex2 = recipeIndex;
        let recipe = activeRecipes[recipeIndex2];

        // Preview when a recipe is clicked
        if (previewRecipeLocation === recipeIndex2) {
          recipeArray[recipeArray.length + 1] = (
            <div
              className="preview-recipe"
              key={recipeRow + "preview_recipe" + recipeColumn}
              style={{ backgroundColor: recipe.color }}
            >
              <div className="title">
                {recipe.name
                  ? recipe.name
                  : "This recipe does not have a title."}
              </div>
              <div className="recipe-navigation-and-post-preview-container">
                <div className="preview-navigation-container">
                  <div className="list-container">
                    {recipe.posts.map((post_obj, index) => {
                      return (
                        <div
                          className="list-entry-with-delete"
                          key={index + "list-div"}
                        >
                          <div
                            className="list-entry"
                            key={index + "list-entry"}
                            onClick={e =>
                              this.setState({ activePost: post_obj })
                            }
                            style={{
                              borderColor: getPostColor(post_obj.socialType),
                              backgroundColor: getPostColor(post_obj.socialType)
                            }}
                          >
                            {post_obj.name
                              ? post_obj.name
                              : post_obj.socialType.charAt(0).toUpperCase() +
                                post_obj.socialType.slice(1) +
                                " Post"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="recipe-post-and-use-container">
                  {activePost && (
                    <div className="post-preview">
                      <div className="label">Post Instructions : </div>
                      {activePost.instructions
                        ? activePost.instructions
                        : "This post has no instructions."}
                    </div>
                  )}
                  <div className="use-recipe-date-container">
                    {!chooseRecipeDate && (
                      <div
                        className="use-this-recipe"
                        onClick={() =>
                          this.setState({ chooseRecipeDate: true })
                        }
                      >
                        Use This Recipe
                      </div>
                    )}
                    {!chooseRecipeDate && (
                      <div
                        className="use-this-recipe"
                        onClick={() => {
                          this.props.handleChange(recipe, "clickedEvent");
                          this.props.handleChange(true, "clickedEventIsRecipe");
                          this.props.handleChange(true, "recipeEditing");
                          this.props.handleChange(false, "recipeModal");
                          this.props.handleChange(true, "campaignModal");
                        }}
                      >
                        Edit This Recipe
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
                          this.props.handleChange(recipe, "clickedEvent");
                          this.props.handleChange(true, "clickedEventIsRecipe");
                          this.props.handleChange(false, "recipeEditing");
                          this.props.handleChange(false, "recipeModal");
                          this.props.handleChange(true, "campaignModal");
                        }}
                        dateLowerBound={new moment()}
                        disableTime={true}
                        style={{
                          bottom: "-80px"
                        }}
                      />
                    )}
                  </div>
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
                      onClick={() =>
                        this.setState({ promptDeleteRecipe: true })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Put in blank divs to account for empty slots in final row
        if (!recipe)
          recipe = {
            _id: recipeIndex2 + "recipe",
            name: "",
            color: "transparent",
            cursor: "default"
          };
        rowArray.push(
          <div
            className="recipe-container"
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
                this.setState({
                  previewRecipeLocation: recipeIndex2,
                  activePost: recipe.posts[0]
                });
              }
            }}
            style={{ backgroundColor: recipe.color, cursor: recipe.cursor }}
          >
            <div className="recipe-name">{recipe.name}</div>
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
        <div className="large-modal" onClick={e => e.stopPropagation()}>
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.props.close(false, "recipeModal")}
          />
          <div
            className="custom-campaign-button"
            onClick={e => {
              this.props.handleChange(undefined, "clickedEvent");
              this.props.handleChange(true, "campaignModal");
              this.props.handleChange(false, "recipeModal");
            }}
          >
            Create Custom Campaign
          </div>
          <div className="recipe-navigation-container">
            <div
              className={
                activeRecipes === this.state.allRecipes
                  ? "recipe-navigation-option active"
                  : "recipe-navigation-option"
              }
              onClick={() => {
                this.setState({
                  activeRecipes: this.state.allRecipes,
                  previewRecipeLocation: undefined,
                  activePost: undefined
                });
              }}
            >
              All Recipes
            </div>
            <div
              className={
                activeRecipes === this.state.usersRecipes
                  ? "recipe-navigation-option active"
                  : "recipe-navigation-option"
              }
              onClick={() => {
                this.setState({
                  activeRecipes: this.state.usersRecipes,
                  previewRecipeLocation: undefined,
                  activePost: undefined
                });
              }}
            >
              Your Recipes
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
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeModal);
