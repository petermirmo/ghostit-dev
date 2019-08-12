import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import Post from "../Post";
import CustomTask from "../CustomTask";
import ConfirmAlert from "../../notifications/ConfirmAlert";
import Loader from "../../notifications/Loader/";
import Modal0 from "../../containers/Modal0/";

import Consumer from "../../../context";

import "../style.css";

class PostEdittingModal extends Component {
  state = {
    saving: false,
    confirmDelete: false
  };
  componentDidMount() {
    this._ismounted = true;

    const {
      close,
      getKeyListenerFunction,
      setKeyListenerFunction
    } = this.props;

    setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          close(); // escape button pushed
        }
      },
      getKeyListenerFunction[0]
    ]);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  deletePost = (deletePost, context) => {
    const {
      clickedEvent,
      close,
      history,
      updateCalendarPosts,
      triggerSocketPeers
    } = this.props;

    this.handleChange({ confirmDelete: false, saving: true });
    if (!clickedEvent._id) {
      alert("Error cannot find post. Please contact our dev team immediately");
      return;
    }
    if (deletePost) {
      axios.delete("/api/post/delete/" + clickedEvent._id).then(res => {
        const { loggedIn, message, success } = res.data;

        if (loggedIn === false) history.push("/sign-in");

        if (success) {
          updateCalendarPosts();
          context.notify({ message, title: "Post Deleted", type: "success" });
          triggerSocketPeers("calendar_post_deleted", {
            postID: clickedEvent._id,
            socialType: clickedEvent.socialType
          });
          close();
        } else {
          context.notify({
            message,
            title: "Post Delete Failed",
            type: "danger"
          });
        }
      });
    } else {
      this.handleChange({
        confirmDelete: false,
        saving: false
      });
    }
  };

  render() {
    const { confirmDelete, saving } = this.state;
    const {
      accounts,
      calendarID,
      clickedEvent,
      close,
      handleParentChange,
      savePostCallback,
      timezone
    } = this.props;
    const canEditPost = clickedEvent.status !== "posted";

    return (
      <Consumer>
        {context => (
          <Modal0
            body={
              clickedEvent.socialType === "custom" ? (
                <CustomTask
                  calendarID={calendarID}
                  canEditPost={canEditPost}
                  deletePost={() => this.handleChange({ confirmDelete: true })}
                  notify={context.notify}
                  post={clickedEvent}
                  postFinishedSavingCallback={post => {
                    savePostCallback(post);
                    close();
                  }}
                  setSaving={() => handleParentChange({ loading: true })}
                />
              ) : (
                <Post
                  accounts={accounts}
                  calendarID={calendarID}
                  canEditPost={canEditPost}
                  deletePost={() => this.handleChange({ confirmDelete: true })}
                  notify={context.notify}
                  post={clickedEvent}
                  postFinishedSavingCallback={post => {
                    handleParentChange({ loading: false });

                    savePostCallback(post);
                    close();
                  }}
                  setSaving={() => handleParentChange({ loading: true })}
                  timezone={timezone}
                />
              )
            }
            close={close}
            onClick={close}
          >
            {confirmDelete && (
              <ConfirmAlert
                callback={deletePost => this.deletePost(deletePost, context)}
                close={() => this.setState({ confirmDelete: false })}
                message="Are you sure you want to delete this post?"
                title="Delete Post"
              />
            )}
          </Modal0>
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
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
)(PostEdittingModal);
