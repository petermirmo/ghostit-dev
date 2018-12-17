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
export const openContentModal = value => {
  return {
    type: "CONTENT_MODAL",
    payload: value
  };
};
export const openCampaignModal = value => {
  return {
    type: "CAMPAIGN_MODAL",
    payload: value
  };
};

export const openCalendarManagerModal = value => {
  return {
    type: "CALENDAR_MANAGE_MODAL",
    payload: value
  };
};
