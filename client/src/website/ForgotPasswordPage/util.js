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

export const login = event => {
  event.preventDefault();
  const { email, password } = this.state;

  if (email && password) {
    axios
      .post("/api/login", { email: email.toLowerCase(), password })
      .then(res => {
        const { error, user } = res.data;

        if (success) {
          ReactGA.event({
            category: "User",
            action: "Login"
          });
          // Get all connected accounts of the user
          axios.get("/api/accounts").then(res => {
            let { accounts } = res.data;
            if (!accounts) accounts = [];

            if (user.role === "demo")
              this.activateDemoUserLogin(user, accounts);
            else {
              this.props.setUser(user);
              this.props.setaccounts(accounts);
              this.props.history.push("/content");
            }
          });
        } else {
          this.notify({
            message,
            type: "danger",
            title: "Something went wrong!"
          });
        }
      });
  }
};
export const register = event => {
  event.preventDefault();

  const {
    fullName,
    email,
    website,
    timezone,
    password,
    passwordConfirm
  } = this.state;

  if (!validateEmail(email)) {
    alert("Not a real email address!");
    return;
  }

  if (fullName && email && website && timezone && password) {
    if (password !== passwordConfirm) {
      alert("Passwords do not match.");
      return;
    }
    axios
      .post("/api/register", {
        fullName,
        email: email.toLowerCase(),
        website,
        timezone,
        password
      })
      .then(res => {
        const { success, user, message } = res.data;

        if (success && user) this.activateDemoUserLogin(user, []);
        else {
          this.notify({
            message,
            type: "danger",
            title: "Error"
          });
        }
      });
  } else {
    if (!fullName || !email || !website || !password) {
      alert("Please make sure each text field is filled in.");
    } else if (!timezone) {
      alert(
        "Error with timezone. Reload page and try again. If error persists, please contact Ghostit."
      );
    }
  }
};
