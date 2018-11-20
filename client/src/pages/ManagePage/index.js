import React, { Component } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import "./styles/";

class ManagePage extends Component {
  state = {
    userTable: true,
    categories: {
      users: { value: "Users", active: false, onClick: "test" },
      plans: { value: "Plans", active: false },
      createBlog: { value: "Create a Blog", active: true }
    },
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
    const { categories, notifications } = this.state;

    let buttonDivs = [];
    for (let index in categories) {
      let category = categories[index];
      let className = "px32 py8 mx8 moving-border";
      if (category.active) className += " active";

      buttonDivs.push(
        <button className={className} onClick={event => this.switchDivs(event)}>
          {category.value}
        </button>
      );
    }
    return (
      <div className="flex column vc">
        <div className="manage-navigation flex vc py8 px16 mb16 common-shadow">
          {buttonDivs}

          <button
            className="test3 px32 py8 mx8 moving-border"
            onClick={event => this.switchDivs(event)}
          >
            Plans
          </button>
        </div>
        <div className="width100">
          {<UsersTable />}
          {categories.test && <PlansTable />}
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
        </div>
      </div>
    );
  }
}

export default ManagePage;
