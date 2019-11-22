import React, { Component, createContext } from "react";
import Notification from "../components/notifications/Notification/";
import Loader from "../components/notifications/Loader";

const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
    activeCalendarIndex: undefined,
    allAccounts: [],
    calendars: [],
    clientSideBar: false,
    defaultCalendarID: undefined,
    ghostitBlogs: [],
    notification: {
      on: false,
      title: "Something went wrong!",
      message: "",
      type: "danger"
    },
    saving: false,
    signedInAsUser: undefined,
    user: undefined
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
  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject);
    if (callback) callback();
  };

  handleCalendarChange = (key, value, calendarIndex) => {
    if (!this._ismounted) return;
    this.setState(prevState => {
      return {
        calendars: [
          ...prevState.calendars.slice(0, calendarIndex),
          { ...prevState.calendars[calendarIndex], [key]: value },
          ...prevState.calendars.slice(calendarIndex + 1)
        ]
      };
    });
  };
  getUser = () => {
    const { signedInAsUser, user } = this.state;
    if (signedInAsUser) return signedInAsUser;
    else return user;
  };
  render() {
    const {
      activeCalendarIndex,
      allAccounts,
      calendars,
      clientSideBar,
      defaultCalendarID,
      ghostitBlogs,
      notification,
      saving,
      signedInAsUser,
      user
    } = this.state;

    return (
      <Provider
        value={{
          activeCalendarIndex,
          allAccounts,
          calendars,
          clientSideBar,
          defaultCalendarID,
          getUser: this.getUser,
          ghostitBlogs,
          handleCalendarChange: this.handleCalendarChange,
          handleChange: this.handleChange,
          notify: this.notify,
          saving,
          signedInAsUser,
          user
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

export { GIProvider, ExtraContext };

export default Consumer;
