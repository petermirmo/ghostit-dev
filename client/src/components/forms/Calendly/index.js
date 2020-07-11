import React, { Component } from "react";
import axios from "axios";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { isMobileOrTablet } from "../../../util";

import "../style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = { email: "", fName: "", cName: "", phoneNumber: "" };
  render() {
    const { email, fName, cName, phoneNumber } = this.state;

    return (
      <GIContainer
        className={
          "flex column fill-flex full-center bg-blue-fade-6 relative mt32 " +
          (isMobileOrTablet() ? "py32 px16" : "pa64")
        }
        id="contact-us-form"
      >
        <a
          className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
          href="https://calendly.com/ghostitcm"
          target="_blank"
        >
          Book a Call
        </a>
        <GIText
          className="white italic"
          text="Or email us at hello@ghostit.co"
          type="p"
        />
        <GIContainer id="left-blob" />
        <GIContainer id="right-blob" />
      </GIContainer>
    );
  }
}

export default MyForm;
