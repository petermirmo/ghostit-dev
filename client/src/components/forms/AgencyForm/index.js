import React, { Component } from "react";
import axios from "axios";

import GIText from "../../views/GIText";
import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { hiddenFormPortion } from "./util";

import { isMobileOrTablet } from "../../../util";

import "./style.css";

// This is a MailChimp form and adds directly to a list for our mailchimp!
// The absolute div is to protect sign ups from bots

class MyForm extends Component {
  state = { email: "", fName: "", cName: "", phoneNumber: "" };
  render() {
    const { email, fName, cName, phoneNumber } = this.state;

    return (
      <form
        className={
          "flex column fill-flex full-center bg-blue-fade-6 relative mt32 " +
          (isMobileOrTablet() ? "py32 px16" : "pa64")
        }
        id="agency-form"
        method="POST"
        onSubmit={e => {
          e.preventDefault();
          const { email, fName, cName, phoneNumber } = this.state;

          if (email) {
            axios
              .post("/api/book-a-call", {
                company: cName,
                email,
                name: fName,
                phoneNumber
              })
              .then(res => {
                const { success } = res.data;

                if (success) {
                  alert(
                    "Thank you for getting in touch. We will email you within 24 hours to book that call!"
                  );

                  this.setState({
                    email: "",
                    fName: "",
                    cName: "",
                    phoneNumber: ""
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
        <GIContainer className="wrap full-center">
          <input
            className={
              "px16 py8 mb16 mx8 br20 " +
              (isMobileOrTablet() ? "x-fill" : "x-300px")
            }
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
            className={
              "px16 py8 mb16 mx8 br20 " +
              (isMobileOrTablet() ? "x-fill" : "x-300px")
            }
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
            name="EMAIL"
            placeholder="Email Address"
            value={email}
            type="email"
          />
        </GIContainer>
        <GIContainer className="wrap full-center">
          <input
            className={
              "px16 py8 mb16 mx8 br20 " +
              (isMobileOrTablet() ? "x-fill" : "x-300px")
            }
            onChange={e => {
              this.setState({ cName: e.target.value });
            }}
            name="CNAME"
            placeholder="Company Name"
            value={cName}
            type="text"
          />
          <input
            className={
              "px16 py8 mb16 mx8 br20 " +
              (isMobileOrTablet() ? "x-fill" : "x-300px")
            }
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
