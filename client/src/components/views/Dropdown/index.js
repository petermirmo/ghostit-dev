import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-light-svg-icons";

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
    const {
      className,
      dropdownItems,
      search,
      size,
      testMode,
      title
    } = this.props; // Variables
    const { handleParentChange } = this.props; // Functions

    return (
      <GIContainer
        className={`button ${className}`}
        onClick={() => this.setState({ showDropdown: !showDropdown })}
        forwardedRef={this.setWrapperRef}
        testMode={testMode}
      >
        <GIContainer className="dropdown-title-container align-center pr8">
          {title}
          <FontAwesomeIcon
            className="five-blue mx8"
            icon={faAngleDown}
            size={size}
          />
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
