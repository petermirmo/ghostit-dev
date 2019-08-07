import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faLinkedin,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

import GIContainer from "../../containers/GIContainer";

import "./style.css";

class SelectAccountDiv extends Component {
  render() {
    let accountsListDiv = [];
    let inactiveAccountsDiv = [];
    let activeAccountIDs = [];
    let {
      activePageAccountsArray,
      inactivePageAccountsArray,
      activeAccount,
      handleChange
    } = this.props;
    if (!activePageAccountsArray) activePageAccountsArray = [];
    // To select which account to post to
    for (let index in activePageAccountsArray) {
      let name;
      let account = activePageAccountsArray[index];
      activeAccountIDs.push(account._id.toString());

      if (account.givenName)
        name =
          account.givenName.charAt(0).toUpperCase() +
          account.givenName.slice(1);
      if (account.familyName)
        name +=
          " " +
          account.familyName.charAt(0).toUpperCase() +
          account.familyName.slice(1);
      if (account.username) name = account.username;

      let className = "account-container";

      if (activeAccount === String(account.socialID))
        className += " common-active";

      // Push div to array
      let icon;
      let color;
      if (account.socialType === "twitter") {
        icon = faTwitter;
        color = "#1da1f2";
      } else if (account.socialType === "linkedin") {
        icon = faLinkedin;
        color = "#0077b5";
      } else if (account.socialType === "facebook") {
        icon = faFacebookSquare;
        color = "#4267b2";
      }
      accountsListDiv.push(
        <GIContainer
          className={className}
          onClick={event => handleChange(account)}
          key={index}
        >
          <span className="account-icon">
            <FontAwesomeIcon icon={icon} size="3x" color={color} />
          </span>
          <GIContainer className="account-title-type-container">
            <GIContainer className="account-name">{name}</GIContainer>
            <GIContainer className="account-type">
              {account.accountType}
            </GIContainer>
          </GIContainer>
        </GIContainer>
      );
    }

    // inactive accounts will be slightly transparent and clicking on them will prompt
    // the user to link the account to the calendar
    for (let index in inactivePageAccountsArray) {
      let name;
      let account = inactivePageAccountsArray[index];
      // skip account if it's already being displayed in the active list
      if (activeAccountIDs.includes(account._id.toString())) continue;

      if (account.givenName)
        name =
          account.givenName.charAt(0).toUpperCase() +
          account.givenName.slice(1);
      if (account.familyName)
        name +=
          " " +
          account.familyName.charAt(0).toUpperCase() +
          account.familyName.slice(1);
      if (account.username) name = account.username;

      let className = "account-container inactive";

      // Push div to array
      let icon;
      let color;
      if (account.socialType === "twitter") {
        icon = faTwitter;
        color = "#1da1f2";
      } else if (account.socialType === "linkedin") {
        icon = faLinkedin;
        color = "#0077b5";
      } else if (account.socialType === "facebook") {
        icon = faFacebookSquare;
        color = "#4267b2";
      }
      inactiveAccountsDiv.push(
        <GIContainer
          className={className}
          onClick={() => this.props.linkAccountToCalendarPrompt(account._id)}
          key={index}
        >
          <span className="account-icon inactive">
            <FontAwesomeIcon icon={icon} size="3x" color={color} />
          </span>
          <GIContainer className="account-title-type-container inactive">
            <GIContainer className="account-name inactive">{name}</GIContainer>
            <GIContainer className="account-type inactive">
              {account.accountType}
            </GIContainer>
          </GIContainer>
        </GIContainer>
      );
    }
    return (
      <GIContainer className="simple-container">
        {activePageAccountsArray.length === 0 && (
          <h4>Connect an account to create a post!</h4>
        )}
        <GIContainer className="wrapping-container-no-center">
          {accountsListDiv}
        </GIContainer>
        {inactiveAccountsDiv.length !== 0 && (
          <GIContainer className="accounts-link-to-calendar-label">
            Accounts not yet linked to calendar
          </GIContainer>
        )}
        <GIContainer className="wrapping-container-no-center">
          {inactiveAccountsDiv}
        </GIContainer>
      </GIContainer>
    );
  }
}
export default SelectAccountDiv;
