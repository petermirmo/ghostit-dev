import React, { Component } from "react";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { hiddenFormPortion } from "./util";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = { email: "", fName: "", cName: "", phoneNumber: "" };
  render() {
    const { email, fName, cName, phoneNumber } = this.state;

    return (
      <form
        action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=af1c511e3c"
        method="POST"
        noValidate
        style={{ flex: 1 }}
      >
        <GIText type="h4" text="Full Name" className="mb8" />
        <input
          type="text"
          name="FNAME"
          value={fName}
          onChange={e => {
            this.setState({ fName: e.target.value });
          }}
          placeholder="Bruce Wayne"
        />

        <GIText type="h4" text="Email Address" className="mt16 mb8" />
        <input
          type="email"
          name="EMAIL"
          value={email}
          onChange={e => {
            this.setState({ email: e.target.value });
          }}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="bruce@wayneenterprices.com"
        />
        <GIText type="h4" text="Company Name" className="mt16 mb8" />
        <input
          type="text"
          name="CNAME"
          value={cName}
          onChange={e => {
            this.setState({ cName: e.target.value });
          }}
          placeholder="Wayne Tech"
        />
        <GIText type="h4" text="Phone Number" className="mt16 mb8" />
        <input
          type="text"
          name="PHONE"
          value={phoneNumber}
          onChange={e => {
            this.setState({ phoneNumber: e.target.value });
          }}
          placeholder="+1 (555) 555-5555"
        />
        <GIContainer className="justifyEnd mt32">
          <GIButton
            type="submit"
            text="Book a Call"
            name="subscribe"
            className="regular-button"
          />
        </GIContainer>
        {hiddenFormPortion}
      </form>
    );
  }
}

export default MyForm;
