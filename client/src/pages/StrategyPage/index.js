import React, { Component } from "react";

import { connect } from "react-redux";

import StrategyForm from "./StrategyForm";
import "./styles/";

class StrategyPage extends Component {
  render() {
    return (
      <div>
        <div className="center">
          <StrategyForm />
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

export default connect(mapStateToProps)(StrategyPage);
