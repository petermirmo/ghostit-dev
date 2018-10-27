import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import HomePage from "./HomePage";
import PricingPage from "./PricingPage";
import TeamPage from "./TeamPage";
import WebsiteHeader from "./WebsiteHeader";

import "./style.css";

class Website extends Component {
  getPage = activePage => {
    if (activePage === "home") return <HomePage />;
    else if (activePage === "pricing") return <PricingPage />;
    else if (activePage === "team") return <TeamPage />;
    else return <HomePage />;
  };
  render() {
    const { activePage } = this.props;

    return (
      <div>
        <WebsiteHeader activePage={activePage} />
        {this.getPage(activePage)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activePage: state.activePage
  };
}
export default connect(mapStateToProps)(Website);
