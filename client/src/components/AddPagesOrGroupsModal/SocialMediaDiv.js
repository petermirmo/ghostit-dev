import React, { Component } from "react";

import CheckBox from "../views/CheckBox";
import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";

class socialMediaDiv extends Component {
  state = {
    pagesToAdd: [],
    activeDivs: []
  };

  //  For social media background color change on click
  handleParentClick = indexOfAccount => {
    const { accounts } = this.props; // Variables
    const { updateParentAccounts } = this.props; // Functions

    let { pagesToAdd, activeDivs } = this.state;

    let temp = activeDivs;
    // Check if object is in state array
    if (!pagesToAdd.includes(accounts[indexOfAccount])) {
      // Page index is not in array
      pagesToAdd.push(accounts[indexOfAccount]);
      temp[indexOfAccount] = true;
    } else {
      // Page index is in array so remove it
      let index = pagesToAdd.indexOf(accounts[indexOfAccount]);
      pagesToAdd.splice(index, 1);
      temp[indexOfAccount] = false;
    }
    this.setState({ activeDivs: temp });
    updateParentAccounts(pagesToAdd);
  };

  render() {
    const { accounts } = this.props;
    const { activeDivs } = this.state;

    const accountsDiv = accounts.map((page, index) => (
      <GIContainer
        className={index !== accounts.length - 1 ? "border-bottom" : ""}
        key={index}
      >
        <GIContainer
          className="align-center justify-between flex-fill pa16"
          onClick={event => this.handleParentClick(index)}
        >
          <GIContainer className="column">
            <GIText text={page.name ? page.name : page.username} type="h4" />
            <GIText text={page.category} type="p" />
          </GIContainer>

          <CheckBox active={activeDivs[index]} />
        </GIContainer>
      </GIContainer>
    ));

    return <GIContainer className="column">{accountsDiv}</GIContainer>;
  }
}

export default socialMediaDiv;
