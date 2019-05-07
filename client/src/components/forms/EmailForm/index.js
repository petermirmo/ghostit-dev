import React, { Component } from "react";

import GIInput from "../../views/GIInput";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class EmailForm extends Component {
  state = { emailValue: "" };

  render() {
    const { emailValue } = this.state;

    return (
      <form
        action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=97b7dd0676"
        method="post"
        name="mc-embedded-subscribe-form"
        target="_blank"
        noValidate
      >
        <GIContainer>
          <GIInput
            type="email"
            name="EMAIL"
            value={emailValue}
            onChange={e => {
              this.setState({ emailValue: e.target.value });
            }}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="Email address"
            className="merge-with-button purple-border"
          />
          <GIButton
            type="submit"
            text="Subscribe"
            name="subscribe"
            className="purple merge-with-input"
          />
        </GIContainer>

        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="b_6295bbe9fa9b4ee614df357c4_97b7dd0676"
            tabIndex="-1"
            value=""
            readOnly={true}
          />
          <input
            type="submit"
            value="Subscribe"
            name="subscribe"
            id="mc-embedded-subscribe"
            readOnly={true}
          />
        </div>
      </form>
    );
  }
}

export default EmailForm;
