export const setUser = user => {
  return {
    type: "CURRENT_USER",
    payload: user
  };
};
export const updateAccounts = value => {
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
export const setTutorial = value => {
  return {
    type: "TUTORIAL",
    payload: value
  };
};
