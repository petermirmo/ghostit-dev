export const shouldShowSignedInAsDiv = (user, activePage) => {
  if (
    user &&
    (activePage === "/content" ||
      activePage === "/subscribe" ||
      activePage === "/accounts") &&
    user.signedInAsUser
  ) {
    return true;
  } else return false;
};

export const isUserInPlatform = activePage => {
  if (
    activePage === "/content" ||
    activePage === "/subscribe" ||
    activePage === "/strategy" ||
    activePage === "/analytics" ||
    activePage === "/social-accounts" ||
    activePage === "/writers-brief" ||
    activePage.substring(0, 7) === "/manage" ||
    activePage === "/profile" ||
    activePage === "/subscription" ||
    activePage === "/ads"
  )
    return true;
  else return false;
};
