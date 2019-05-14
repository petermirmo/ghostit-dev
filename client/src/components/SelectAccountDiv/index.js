import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookSquare,
  faLinkedin,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

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
        <div
          className={className}
          onClick={event => handleChange(account)}
          key={index}
        >
          <span className="account-icon">
            <FontAwesomeIcon icon={icon} size="3x" color={color} />
          </span>
          <div className="account-title-type-container">
            <div className="account-name">{name}</div>
            <div className="account-type">{account.accountType}</div>
          </div>
        </div>
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
        <div
          className={className}
          onClick={() => this.props.linkAccountToCalendarPrompt(account._id)}
          key={index}
        >
          <span className="account-icon inactive">
            <FontAwesomeIcon icon={icon} size="3x" color={color} />
          </span>
          <div className="account-title-type-container inactive">
            <div className="account-name inactive">{name}</div>
            <div className="account-type inactive">{account.accountType}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="simple-container">
        {activePageAccountsArray.length === 0 && (
          <h4>Connect an account to create a post!</h4>
        )}
        <div className="wrapping-container-no-center">{accountsListDiv}</div>
        {inactiveAccountsDiv.length !== 0 && (
          <div className="accounts-link-to-calendar-label">
            Accounts not yet linked to calendar
          </div>
        )}
        <div className="wrapping-container-no-center">
          {inactiveAccountsDiv}
        </div>
      </div>
    );
  }
}
export default SelectAccountDiv;
