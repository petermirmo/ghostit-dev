import React, { Component } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faCopy,
  faPlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";

import { getPostColor } from "../../../../../componentFunctions";

import PostTypePicker from "../PostTypePicker";
import GIContainer from "../../../../containers/GIContainer";
import GIText from "../../../../views/GIText";

import {
  getPostColor,
  getPostIconRound
} from "../../../../../componentFunctions";

import "./style.css";

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = { newPostPrompt: false };
  }
  selectPost = arrayIndex => {
    const { activePostIndex, handleChange, listOfPostChanges } = this.props;

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
      activePostIndex,
      campaign,
      clickedCalendarDate,
      listOfPostChanges,
      posts,
      recipeEditing,
      saveButtons
    } = this.props; // variables
    const { deletePost, duplicatePost, newPost } = this.props; // functions

    return (
      <GIContainer className="column x-fill px32 pt16">
        <GIContainer
          className="bg-white column common-border ov-auto br8"
          style={{ height: "50vh" }}
        >
          {posts.map((post_obj, index) => {
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
            const previewDate = new moment(post_obj.postingDate);

            return (
              <GIContainer className="border-bottom-dashed" key={index}>
                <GIContainer
                  className="fill-flex border-right-dashed clickable px16 py8"
                  onClick={() => this.selectPost(index)}
                >
                  <GIContainer className="bg-light-grey align-center common-border br16">
                    <FontAwesomeIcon
                      className="round-icon small white round pa4"
                      icon={getPostIconRound(post_obj.socialType)}
                      style={{
                        backgroundColor: getPostColor(post_obj.socialType)
                      }}
                    />
                    <GIText
                      className="bold-600 px16"
                      type="p"
                      style={{ color: getPostColor(post_obj.socialType) }}
                    >
                      {previewDate.format("DD MMMM, YYYY")}&nbsp;
                      <GIText
                        className="green"
                        text={previewDate.format("- hh:mm A")}
                        type="span"
                      />
                    </GIText>
                  </GIContainer>
                  <GIContainer
                    className="ellipsis column pl8"
                    style={{ width: "40vw" }}
                  >
                    <GIText
                      className="ellipsis"
                      text={post_obj.content}
                      type="p"
                    />
                    {post_obj.link && (
                      <a
                        className="ellipsis fs-13 four-blue"
                        href={post_obj.link}
                        target="_blank"
                      >
                        {post_obj.link}
                      </a>
                    )}
                  </GIContainer>
                </GIContainer>
                <GIContainer className="full-center px16">
                  <GIContainer title="Edit post.">
                    <FontAwesomeIcon
                      className="round-icon small five-blue clickable px4"
                      icon={faPencilAlt}
                      onClick={() => this.selectPost(index)}
                    />
                  </GIContainer>
                  <GIContainer title="Duplicate post.">
                    <FontAwesomeIcon
                      className="round-icon small copy px4"
                      icon={faCopy}
                      onClick={() => duplicatePost(index)}
                    />
                  </GIContainer>
                  <GIContainer title="Delete post.">
                    <FontAwesomeIcon
                      className="round-icon small delete px4"
                      icon={faTrash}
                      onClick={() => {
                        deletePost(index);
                      }}
                    />
                  </GIContainer>
                </GIContainer>
              </GIContainer>
            );
          })}

          {!newPostPrompt && (
            <GIContainer className="x-fill full-center py16">
              <GIContainer
                className="br4 shadow-blue-4 bg-blue-fade-4 white xy-64px clickable full-center flex"
                onClick={() => this.setState({ newPostPrompt: true })}
              >
                <FontAwesomeIcon icon={faPlus} size="2x" />
              </GIContainer>
            </GIContainer>
          )}

          {newPostPrompt && (
            <PostTypePicker
              newPost={socialType => {
                newPost(socialType, posts, campaign, clickedCalendarDate);
                this.setState({ newPostPrompt: false });
              }}
            />
          )}
        </GIContainer>
        <GIContainer className="py16">{saveButtons}</GIContainer>
      </GIContainer>
    );
  }
}

export default PostList;
