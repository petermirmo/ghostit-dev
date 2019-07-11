import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import "./style.css";

class Filter extends Component {
  state = { isFilterClicked: false };
  handleChange = stateObj => {
    this.setState(stateObj);
  };
  render() {
    const { isFilterClicked } = this.state;
    const { categories } = this.props; // Variables
    const { updateActiveCategory } = this.props; // Functions

    let categoryDivs = [];
    for (let index in categories) {
      if (!index) break;
      categoryDivs.push(
        <div
          className="checkbox-and-writing-container spacing left button"
          key={index}
          onClick={() => updateActiveCategory(index)}
          id={index}
        >
          <div className="checkbox-box flex vc hc br4">
            <div
              className="checkbox-check"
              style={{ display: categories[index] ? undefined : "none" }}
            />
          </div>
          <div
            className={
              categories[index] ? "item px8 py4 active" : "item px8 py4"
            }
          >
            {index}
          </div>
        </div>
      );
    }

    return (
      <div
        className="filter-container flex relative"
        onClick={() => this.handleChange({ isFilterClicked: !isFilterClicked })}
      >
        <div className="regular-button large common-transition">
          Filter Calendar
          <FontAwesomeIcon icon={faAngleDown} className="ml8" />
        </div>
        {isFilterClicked && (
          <div className="dropdown left common-shadow br4">{categoryDivs}</div>
        )}
      </div>
    );
  }
}

export default Filter;
