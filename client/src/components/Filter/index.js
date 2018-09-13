import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

import "./styles/";

class Filter extends Component {
  render() {
    const { categories } = this.props; // Variable
    const { updateActiveCategory } = this.props; // Functions
    let categoryDivs = [];
    for (let index in categories) {
      if (!index) break;
      categoryDivs.push(
        <div
          className={categories[index] ? "item active" : "item"}
          key={index}
          onClick={() => updateActiveCategory(index)}
          id={index}
        >
          {index}
        </div>
      );
    }

    return (
      <div className="filter-container">
        <div className="dropdown-title">
          Filter Calendar
          <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: "6px" }} />
        </div>
        <div className="dropdown">{categoryDivs}</div>
      </div>
    );
  }
}

export default Filter;
