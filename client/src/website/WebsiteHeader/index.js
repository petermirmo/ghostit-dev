import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage } from "../../redux/actions/";

import "./style.css";

class WebsiteHeader extends Component {
  render() {
    const { activePage, changePage } = this.props;
    let className = "website-header-button moving-border px32";
    return (
      <div className="website-header fixed flex pt16 px32">
        <button
          className={
            activePage === "home" || activePage === ""
              ? className + " active"
              : className
          }
          onClick={() => changePage("home")}
        >
          Home
        </button>
        <button
          className={activePage === "team" ? className + " active" : className}
          onClick={() => changePage("team")}
        >
          Team
        </button>
        <button
          className={
            activePage === "pricing" ? className + " active" : className
          }
          onClick={() => changePage("pricing")}
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

function mapStateToProps(state) {
  return {
    activePage: state.activePage
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebsiteHeader);
