import React, { Component } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import "./styles/";

class ManagePage extends Component {
  state = {
    userTable: true,
    notifications: []
  };
  componentDidMount() {
    axios.get("/api/notifications").then(res => {
      this.setState({ notifications: res.data });
    });
  }
  deleteNotification = id => {
    axios.delete("/api/notification/" + id).then(res => {
      console.log(res);
    });
  };

  switchDivs = event => {
    this.setState({ userTable: !this.state.userTable });
  };

  render() {
    const { notifications } = this.state;
    return (
      <div>
        <div className="switch">
          {!this.state.userTable && (
            <button
              className="switch-button active-switch"
              onClick={event => this.switchDivs(event)}
            >
              Edit Users
            </button>
          )}
          {this.state.userTable && (
            <button
              className="switch-button active-switch"
              onClick={event => this.switchDivs(event)}
            >
              Edit Plans
            </button>
          )}
        </div>
        {notifications.map((notification, index) => {
          return (
            <div className="flex" key={"notification" + index}>
              <div>{notification.message}</div>
              <button
                className="px32 py8 round-button"
                onClick={() => this.deleteNotification(notification._id)}
              >
                Delete Notification
              </button>
            </div>
          );
        })}

        {this.state.userTable ? <UsersTable /> : <PlansTable />}
      </div>
    );
  }
}

export default ManagePage;
