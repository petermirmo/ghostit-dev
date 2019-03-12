import React, { Component } from "react";

import GIText from "../../views/GIText";
import "./style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class EmailForm extends Component {
  state = { emailValue: "", fNameValue: "", lNameValue: "" };
  render() {
    const { emailValue, fNameValue, lNameValue } = this.state;

    return (
      <form
        action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=97b7dd0676"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        class="validate"
        target="_blank"
        novalidate
      >
        <input type="hidden" name="u" value="eb05e4f830c2a04be30171b01" />
        <input type="hidden" name="id" value="8281a64779" />
        <GIText type="label">
          Email
          <input
            type="email"
            name="EMAIL"
            value={emailValue}
            onChange={e => {
              this.setState({ emailValue: e.target.value });
            }}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </GIText>
        <input type="submit" value="Subscribe" name="subscribe" />

        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="b_6295bbe9fa9b4ee614df357c4_97b7dd0676"
            tabindex="-1"
            value=""
          />
        </div>
        <div class="clear">
          <input
            type="submit"
            value="Subscribe"
            name="subscribe"
            id="mc-embedded-subscribe"
          />
        </div>
      </form>
    );
  }
}

export default EmailForm;
