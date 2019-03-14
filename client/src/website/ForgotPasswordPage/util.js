import axios from "axios";

export const sendResetEmail = (email, callback) => {
  if (!email) {
    // TODO: handleerror
  } else {
    axios.post("/api/email/reset", { email: email.toLowerCase() }).then(res => {
      let { error } = res.data;
      if (error) {
        // TODO: handleerror
      } else {
        callback("notification", {
          message: " ",
          type: "success",
          title: "Email Sent!",
          on: true
        });
      }
    });
  }
};
