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
  getPageAnalytics = account => {
    axios.get("/api/facebook/page/analytics/" + account._id).then(res => {
      console.log(res.data);
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
    let { facebookPosts } = this.state;
    let accountClickMeDivs = [];
    let postClickMeDivs = [];

    for (let index in accounts) {
      let account = accounts[index];
      if (account.socialType !== "facebook") continue;
      if (account.accountType === "profile") continue;
      let title = account.userName;
      if (!title) title = account.givenName;

      accountClickMeDivs.push(
        <div
          key={index + "account"}
          onClick={() => this.getPageAnalytics(account)}
          className="here"
        >
          page:
          {title}
        </div>
      );
    }
    for (let index in facebookPosts) {
      let post = facebookPosts[index];
      postClickMeDivs.push(
        <div
          key={index + "post"}
          onClick={() => this.getPostAnalytics(post)}
          className="here"
        >
          post:
          {post.content}
        </div>
      );
    }
    return (
      <div  >
        <div className="test-container">
          {accountClickMeDivs}
          {postClickMeDivs}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}
export default connect(mapStateToProps)(Analytics);
