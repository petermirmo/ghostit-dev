import React, { Component } from "react";

import HomePage from "./HomePage";
import PricingPage from "./PricingPage";
import TeamPage from "./TeamPage";
import WebsiteHeader from "./WebsiteHeader";

import "./style.css";

class Website extends Component {
  getPage = activePage => {
    if (activePage === "home") return <HomePage />;
    if (activePage === "pricing") return <PricingPage />;
    if (activePage === "team") return <TeamPage />;
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

export default Website;
