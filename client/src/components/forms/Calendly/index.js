import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { isMobileOrTablet } from "../../../util";

import "../style.css";

class MyForm extends Component {
  render() {
    return (
      <GIContainer
        className={
          "flex column flex-fill full-center bg-blue-fade-6 relative " +
          (isMobileOrTablet() ? "py32 px16" : "pa64")
        }
        id="contact-us-form"
      >
        <Link
          className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
          to="/contact-us"
        >
          Book a Call
        </Link>
        <a className="no-bold white italic" href="mailto: hello@ghostit.co">
          Or email us at hello@ghostit.co
        </a>

        <GIContainer id="left-blob" />
        <GIContainer id="right-blob" />
      </GIContainer>
    );
  }
}

export default MyForm;
