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
          className="checkbox-and-writing-container spacing left"
          key={index}
          onClick={() => updateActiveCategory(index)}
          id={index}
        >
          <div
            className="checkbox-box  flex vc hc br4"
            onClick={() =>
              this.handleChange(!sendEmailReminder, "sendEmailReminder")
            }
          >
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
      <div className="filter-container button px16 py8">
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
