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
  getAnalytics = account => {
    axios.get("/api/facebook/analytics/" + account._id).then(res => {
      console.log(res);
    });
  };
  render() {
    let { accounts } = this.props;
    let someDivs = [];
    for (let index in accounts) {
      let account = accounts[index];
      if (account.socialType !== "facebook") continue;
      someDivs.push(
        <div
          key={index + "some"}
          onClick={() => this.getAnalytics(account)}
          className="here"
        >
          Click me!!
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
