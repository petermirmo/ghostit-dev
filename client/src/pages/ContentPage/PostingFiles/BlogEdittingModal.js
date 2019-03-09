import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import Notification from "../../../components/notifications/Notification";
import ConfirmAlert from "../../../components/notifications/ConfirmAlert";
import CreateBlog from "../../../components/CreateBlog/";
import Loader from "../../../components/notifications/Loader/";
import "./style.css";

class BlogEdittingModal extends Component {
  state = {
    confirmDelete: false,
    notification: {},
    blog: this.props.clickedEvent,
    saving: false
  };
  componentDidMount() {
    this._ismounted = true;

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.close(); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ blog: nextProps.clickedEvent });
  }
  deleteBlogPopUp = () => {
    this.setState({ confirmDelete: true });
  };
  deleteBlog = deleteBlog => {
    this.setState({ confirmDelete: false, saving: true });
    if (!this.state.blog) {
      alert("Error cannot find blog. Please contact our dev team immediately");
      return;
    }
    if (deleteBlog) {
      axios.delete("/api/blog/delete/" + this.state.blog._id).then(res => {
        if (res.data) {
          this.props.updateCalendarBlogs();
          this.props.triggerSocketPeers(
            "calendar_blog_deleted",
            this.state.blog._id
          );
          this.props.close();
        } else {
          this.setState({
            notification: {
              on: true,
              type: "danger",
              title: "Something went wrong",
              message: ""
            }
          });
        }
      });
    } else {
      this.setState({
        deleteBlog: false,
        saving: false
      });
    }
  };
  hideNotification = () => {
    this.setState({ notification: {} });
  };
  setSaving = () => {
    this.setState({ saving: true });
  };
  render() {
    if (this.state.saving) {
      return <Loader />;
    }
    return (
      <div className="modal" onClick={this.props.close}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <FontAwesomeIcon
              icon={faTimes}
              className="close-scroll"
              size="2x"
              onClick={() => this.props.close()}
            />
          </div>
          <CreateBlog
            blog={this.props.clickedEvent}
            callback={blogID => {
              this.props.saveBlogCallback(blogID);
              this.props.close();
            }}
            setSaving={this.setSaving}
          />
          {this.state.confirmDelete && (
            <ConfirmAlert
              close={() => this.setState({ confirmDelete: false })}
              title="Delete Blog"
              message="Are you sure you want to delete this blog?"
              callback={this.deleteBlog}
            />
          )}

          <div className="modal-footer">
            <div
              className="campaign-footer-option right"
              title="Delete campaign."
            >
              <FontAwesomeIcon
                onClick={this.deleteBlogPopUp}
                className="delete"
                icon={faTrash}
                size="2x"
              />
            </div>
          </div>
        </div>
        {this.state.notification.on && (
          <Notification
            type={this.state.notification.type}
            title={this.state.notification.title}
            message={this.state.notification.message}
            callback={this.hideNotification}
          />
        )}
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
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogEdittingModal);
