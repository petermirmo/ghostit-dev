import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import GIContainer from "../../containers/GIContainer";
import GIText from "../GIText";

import "./style.css";

class Dropdown extends Component {
  state = {
    showDropdown: false
  };
  render() {
    const { showDropdown } = this.state;
    const { dropdownItems, search, title } = this.props; // Variables
    const { handleParentChange } = this.props; // Functions

    return (
      <GIContainer
        className="dropdown-container"
        onClick={() => this.setState({ showDropdown: !showDropdown })}
      >
        <GIContainer className="dropdown-something full-center pa8 br8">
          {title}
          <FontAwesomeIcon className="five-blue mx8" icon={faChevronDown} />
        </GIContainer>
        {showDropdown && (
          <GIContainer className="dropdown">
            {dropdownItems.map((item, index) => (
              <GIContainer
                key={index}
                onClick={() => handleParentChange({ item, index })}
              >
                {item}
              </GIContainer>
            ))}
          </GIContainer>
        )}
      </GIContainer>
    );
  }
}

export default Dropdown;
