import React, { Component } from "react";

import "./style.css";

class WebsiteHeader extends Component {
  render() {
    const { activePage } = this.props;
    let className = "website-header-button moving-border px32";
    return (
      <div className="website-header flex pt16 px32">
        <button
          className={
            activePage === "home" || activePage === ""
              ? className + " active"
              : className
          }
        >
          Home
        </button>
        <button
          className={activePage === "team" ? className + " active" : className}
        >
          Team
        </button>
        <button
          className={
            activePage === "pricing" ? className + " active" : className
          }
        >
          Pricing
        </button>
        <button
          className={activePage === "blog" ? className + " active" : className}
        >
          Blog
        </button>
      </div>
    );
  }
}

export default WebsiteHeader;
