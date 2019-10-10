import React, { Component } from "react";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { hiddenFormPortion } from "./util";

import "./style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = { email: "", fName: "", cName: "", phoneNumber: "" };
  render() {
    const { email, fName, cName, phoneNumber } = this.state;

    return (
      <form
        action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=af1c511e3c"
        className="flex column fill-flex full-center bg-blue-fade-6 relative pa64 mt32"
        id="agency-form"
        method="POST"
        onSubmit={e => {
          e.preventDefault();
          if (email) document.getElementById("agency-form").submit();
          else alert("Please fill out the email form field! :)");
        }}
        noValidate
      >
        <GIContainer className="column">
          <GIText
            className="white tac x-fill px32 mb8"
            text="Book a Call"
            type="h1"
          />
          <GIText
            className="white tac x-fill px32 mb32"
            text="to go over the details of your content marketing requirements."
            type="h6"
          />
        </GIContainer>
        <GIContainer className="x-wrap">
          <input
            className="x-300px px16 py8 mb16 mr16 br20"
            onChange={e => {
              this.setState({ fName: e.target.value });
            }}
            name="FNAME"
            placeholder="First Name"
            value={fName}
            type="text"
          />

          <input
            autoCapitalize="off"
            autoCorrect="off"
            className="x-300px px16 py8 mb16 br20"
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
            name="EMAIL"
            placeholder="Email Address"
            value={email}
            type="email"
          />
        </GIContainer>
        <GIContainer className="x-wrap">
          <input
            className="x-300px px16 py8 mb16 mr16 br20"
            onChange={e => {
              this.setState({ cName: e.target.value });
            }}
            name="CNAME"
            placeholder="Company Name"
            value={cName}
            type="text"
          />
          <input
            className="x-300px px16 py8 mb16 br20"
            onChange={e => {
              this.setState({ phoneNumber: e.target.value });
            }}
            name="PHONE"
            placeholder="Phone Number"
            value={phoneNumber}
            type="text"
          />
        </GIContainer>
        <GIButton
          className="white bg-orange-fade-2 shadow-orange-3 px32 py16 br32"
          name="subscribe"
          text="Book Call"
          type="submit"
        />
        {hiddenFormPortion}
        <GIContainer id="left-blob" />
        <GIContainer id="right-blob" />
      </form>
    );
  }
}

export default MyForm;
