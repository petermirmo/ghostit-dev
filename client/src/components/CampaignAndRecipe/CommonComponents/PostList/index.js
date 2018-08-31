import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faArrowDown from "@fortawesome/fontawesome-free-solid/faArrowDown";

import { getPostColor } from "../../../../extra/functions/CommonFunctions";

import PostTypePicker from "../PostTypePicker";

import "./styles/";

class PostList extends Component {
  render() {
    const {
      campaign,
      posts,
      activePostIndex,
      listOfPostChanges,
      newPostPromptActive,
      recipeEditor
    } = this.props; // variables
    const {
      newPost,
      selectPost,
      deletePost,
      handleChange,
      createRecipe,
      saveRecipe
    } = this.props; // functions

    return (
      <div
        className="post-navigation-container"
        style={{ borderColor: campaign.color }}
      >
        <div className="list-container">
          {posts.map((post_obj, index) => {
            let postDate = post_obj.postingDate;

            let entryClassName = undefined;
            let entryBorderColor = undefined;
            if (index === activePostIndex) {
              entryClassName = "list-entry active";
              entryBorderColor = campaign.color;
            } else {
              entryClassName = "list-entry";
              entryBorderColor = getPostColor(post_obj.socialType);
            }

            let savedBoxColor = "var(--green-theme-color)";
            if (!recipeEditor && !post_obj._id) {
              // post hasnt been saved yet since it doesn't have an _id
              savedBoxColor = "var(--red-theme-color)";
            } else if (index === activePostIndex) {
              // check if active post has any changes since its last save
              if (Object.keys(listOfPostChanges).length > 0) {
                savedBoxColor = "var(--red-theme-color)";
              }
            }

            if (this.props.recipeEditor && post_obj.instructions === "") {
              // posts cannot be saved in a recipe with instructions == ""
              // so this post could never have been saved
              // posts in recipes don't have an ID from getting saved in the DB so the check above
              // wouldn't catch this in recipes
              // problems may occur if later on we allow certain posts to have empty instructions
              // so in that case we will have to add an extra clause based on how to tell what's been saved
              savedBoxColor = "var(--red-theme-color)";
            }

            return (
              <div className="list-entry-with-delete" key={index + "list-div"}>
                <div
                  className="saved-box"
                  key={index + "save-box"}
                  style={{
                    backgroundColor: savedBoxColor
                  }}
                />
                <div
                  className={entryClassName}
                  key={index + "list-entry"}
                  onClick={e => selectPost(e, index)}
                  style={{
                    borderColor: entryBorderColor,
                    backgroundColor: getPostColor(post_obj.socialType)
                  }}
                >
                  {post_obj.name +
                    " - " +
                    new moment(post_obj.postingDate).format("lll")}{" "}
                </div>
                <div className="delete-container">
                  <FontAwesomeIcon
                    className="delete"
                    key={index + "delete"}
                    onClick={e => deletePost(e, index)}
                    icon={faTrash}
                  />
                </div>
              </div>
            );
          })}
          {!newPostPromptActive && (
            <FontAwesomeIcon
              onClick={e => handleChange(true, "newPostPromptActive")}
              className="new-post-button"
              icon={faPlus}
              size="2x"
              key="new_post_button"
              style={{ backgroundColor: campaign.color }}
            />
          )}
          {newPostPromptActive && (
            <FontAwesomeIcon
              icon={faArrowDown}
              size="2x"
              key="new_post_button"
              className="arrow-down"
              style={{ color: campaign.color }}
            />
          )}

          {newPostPromptActive && <PostTypePicker newPost={newPost} />}
        </div>
        {!campaign.recipeID &&
          !recipeEditor && (
            <div
              className="publish-as-recipe"
              style={{ backgroundColor: campaign.color }}
              onClick={createRecipe}
            >
              Publish as recipe
            </div>
          )}
        {recipeEditor &&
          showRecipeSaveButton && (
            <div
              className="publish-as-recipe"
              style={{ backgroundColor: campaign.color }}
              onClick={saveRecipe}
            >
              Save Recipe
            </div>
          )}
      </div>
    );
  }
}

export default PostList;
