export const shouldShowSignedInAsDiv = (activePage, user) => {
  if (
    user &&
    (activePage === "/calendar" ||
      activePage === "/subscribe" ||
      activePage === "/accounts" ||
      activePage === "/dashboard" ||
      activePage === "/analytics" ||
      activePage === "/social-accounts") &&
    user.signedInAsUser
  ) {
    return true;
  } else return false;
};

export const isUserInPlatform = activePage => {
  if (
    activePage.substring(0, 10) === "/dashboard" ||
    activePage.substring(0, 9) === "/calendar" ||
    activePage.substring(0, 10) === "/subscribe" ||
    activePage.substring(0, 8) === "/strategy" ||
    activePage.substring(0, 10) === "/analytics" ||
    activePage.substring(0, 16) === "/social-accounts" ||
    activePage.substring(0, 14) === "/writers-brief" ||
    activePage.substring(0, 7) === "/manage" ||
    activePage.substring(0, 8) === "/profile" ||
    activePage.substring(0, 13) === "/subscription" ||
    activePage.substring(0, 4) === "/ads"
  )
    return true;
  else return false;
};
