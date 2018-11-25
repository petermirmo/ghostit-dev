import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";

import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import WebsiteBlog from "../../components/WebsiteBlog";
import "./styles/";

class ManagePage extends Component {
  state = {
    categories: {
      users: { value: "Users", active: false },
      createBlog: { value: "Create a Blog", active: true },
      notifications: { value: "Notifications", active: false },
      plans: { value: "Plans", active: false }
    },
    notifications: []
  };
  componentDidMount() {
    this._ismounted = true;
    axios.get("/api/notifications").then(res => {
      if (this._ismounted) this.setState({ notifications: res.data });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  deleteNotification = id => {
    axios.delete("/api/notification/" + id).then(res => {
      console.log(res);
    });
  };
  switchDivs = activeCategory => {
    let { categories } = this.state;
    for (let index in categories) {
      categories[index].active = false;
    }
    categories[activeCategory].active = true;
    this.setState({ categories });
  };

  render() {
    const { categories, notifications } = this.state;

    return (
      <div className="flex column vc">
        <div className="manage-navigation flex vc py8 px16 mb16 common-shadow">
          {Object.keys(categories).map((categoryIndex, index) => {
            let category = categories[categoryIndex];

            let className = "px32 py8 mx8 moving-border";
            if (category.active) className += " active";

            return (
              <button
                className={className}
                onClick={() => this.switchDivs(categoryIndex)}
                key={"test" + index}
              >
                {category.value}
              </button>
            );
          })}
        </div>
        <div className="width100">
          {categories.users.active && <UsersTable />}
          {categories.createBlog.active && <WebsiteBlog />}
          {categories.notifications.active &&
            notifications.map((notification, index) => {
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
          {categories.plans.active && <PlansTable />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(ManagePage);
