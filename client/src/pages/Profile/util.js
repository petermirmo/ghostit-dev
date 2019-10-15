import axios from "axios";

export const saveUser = (userUpdates, userID, callback, history) => {
  axios.post("/api/user/" + userID, userUpdates).then(res => {
    const { loggedIn, success, result, message } = res.data;
    if (loggedIn === false) history.push("/sign-in");

    if (success) {
      const user = result;
      callback(user);
    } else {
      // Todo: handle error
      alert(message);
      callback({});
    }
  });
};

export const logout = callback => {
  axios.get("/api/logout").then(res => {
    const { success } = res.data;

    if (success) {
      callback();
    } else {
      window.location.reload();
    }
  });
};
