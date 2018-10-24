import React, { Component } from "react";

import HomePage from "./HomePage";
import PricingPage from "./PricingPage";
import TeamPage from "./TeamPage";

class Website extends Component {
  render() {
    const { activePage } = this.props;

    if (activePage === "home") return <HomePage />;
    if (activePage === "pricing") return <PricingPage />;
    if (activePage === "team") return <TeamPage />;
    else return <HomePage />;
  }
}

export default Website;
