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

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  };
  render() {
    const { showDropdown } = this.state;
    const { className, dropdownItems, search, testMode, title } = this.props; // Variables
    const { handleParentChange } = this.props; // Functions

    return (
      <GIContainer
        className={`dropdown-container ${className}`}
        onClick={() => this.setState({ showDropdown: !showDropdown })}
        forwardedRef={this.setWrapperRef}
        testMode={testMode}
      >
        <GIContainer className="dropdown-something full-center pa8">
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
