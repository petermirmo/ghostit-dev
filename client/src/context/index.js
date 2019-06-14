import React, { Component, createContext } from "react";
import Notification from "../components/notifications/Notification/";
import Loader from "../components/notifications/Loader";

const NotificationContext = createContext();
const { Provider, Consumer } = NotificationContext;

class GIProvider extends Component {
  state = {
    clientSideBar: false,
    notification: {
      on: false,
      title: "Something went wrong!",
      message: "",
      type: "danger"
    },
    saving: false
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

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
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  render() {
    const { clientSideBar, notification, saving } = this.state;
    return (
      <Provider
        value={{
          clientSideBar,
          handleChange: this.handleChange,
          notify: this.notify,
          saving
        }}
      >
        {notification.on && (
          <Notification
            notification={notification}
            callback={notification => this.setState({ notification })}
          />
        )}
        {this.props.children}
        {saving && <Loader />}
      </Provider>
    );
  }
}

export { GIProvider, NotificationContext };

export default Consumer;
