import axios from "axios";

export const signOutOfUsersAccount = () => {
  axios.get("/api/signOutOfUserAccount").then(res => {
    const { error } = res.data;
    if (!error) window.location.reload();
    else {
      // TODO: handleerror
    }
  });
};
