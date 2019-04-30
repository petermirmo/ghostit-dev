import axios from "axios";

export const saveUser = (userUpdates, userID, callback, props) => {
  axios.post("/api/user/" + userID, userUpdates).then(res => {
    const { loggedIn, success, result, message } = res.data;
    if (loggedIn === false) props.history.push("/sign-in");

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
