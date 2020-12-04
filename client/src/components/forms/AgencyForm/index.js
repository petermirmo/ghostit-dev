import React, { Component } from "react";
import axios from "axios";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { hiddenFormPortion } from "./util";

import { isMobileOrTablet } from "../../../util";

import "../style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = {
    ads: false,
    afternoons: false,
    blogs: false,
    email: "",
    emailNewsletters: false,
    fName: "",
    message: "",
    mornings: false,
    phoneNumber: "",
    socialMedia: false,
    webDev: false,
    weekends: false,
    weekdays: false,
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = (stateObj) => {
    if (this._ismounted) this.setState(stateObj);
  };
  render() {
    const {
      ads,
      afternoons,
      blogs,
      email,
      emailNewsletters,
      fName,
      message,
      mornings,
      phoneNumber,
      socialMedia,
      webDev,
      weekdays,
      weekends,
    } = this.state;

    return (
      <form
        className={
          "container large flex column full-center relative bg-white shadow pa16 br8 " +
          (isMobileOrTablet() ? "px16" : "")
        }
        id="contact-us-form"
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          const { email, fName, message, phoneNumber } = this.state;

          if (email || phoneNumber) {
            axios
              .post("/api/book-a-call", {
                message,
                email,
                name: fName,
                phoneNumber,
              })
              .then((res) => {
                const { success } = res.data;

                if (success) {
                  alert(
                    "Thank you for getting in touch. We will email you within 24 hours to book that call!"
                  );

                  this.setState({
                    email: "",
                    fName: "",
                    message: "",
                    phoneNumber: "",
                  });
                } else {
                  alert(
                    "Error - Your request was not successful, please email us directly at hello@ghostit.co."
                  );
                }
                console.log(success);
              });
          } else alert("Please fill out the email form field! :)");
        }}
        noValidate
      >
        <GIContainer className="flex-fill x-fill wrap">
          <GIContainer className="flex-fill column px16">
            <input
              className="px16 py8 mb16 br20"
              onChange={(e) => {
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
              className="px16 py8 mb16 br20"
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
              name="EMAIL"
              placeholder="Email Address"
              value={email}
              type="email"
            />

            <input
              className="px16 py8 mb16 br20"
              onChange={(e) => {
                this.setState({ phoneNumber: e.target.value });
              }}
              name="PHONE"
              placeholder="Phone Number"
              value={phoneNumber}
              type="text"
            />
          </GIContainer>
          <GIContainer className="flex-fill px8">
            <textarea
              className="x-fill px16 py8 mb16 mx8 br8"
              onChange={(e) => {
                this.setState({ message: e.target.value });
              }}
              name="CNAME"
              placeholder="Message"
              style={{ resize: "none", minHeight: "120px" }}
              value={message}
              type="text"
            />
          </GIContainer>
        </GIContainer>
        <GIContainer className="x-fill pa16">
          <h3 className="flex-fill x-fill">Services You Are Looking For</h3>
        </GIContainer>
        <GIContainer className="wrap x-fill pb8 px8">
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (webDev ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ webDev: !webDev })}
          >
            Web Development & Design
          </p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (blogs ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ blogs: !blogs })}
          >
            Blogs
          </p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (socialMedia ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ socialMedia: !socialMedia })}
          >
            Social Media
          </p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
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
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (ads ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ ads: !ads })}
          >
            Ads
          </p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (ads && blogs && emailNewsletters && socialMedia && webDev
                ? "four-blue"
                : "")
            }
            onClick={() =>
              this.handleChange({
                ads: true,
                blogs: true,
                emailNewsletters: true,
                socialMedia: true,
                webDev: true,
              })
            }
          >
            All Of The Above
          </p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (!ads && !blogs && !emailNewsletters && !socialMedia && !webDev
                ? "four-blue"
                : "")
            }
            onClick={() =>
              this.handleChange({
                ads: false,
                blogs: false,
                emailNewsletters: false,
                socialMedia: false,
                webDev: false,
              })
            }
          >
            None Of The Above
          </p>
        </GIContainer>
        <GIContainer className="x-fill pa16">
          <h3 className="flex-fill x-fill">When Can You Chat?</h3>
        </GIContainer>
        <GIContainer className="wrap x-fill pb8 px8">
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (weekdays ? "four-blue" : "")
            }
            onClick={() =>
              this.handleChange({ weekdays: !weekdays, weekends: weekdays })
            }
          >
            Weekdays
          </p>
          <p>Or</p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (weekends ? "four-blue" : "")
            }
            onClick={() =>
              this.handleChange({ weekends: !weekends, weekdays: weekends })
            }
          >
            Weekends
          </p>

          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (mornings ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ mornings: !mornings })}
          >
            Mornings
          </p>
          <p>Or</p>
          <p
            className={
              "clickable grey common-border thick pa8 mr8 mb8 br20 " +
              (afternoons ? "four-blue" : "")
            }
            onClick={() => this.handleChange({ afternoons: !afternoons })}
          >
            Afternoons
          </p>
        </GIContainer>
        <GIButton
          className="white bg-orange-fade-2 shadow-orange-3 px32 py16 br32"
          name="subscribe"
          text="Send Message"
          type="submit"
        />
        {hiddenFormPortion}
      </form>
    );
  }
}

export default MyForm;
