import React, { Component } from "react";
import "./style.css";

class NavBar extends Component {
  render() {
    const { categories } = this.props;
    let categoryDivs = [];
    for (let index in categories) {
      if (!index) break;
      let className =
        "nagivation-option common-transition white flex hc vc py8 px32 mx16 br4";
      if (categories[index]) className += " active";
      categoryDivs.push(
        <button
          key={index}
          onClick={this.props.updateParentState}
          className={className}
          id={index}
        >
          {index}
        </button>
      );
    }
    return <div className="navigation-container flex hc">{categoryDivs}</div>;
  }
}

export default NavBar;
