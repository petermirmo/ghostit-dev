export const changePage = activePage => {
  history.pushState(null, null, "/" + activePage);
  return {
    type: "TAB_SELECTED",
    payload: activePage
  };
};
export const setUser = user => {
  return {
    type: "CURRENT_USER",
    payload: user
  };
};
export const openClientSideBar = value => {
  return {
    type: "CLIENT_SIDE_BAR",
    payload: value
  };
};
export const openHeaderSideBar = value => {
  return {
    type: "HEADER_SIDE_BAR",
    payload: value
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
