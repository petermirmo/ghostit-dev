import React, { Component, createContext } from "react";
import Notification from "../components/notifications/Notification/";

const { Provider, Consumer } = createContext();

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
    let { notification } = this.state;

    for (let index in newNotification) {
      notification[index] = newNotification[index];
    }

    notification.on = true;
    this.setState({ notification });

    if (notification.on) {
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

export { GIProvider };

export default Consumer;
