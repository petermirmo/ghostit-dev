import axios from "axios";

export const getUser = callback => {
  axios
    .get("/api/user")
    .then(res => {
      const { error, user } = res.data;

      if (!error) {
        callback(user);
      } else {
        // TODO: handleerror
      }
    })
    .catch(error => {
      //window.location.reload();
    });
};
export const getAccounts = callback => {
  axios.get("/api/accounts").then(res => {
    // Set user's accounts to state
    let { accounts } = res.data;

    if (!accounts) {
      // TODO: handle error
      accounts = [];
    }

    callback(accounts);
  });
};

export const getBlogs = callback => {
  axios.get("/api/ghostit/blogs").then(res => {
    const { error, ghostitBlogs } = res.data;
    if (!error) callback(ghostitBlogs);
    else {
      // TODO: handle error
    }
  });
};

export const useAppropriateFunctionForEscapeKey = getKeyListenerFunction => {
  document.removeEventListener("keydown", getKeyListenerFunction[1], false);
  document.addEventListener("keydown", getKeyListenerFunction[0], false);
};
