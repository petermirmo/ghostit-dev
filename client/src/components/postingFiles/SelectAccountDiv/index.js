import React, { Component } from "react";

import GIContainer from "../../containers/GIContainer";

import { createActiveAccountDivs, createInactiveAccountDivs } from "./util";

import "./style.css";

class SelectAccountDiv extends Component {
  render() {
    const {
      activeAccount,
      activePageAccountsArray = [],
      inactivePageAccountsArray = [],
      handleChange,
      linkAccountToCalendarPrompt
    } = this.props;

    const accountsListDiv = createActiveAccountDivs(
      activeAccount,
      activePageAccountsArray,
      handleChange
    );
    const inactiveAccountsDiv = createInactiveAccountDivs(
      activePageAccountsArray.map((account, index) => account._id),
      inactivePageAccountsArray,
      linkAccountToCalendarPrompt
    );

    return (
      <GIContainer className="simple-container mb32">
        {activePageAccountsArray.length === 0 && (
          <h4>Connect an account to create a post!</h4>
        )}
        <GIContainer className="wrapping-container-no-center">
          {accountsListDiv}
        </GIContainer>
        {inactiveAccountsDiv.length !== 0 && (
          <GIContainer className="py8">
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
