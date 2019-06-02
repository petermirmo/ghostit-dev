import React, { Component } from "react";

import { connect } from "react-redux";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import LineChart from "../../components/LineChart/";

import { getAccountAnalytics, getDataLinesFromAnalytics } from "./util";

import "./style.css";

class Analytics extends Component {
  state = { activeAnalytics: [], analyticsObjects: undefined };

  componentDidMount() {
    getAccountAnalytics(this.handleChange);
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  render() {
    const { analyticsObjects = [] } = this.state;
    const { accounts } = this.props;

    const { dataLinesInformation, dataPointArrays } = getDataLinesFromAnalytics(
      analyticsObjects,
      analyticsObjects.length - 1
    );

    return <Page title="Analytics">getDataLinesFromAnalytics</Page>;
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    user: state.user
  };
}
export default connect(mapStateToProps)(Analytics);
