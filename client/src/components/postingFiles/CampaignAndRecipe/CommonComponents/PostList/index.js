import React, { Component } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faCopy,
  faPlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import { getPostColor } from "../../../../../componentFunctions";

import PostTypePicker from "../PostTypePicker";

import "./style.css";

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = { newPostPrompt: false };
  }
  selectPost = arrayIndex => {
    const { listOfPostChanges, activePostIndex, handleChange } = this.props;

    if (activePostIndex === arrayIndex) {
      return;
    }
    if (Object.keys(listOfPostChanges).length > 0) {
      handleChange(true, "promptChangeActivePost");
      handleChange(arrayIndex, "nextChosenPostIndex");
    } else {
      handleChange(arrayIndex, "activePostIndex");
    }
  };

  render() {
    const { newPostPrompt } = this.state;
    const {
      campaign,
      posts,
      activePostIndex,
      listOfPostChanges,
      recipeEditing,
      clickedCalendarDate
    } = this.props; // variables
    const { newPost, deletePost, duplicatePost } = this.props; // functions

    return (
      <div className="list-container px16 pt16 light-scrollbar">
        {posts.map((post_obj, index) => {
          let entryClassName = undefined;
          if (index === activePostIndex) {
            entryClassName = "list-entry br4 pa8 active";
          } else {
            entryClassName = "list-entry br4 pa8";
          }

          let savedBoxColor = "var(--green-theme-color)";
          if (
            recipeEditing &&
            (!post_obj.instructions || post_obj.instructions === "")
          ) {
            // posts in a recipe must have instructions so if it doesn't, it must not have been saved yet.
            savedBoxColor = "var(--red-theme-color)";
          } else if (!recipeEditing && !post_obj._id) {
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
                className="saved-box round"
                style={{
                  backgroundColor: savedBoxColor
                }}
              />
              <div
                className={entryClassName}
                onClick={e => this.selectPost(index)}
                style={{
                  backgroundColor: getPostColor(post_obj.socialType)
                }}
              >
                <div className="list-entry-name">{post_obj.name}</div>
                <div className="list-entry-date">
                  {new moment(post_obj.postingDate).format("lll")}
                </div>
              </div>
              <div className="delete-container">
                <div title="Delete post.">
                  <FontAwesomeIcon
                    className="delete"
                    onClick={() => {
                      deletePost(index);
                    }}
                    icon={faTrash}
                  />
                </div>
                <div title="Duplicate post.">
                  <FontAwesomeIcon
                    className="copy"
                    onClick={() => duplicatePost(index)}
                    icon={faCopy}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {!newPostPrompt && (
          <FontAwesomeIcon
            onClick={() => this.setState({ newPostPrompt: true })}
            className="round-icon margin-hc clickable round shadow regular-button-colors pa8"
            icon={faPlus}
            size="2x"
          />
        )}
        {newPostPrompt && (
          <FontAwesomeIcon
            icon={faArrowDown}
            size="2x"
            className="arrow-down"
          />
        )}

        {newPostPrompt && (
          <PostTypePicker
            newPost={socialType => {
              newPost(socialType, posts, campaign, clickedCalendarDate);
              this.setState({ newPostPrompt: false });
            }}
          />
        )}
      </div>
    );
  }
}

export default PostList;
