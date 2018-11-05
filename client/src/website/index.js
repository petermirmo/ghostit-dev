import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import WebsiteHeader from "./WebsiteHeader";
import HomePage from "./HomePage";
import PricingPage from "./PricingPage";
import TeamPage from "./TeamPage";
import GhostitAgency from "./GhostitAgency";
import LoginPage from "./LoginPage/";

import "./style.css";

class Website extends Component {
  getPage = activePage => {
    if (activePage === "home") return <HomePage />;
    else if (activePage === "pricing") return <PricingPage />;
    else if (activePage === "team") return <TeamPage />;
    else if (activePage === "agency") return <GhostitAgency />;
    else if (activePage === "sign-up") return <LoginPage signUp={true} />;
    else if (activePage === "sign-in") return <LoginPage />;
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
