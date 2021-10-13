import React, { Component } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { formSubmit, hiddenFormPortion } from "./util";

import { isMobileOrTablet } from "../../../util";

import "../style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = {
    afternoons: true,
    blogging: false,
    email: "",
    emailNewsletters: false,
    fName: "",
    message: "",
    mornings: false,
    paidAdvertisements: false,
    phoneNumber: "",
    recaptcha: false,
    socialMedia: false,
    webDev: false,
    weekdays: true,
    weekends: false
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  render() {
    const {
      afternoons,
      blogging,
      email,
      emailNewsletters,
      fName,
      message,
      mornings,
      paidAdvertisements,
      phoneNumber,
      socialMedia,
      webDev,
      weekdays,
      weekends
    } = this.state;
    const { history } = this.props;

    return (
      <form
        className={
          "container large gap8 pa32 " + (isMobileOrTablet() ? "px16" : "")
        }
        id="contact-us-form"
        onSubmit={e => {
          const { recaptcha } = this.state;

          e.preventDefault();
          if (recaptcha) {
            formSubmit(this.state, history);
          } else {
            alert("Please complete ReCAPTCHA");
          }
        }}
        noValidate
      >
        <h3 className="mb8">Contact Form</h3>
        <GIContainer className="x-fill wrap gap8 mb16">
          <GIContainer className="flex-fill column gap8">
            <input
              className="px16 py8 br20"
              onChange={e => {
                this.setState({ fName: e.target.value });
              }}
              name="FNAME"
              placeholder="Full Name"
              value={fName}
              type="text"
            />
            <input
              autoCapitalize="off"
              autoCorrect="off"
              className="px16 py8 br20"
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
              name="EMAIL"
              placeholder="Email Address"
              value={email}
              type="email"
            />

            <input
              className="px16 py8 br20"
              onChange={e => {
                this.setState({ phoneNumber: e.target.value });
              }}
              name="PHONE"
              placeholder="Phone Number"
              value={phoneNumber}
              type="text"
            />
          </GIContainer>
          <textarea
            className="flex-fill px16 py8 br8"
            onChange={e => {
              this.setState({ message: e.target.value });
            }}
            name="CNAME"
            placeholder="Message"
            style={{
              resize: "none",
              minHeight: "120px"
            }}
            value={message}
            type="text"
          />
        </GIContainer>
        <h3 className="mb8">Services You Are Looking For</h3>
        <GIContainer className="wrap gap8 mb16">
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (webDev ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ webDev: !webDev })}
          >
            Web Development & Design
          </p>
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (blogging ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ blogging: !blogging })}
          >
            Blogs
          </p>
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (socialMedia ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ socialMedia: !socialMedia })}
          >
            Social Media
          </p>
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (emailNewsletters ? "four-blue" : "")
            }
            onClick={() =>
              this.handleChange({ emailNewsletters: !emailNewsletters })
            }
          >
            Email Newsletters
          </p>
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (paidAdvertisements ? "four-blue" : "")
            }
            onClick={() =>
              this.handleChange({ paidAdvertisements: !paidAdvertisements })
            }
          >
            Paid Ads and Promotions
          </p>
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (paidAdvertisements &&
              blogging &&
              emailNewsletters &&
              socialMedia &&
              webDev
                ? "four-blue"
                : "")
            }
            onClick={() =>
              this.handleChange({
                paidAdvertisements: true,
                blogging: true,
                emailNewsletters: true,
                socialMedia: true,
                webDev: true
              })
            }
          >
            All Of The Above
          </p>
          <p
            className={
              "no-select clickable grey common-border thick pa8 br20 " +
              (!paidAdvertisements &&
              !blogging &&
              !emailNewsletters &&
              !socialMedia &&
              !webDev
                ? "four-blue"
                : "")
            }
            onClick={() =>
              this.handleChange({
                paidAdvertisements: false,
                blogging: false,
                emailNewsletters: false,
                socialMedia: false,
                webDev: false
              })
            }
          >
            None Of The Above
          </p>
        </GIContainer>
        <h3 className="mb8">When Can You Chat?</h3>
        <GIContainer className="column wrap gap8">
          <GIContainer className="gap8">
            <p
              className={
                "no-select clickable grey common-border thick pa8 br20 " +
                (weekdays && !weekends ? "four-blue" : "")
              }
              onClick={() => {
                if (weekends && weekdays)
                  this.handleChange({ weekends: false });
                else
                  this.handleChange({
                    weekdays: !weekdays,
                    weekends: weekdays
                  });
              }}
            >
              Weekdays
            </p>
            <p
              className={
                "no-select clickable grey common-border thick pa8 br20 " +
                (weekends && !weekdays ? "four-blue" : "")
              }
              onClick={() => {
                if (weekends && weekdays)
                  this.handleChange({ weekdays: false });
                else
                  this.handleChange({
                    weekends: !weekends,
                    weekdays: weekends
                  });
              }}
            >
              Weekends
            </p>
            <p
              className={
                "no-select clickable grey common-border thick pa8 br20 " +
                (weekends && weekdays ? "four-blue" : "")
              }
              onClick={() => {
                if (weekends && weekdays)
                  this.handleChange({ weekends: false, weekdays: false });
                else this.handleChange({ weekends: true, weekdays: true });
              }}
            >
              Either
            </p>
          </GIContainer>
          <GIContainer className="gap8">
            <p
              className={
                "no-select clickable grey common-border thick pa8 br20 " +
                (mornings && !afternoons ? "four-blue" : "")
              }
              onClick={() => {
                if (mornings && afternoons)
                  this.handleChange({ afternoons: false });
                else
                  this.handleChange({
                    mornings: !mornings,
                    afternoons: mornings
                  });
              }}
            >
              Mornings
            </p>
            <p
              className={
                "no-select clickable grey common-border thick pa8 br20 " +
                (afternoons && !mornings ? "four-blue" : "")
              }
              onClick={() => {
                if (afternoons && mornings)
                  this.handleChange({ mornings: false });
                else
                  this.handleChange({
                    afternoons: !afternoons,
                    mornings: afternoons
                  });
              }}
            >
              Afternoons
            </p>
            <p
              className={
                "no-select clickable grey common-border thick pa8 br20 " +
                (mornings && afternoons ? "four-blue" : "")
              }
              onClick={() => {
                if (afternoons && mornings)
                  this.handleChange({ afternoons: false, mornings: false });
                else this.handleChange({ afternoons: true, mornings: true });
              }}
            >
              Anytime
            </p>
          </GIContainer>
        </GIContainer>
        <ReCAPTCHA
          onChange={value => this.handleChange({ recaptcha: true })}
          sitekey="6LeLcA8aAAAAAJRbLVHmuMTo-pT-frtf_klCoyyC"
        />

        <GIContainer className="pt16">
          <GIButton
            className="white bg-orange-fade-2 shadow-orange-3 px32 py16 br32"
            name="subscribe"
            text="Submit"
          />
        </GIContainer>
        {hiddenFormPortion}
      </form>
    );
  }
}

export default MyForm;
