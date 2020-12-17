import React from "react";
import axios from "axios";

export const formSubmit = (
  {
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
  },
  handleChange,
  history
) => {
  if (email || phoneNumber) {
    axios
      .post("/api/book-a-call", {
        afternoons,
        blogging,
        email,
        emailNewsletters,
        name: fName,
        message,
        mornings,
        paidAdvertisements,
        phoneNumber,
        socialMedia,
        webDev,
        weekdays,
        weekends
      })
      .then(res => {
        const { success } = res.data;

        if (success) {
          history.push("/thank-you");
        } else {
          alert(
            "Error - Your request was not successful, please email us directly at hello@ghostit.co."
          );
        }
        console.log(success);
      });
  } else alert("Please fill out the email form field! :)");
};

export const hiddenFormPortion = (
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
);
