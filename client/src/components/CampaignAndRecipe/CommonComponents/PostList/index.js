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
      newPostPromptActive
    } = this.props; // variables
    const {
      newPost,
      selectPost,
      deletePost,
      handleChange,
      createRecipe
    } = this.props; // functions
    return (
      <div
        className="post-navigation-container"
        style={{ borderColor: campaign.color }}
      >
        <div className="list-container">
          {posts.map((post_obj, index) => {
            let postDate;
            if (this.props.recipeEditor) {
              postDate = post_obj.postingDate;
            } else {
              postDate = post_obj.post
                ? post_obj.post.postingDate
                : post_obj.clickedCalendarDate;
              if (post_obj.recipePost)
                postDate = post_obj.recipePost.postingDate;
            }

            let entryClassName = undefined;
            let entryBorderColor = undefined;
            if (index === activePostIndex) {
              entryClassName = "list-entry active";
              entryBorderColor = campaign.color;
            } else {
              entryClassName = "list-entry";
              entryBorderColor = this.props.recipeEditor
                ? getPostColor(post_obj.socialType)
                : getPostColor(post_obj.post.socialType);
            }

            let savedBoxColor = "var(--green-theme-color)";
            if (!this.props.recipeEditor && !post_obj.post._id) {
              // post hasnt been saved yet since it doesn't have an _id
              savedBoxColor = "var(--red-theme-color)";
            } else if (index === activePostIndex) {
              // check if active post has any changes since its last save
              if (Object.keys(listOfPostChanges).length > 0) {
                savedBoxColor = "var(--red-theme-color)";
              }
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
                    backgroundColor: this.props.recipeEditor
                      ? getPostColor(post_obj.socialType)
                      : getPostColor(post_obj.post.socialType)
                  }}
                >
                  {this.props.recipeEditor
                    ? post_obj.name
                      ? post_obj.name +
                        " - " +
                        new moment(post_obj.postingDate).format("lll")
                      : post_obj.socialType.charAt(0).toUpperCase() +
                        post_obj.socialType.slice(1) +
                        (post_obj.socialType === "custom"
                          ? " Task - "
                          : " Post - ") +
                        new moment(post_obj.postingDate).format("lll")
                    : post_obj.post.name
                      ? post_obj.post.name +
                        " - " +
                        new moment(
                          post_obj.post
                            ? post_obj.post.postingDate
                            : post_obj.clickedCalendarDate
                        ).format("lll")
                      : post_obj.post.socialType.charAt(0).toUpperCase() +
                        post_obj.post.socialType.slice(1) +
                        (post_obj.post.socialType === "custom"
                          ? " Task - "
                          : " Post - ") +
                        new moment(
                          post_obj.post
                            ? post_obj.post.postingDate
                            : post_obj.clickedCalendarDate
                        ).format("lll")}
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
          !this.props.recipeEditor && (
            <div
              className="publish-as-recipe"
              style={{ backgroundColor: campaign.color }}
              onClick={createRecipe}
            >
              Publish as recipe
            </div>
          )}
        {this.props.recipeEditor &&
          this.props.showRecipeSaveButton && (
            <div
              className="publish-as-recipe"
              style={{ backgroundColor: campaign.color }}
              onClick={this.props.saveRecipe}
            >
              Save Recipe
            </div>
          )}
      </div>
    );
  }
}

export default PostList;
