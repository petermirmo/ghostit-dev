import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";

export const createActiveAccountDivs = (
  activeAccount,
  activePageAccountsArray,
  handleChange,
  switchTabState
) => {
  // To select which account to post to
  return activePageAccountsArray.map((account, index) => {
    const name = createName(account);
    const { color, icon } = getColorSocial(account);
    let className = `account-container clickable full-center px16 py8 mr8 mb8 br4 ${
      activeAccount === String(account.socialID) ? "common-active" : ""
    }`;

    return accountDiv(account, className, color, icon, index, name, () => {
      handleChange(account);
      if (switchTabState) switchTabState({ name: account.socialType });
    });
  });
};
export const createInactiveAccountDivs = (
  activeAccountIDs,
  inactivePageAccountsArray,
  linkAccountToCalendarPrompt
) => {
  const inactiveAccountsDiv = [];
  // inactive accounts will be slightly transparent and clicking on them will prompt
  // the user to link the account to the calendar
  for (let index in inactivePageAccountsArray) {
    const account = inactivePageAccountsArray[index];
    const name = createName(account);
    const { color, icon } = getColorSocial(account);
    let className =
      "account-container clickable full-center px16 py8 mr8 mb8 br4";

    // skip account if it's already being displayed in the active list
    if (activeAccountIDs.includes(account._id.toString())) continue;

    inactiveAccountsDiv.push(
      accountDiv(account, className, color, icon, index, name, () =>
        linkAccountToCalendarPrompt(account._id)
      )
    );
  }
  return inactiveAccountsDiv;
};

const createName = account => {
  let name;
  if (account.givenName)
    name =
      account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
  if (account.familyName)
    name +=
      " " +
      account.familyName.charAt(0).toUpperCase() +
      account.familyName.slice(1);
  if (account.username) name = account.username;
  return name;
};

const getColorSocial = account => {
  let icon;
  let color;
  if (account.socialType === "twitter") {
    icon = faTwitter;
    color = "#1da1f2";
  } else if (account.socialType === "linkedin") {
    icon = faLinkedinIn;
    color = "#0077b5";
  } else if (account.socialType === "facebook") {
    icon = faFacebookF;
    color = "#4267b2";
  } else if (account.socialType === "instagram") {
    icon = faInstagram;
    color = "#cd486b";
  }
  return { color, icon };
};

const accountDiv = (account, className, color, icon, index, name, onClick) => (
  <GIContainer
    className={className}
    onClick={onClick}
    key={index}
    style={{ backgroundColor: color }}
  >
    <FontAwesomeIcon
      className="round-icon round common-border white pa4 mr8"
      icon={icon}
    />
    <GIContainer className="column">
      <GIText className="white" text={name} type="h6" />
      <GIText className="white" text={account.accountType} type="p" />
    </GIContainer>
  </GIContainer>
);
