import React, { Component } from "react";

import { Link } from "react-router-dom";

import Logo from "../../components/navigations/WebsiteHeader/Logo";

import Page from "../../components/containers/Page";
import GIText from "../../components/views/GIText/";
import GIContainer from "../../components/containers/GIContainer/";

class MobileSoftwareBarrier extends Component {
  render() {
    return (
      <Page className="" title="Software Barrier">
        <GIContainer className="column align-center pa32">
          <GIText
            className="tac"
            text="Our software can not be used through a phone. Please use a desktop, laptop or large tablet."
            type="h4"
          />
          <Logo
            className="x-40 pb4"
            displayText={false}
            style={{ minWidth: "40px" }}
          />
          <Link className="white bg-blue-fade-5 py8 px16" to="/home">
            Go Home
          </Link>
        </GIContainer>
      </Page>
    );
  }
}

export default MobileSoftwareBarrier;
