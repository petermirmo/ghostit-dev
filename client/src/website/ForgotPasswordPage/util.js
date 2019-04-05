import axios from "axios";

export const sendResetEmail = (email, callback) => {
  if (!email) {
    callback({
      message: "Enter an email address!",
      type: "danger",
      title: "Something went wrong!"
    });
  } else {
    axios.post("/api/email/reset", { email: email.toLowerCase() }).then(res => {
      const { success, errorMessage } = res.data;
      console.log(res);
      if (success) {
        callback({
          message: "",
          type: "success",
          title: "Email Sent!"
        });
      } else {
        callback({
          message: errorMessage,
          type: "danger",
          title: "Something went wrong!"
        });
      }
    });
  }
};
