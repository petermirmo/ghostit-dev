import React, { Component, createContext } from "react";
import Notification from "../components/notifications/Notification/";

const NotificationContext = createContext();
const { Provider, Consumer } = NotificationContext;

class GIProvider extends Component {
  state = {
    notification: {
      on: false,
      title: "Something went wrong!",
      message: "",
      type: "danger"
    }
  };

  notify = newNotification => {
    newNotification.on = true;
    this.setState({ notification: newNotification });

    if (newNotification.on) {
      setTimeout(() => {
        let { notification } = this.state;
        notification.on = false;
        this.setState({ notification });
      }, 5000);
    }
  };
  render() {
    const { notification } = this.state;
    return (
      <Provider
        value={{
          test: "here",
          notify: this.notify
        }}
      >
        {notification.on && (
          <Notification
            notification={notification}
            callback={notification => this.setState({ notification })}
          />
        )}
        {this.props.children}
      </Provider>
    );
  }
}

export { GIProvider, NotificationContext };

export default Consumer;
