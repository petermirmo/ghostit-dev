export const setUser = user => {
  return {
    type: "CURRENT_USER",
    payload: user
  };
};
export const setaccounts = value => {
  return {
    type: "SOCIAL_ACCOUNTS",
    payload: value
  };
};
export const setKeyListenerFunction = value => {
  return {
    type: "KEY_LISTENER",
    payload: value
  };
};
