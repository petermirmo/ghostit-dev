import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./styles/";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.getPosts();
    this.state = {};
  }

  componentDidMount() {
    this.getAnalytics();
  }

  getAnalytics = () => {
    console.log("getAnalytics()");
    if (this.props.user.role === "admin") {
      axios.get("/api/analytics").then(res => {
        const { analyticsObjects } = res.data;
        console.log(res);
        this.setState({ analyticsObjects });
      });
    } else {
      return;
    }
  };

  getPageAnalytics = account => {
    axios.get("/api/facebook/page/analytics/" + account._id).then(res => {
      console.log(res.data);
    });
  };

  getAllFacebookPageAnalytics = () => {
    axios.get("/api/facebook/page/analytics/all").then(res => {
      const { success } = res.data;
      if (!success) {
        alert(res.data.message);
        return;
      } else {
        console.log(res.data);
      }
    });
  };

  getPostAnalytics = post => {
    axios.get("/api/facebook/post/analytics/" + post._id).then(res => {
      console.log(res.data);
    });
  };
  getPosts = () => {
    let facebookPosts = [];
    axios.get("/api/posts").then(res => {
      let { posts } = res.data;

      for (let index in posts) {
        if (posts[index].socialType === "facebook") {
          facebookPosts.push(posts[index]);
        }
      }
      this.setState({
        facebookPosts
      });
    });
  };

  render() {
    let { accounts } = this.props;
    let { facebookPosts, analyticsObjects, activeAnalyticsIndex } = this.state;

    return (
      <div className="wrapper" style={this.props.margin}>
        {this.props.user.role === "admin" && (
          <div className="test-container">
            <div
              onClick={() => this.getAllFacebookPageAnalytics()}
              className="here"
            >
              Get All FB Pages
            </div>
          </div>
        )}
        {this.props.user.role === "admin" &&
          analyticsObjects && (
            <div className="test-container">
              {analyticsObjects.map((obj, index) => {
                <div
                  className="here"
                  key={index + "account"}
                  onClick={() => this.setState({ activeAnalyticsIndex: index })}
                >
                  {obj.accountName}
                </div>;
              })}
            </div>
          )}
        {activeAnalyticsIndex !== "undefined" && (
          <div className="analytics-display">
            {/*analyticsObjects[activeAnalyticsIndex].name*/}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    user: state.user
  };
}
export default connect(mapStateToProps)(Analytics);
