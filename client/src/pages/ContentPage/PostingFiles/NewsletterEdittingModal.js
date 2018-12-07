import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import Notification from "../../../components/Notifications/Notification";
import ConfirmAlert from "../../../components/Notifications/ConfirmAlert";
import CreateNewsletter from "../../../components/CreateNewsletter/";
import Loader from "../../../components/Notifications/Loader/";
import "./style.css";

class NewsletterEdittingModal extends Component {
  state = {
    confirmDelete: false,
    notification: {},
    newsletter: this.props.clickedEvent,
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
    this.setState({ newsletter: nextProps.clickedEvent });
  }
  deleteNewsletterPopUp = () => {
    this.setState({ confirmDelete: true });
  };
  deleteNewsletter = deleteNewsletter => {
    this.setState({ confirmDelete: false, saving: true });
    if (!this.state.newsletter) {
      alert(
        "Error cannot find newsletter. Please contact our dev team immediately"
      );
      return;
    }
    if (deleteNewsletter) {
      axios
        .delete("/api/newsletter/delete/" + this.state.newsletter._id)
        .then(res => {
          if (res.data) {
            this.props.updateCalendarNewsletters();
            this.props.triggerSocketPeers(
              "calendar_newsletter_deleted",
              this.state.newsletter._id
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
        confirmDelete: false,
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
              onClick={() => this.props.close()}
              className="close-scroll"
              icon={faTimes}
              size="2x"
            />
          </div>
          <CreateNewsletter
            newsletter={this.props.clickedEvent}
            callback={newsletter => {
              this.props.saveNewsletterCallback(newsletter);
              this.props.close();
            }}
            setSaving={this.setSaving}
          />
          {this.state.confirmDelete && (
            <ConfirmAlert
              close={() => this.setState({ confirmDelete: false })}
              title="Delete Newsletter"
              message="Are you sure you want to delete this newsletter?"
              callback={this.deleteNewsletter}
            />
          )}

          <div className="modal-footer">
            <div
              className="campaign-footer-option right"
              title="Delete newsletter."
            >
              <FontAwesomeIcon
                onClick={this.deleteNewsletterPopUp}
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
)(NewsletterEdittingModal);
