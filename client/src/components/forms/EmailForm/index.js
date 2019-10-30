import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-light-svg-icons/faArrowRight";

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
            autoCapitalize="off"
            autoCorrect="off"
            className="merge-with-button px16 py8"
            name="EMAIL"
            onChange={e => {
              this.setState({ emailValue: e.target.value });
            }}
            placeholder="Email address"
            type="email"
            value={emailValue}
          />
          <GIButton
            className="merge-with-input bg-blue-fade-5 shadow-blue-5 full-center"
            name="subscribe"
            type="submit"
          >
            <FontAwesomeIcon className="white mx8" icon={faArrowRight} />
          </GIButton>
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
