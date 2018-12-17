import React, { Component } from "react";
import axios from "axios";
import MetaTags from "react-meta-tags";

import { connect } from "react-redux";

import UsersTable from "./UsersTable";
import CreateGhostitBlog from "../../components/GhostitBlog/Create";
import "./style.css";

class ManagePage extends Component {
  state = {
    categories: {
      createBlog: { value: "Create a Blog", active: true },
      users: { value: "Users", active: false },
      notifications: { value: "Notifications", active: false }
    },
    notifications: []
  };
  componentDidMount() {
    window.scrollTo(0, 0);

    this._ismounted = true;
    axios.get("/api/notifications").then(res => {
      console.log(res.data);
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
    const { categories, notifications, ghostitBlog } = this.state;

    return (
      <div className="flex column vc">
        <MetaTags>
          <title>Ghostit | Manage</title>
        </MetaTags>
        <div className="manage-navigation flex vc py8 px16 mb16 common-shadow">
          {Object.keys(categories).map((categoryIndex, index) => {
            let category = categories[categoryIndex];

            let className = "px32 py8 mx8 moving-border";
            if (category.active) className += " active";

            return (
              <button
                className={className}
                onClick={() => this.switchDivs(categoryIndex)}
                key={"eun" + index}
              >
                {category.value}
              </button>
            );
          })}
        </div>
        <div className="width100">
          {categories.users.active && <UsersTable />}
          {categories.createBlog.active && (
            <CreateGhostitBlog
              ghostitBlog={ghostitBlog}
              id={this.props.match.params.id}
            />
          )}
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
