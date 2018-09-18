import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./styles/";

class Analytics extends Component {
  constructor(props) {
    super(props);
  }
  getPageAnalytics = account => {
    axios.get("/api/facebook/page/analytics/" + account._id).then(res => {
      console.log(res);
    });
  };
  render() {
    let { accounts } = this.props;
    let someDivs = [];
    for (let index in accounts) {
      let account = accounts[index];
      if (account.socialType !== "facebook") continue;
      let title = account.userName;
      if (!title) title = account.givenName;
      someDivs.push(
        <div
          key={index + "some"}
          onClick={() => this.getPageAnalytics(account)}
          className="here"
        >
          {account.userName}
        </div>
      );
    }
    return (
      <div className="wrapper" style={this.props.margin}>
        {someDivs}
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
