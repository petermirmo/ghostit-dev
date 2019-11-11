import React, { Component } from "react";

import GIContainer from "../../containers/GIContainer";

import { createActiveAccountDivs, createInactiveAccountDivs } from "./util";

import "./style.css";

class SelectAccountDiv extends Component {
  render() {
    const {
      activeAccount,
      activePageAccountsArray = [],
      inactivePageAccountsArray = []
    } = this.props; // Variables
    const {
      handleChange,
      linkAccountToCalendarPrompt,
      switchTabState
    } = this.props; // Functions

    const accountsListDiv = createActiveAccountDivs(
      activeAccount,
      activePageAccountsArray,
      handleChange,
      switchTabState
    );
    const inactiveAccountsDiv = createInactiveAccountDivs(
      activePageAccountsArray.map((account, index) => account._id),
      inactivePageAccountsArray,
      linkAccountToCalendarPrompt
    );

    return (
      <GIContainer className="simple-container">
        {activePageAccountsArray.length === 0 && (
          <h4>Connect an account to create a post!</h4>
        )}
        <GIContainer className="wrapping-container-no-center">
          {accountsListDiv}
        </GIContainer>
        {inactiveAccountsDiv.length !== 0 && (
          <GIContainer className="fs-16 mb8">
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
