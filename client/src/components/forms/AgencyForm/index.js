import React, { Component } from "react";

import GIText from "../../views/GIText";
import "./style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = { emailValue: "", fNameValue: "", lNameValue: "" };
  render() {
    const { emailValue, fNameValue, lNameValue } = this.state;

    return (
      <form
        action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=97b7dd0676"
        method="POST"
        noValidate
      >
        <input type="hidden" name="u" value="eb05e4f830c2a04be30171b01" />
        <input type="hidden" name="id" value="8281a64779" />
        <GIText htmlFor="MERGE0" type="label">
          Email
          <input
            type="email"
            name="EMAIL"
            id="MERGE0"
            value={emailValue}
            onChange={e => {
              this.setState({ emailValue: e.target.value });
            }}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </GIText>
        <GIText htmlFor="MERGE1" type="label">
          First name
          <input
            type="text"
            name="FNAME"
            id="MERGE1"
            value={fNameValue}
            onChange={e => {
              this.setState({ fNameValue: e.target.value });
            }}
          />
        </GIText>
        <GIText htmlFor="MERGE2" type="label">
          Last name
          <input
            type="text"
            name="LNAME"
            id="MERGE2"
            value={lNameValue}
            onChange={e => {
              this.setState({ lNameValue: e.target.value });
            }}
          />
        </GIText>
        <input
          type="submit"
          value="Subscribe"
          name="subscribe"
          id="mc-embedded-subscribe"
        />

        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
          aria-label="Please leave the following three fields empty"
        >
          <label htmlFor="b_name">Name: </label>
          <input
            type="text"
            name="b_name"
            tabIndex="-1"
            value=""
            placeholder="Freddie"
            id="b_name"
            readOnly={true}
          />

          <label htmlFor="b_email">Email: </label>
          <input
            type="email"
            name="b_email"
            tabIndex="-1"
            value=""
            placeholder="youremail@gmail.com"
            id="b_email"
            readOnly={true}
          />

          <label htmlFor="b_comment">Comment: </label>
          <textarea
            name="b_comment"
            tabIndex="-1"
            placeholder="Please comment"
            id="b_comment"
            readOnly={true}
          />
        </div>
      </form>
    );
  }
}

export default MyForm;
