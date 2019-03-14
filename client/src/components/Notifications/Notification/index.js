import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import "./style.css";

class Notification extends Component {
  componentDidMount() {
    const { callback } = this.props;
    let { notification } = this.props;
    if (!notification) notification = {};

    setTimeout(() => {
      notification.on = false;
      callback(notifcation);
    }, 5000);
  }
  render() {
    const { notification } = this.props;
    let { title, message, type } = this.props;
    if (notification) {
      title = notification.title;
      message = notification.message;
      type = notification.type;
    }

    return (
      <div className={"notification " + type}>
        <FontAwesomeIcon
          icon={faTimes}
          className="closebtn"
          onClick={this.props.callback}
        />
        <h4 className="notifcation-title">{title}</h4>
        {message}
      </div>
    );
  }
}
export default Notification;
