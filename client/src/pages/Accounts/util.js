import axios from "axios";

export const getUserAccounts = callback => {
  // Get all connected accounts of the user
  axios.get("/api/accounts").then(res => {
    const { accounts } = res.data;

    if (accounts) {
      // Set user's accounts to state
      callback(accounts);
    }
  });
};

export const getFacebookPages = callback => {
  axios.get("/api/facebook/pages").then(res => {
    const { pages, errorMessage } = res.data;

    callback(pages, errorMessage);
  });
};

export const getFacebookGroups = callback => {
  axios.get("/api/facebook/groups").then(res => {
    // Set user's facebook groups to state
    const { groups, errorMessage } = res.data;

    callback(groups, errorMessage);
  });
};

export const getInstagramPages = callback => {
  axios.get("/api/instagram/pages").then(res => {
    let { pages, errorMessage } = res.data;

    callback(pages, errorMessage);
  });
};

export const getLinkedinPages = callback => {
  axios.get("/api/linkedin/pages").then(res => {
    let { pages, errorMessage } = res.data;
    console.log(res.data);

    callback(pages, errorMessage);
  });
};

export const disconnectAccount = (confirmDelete, accountToDelete, callback) => {
  if (confirmDelete) {
    axios.delete("/api/account/" + accountToDelete._id).then(res => {
      callback({ accountToDelete: undefined, deleteAccount: false });
    });
  } else {
    callback({ accountToDelete: undefined, deleteAccount: false });
  }
};
