import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setUser,
  updateAccounts,
  openClientSideBar
} from "../../redux/actions/";

import SearchColumn from "../SearchColumn/";
import "./styles/";

class Tutorial extends Component {
  state = {
    showTutorial: true
  };
  render() {
    const { title, message, position } = this.props;
    const { showTutorial } = this.state;
    if (!showTutorial) return <div style={{ display: "none" }} />;

    let styles;
    if (position === "right") {
      styles = {
        left: "115%",
        top: "0"
      };
    } else if (position === "bottom") {
      styles = {
        left: "0",
        top: "calc(100% + 10px)"
      };
    } else if (position === "center") {
      styles = {
        left: "40%",
        top: "40%"
      };
    }
    return (
      <div className="tutorial-container pa16 common-shadow mb4" style={styles}>
        <div className="close-container" title={"Close this pop up"}>
          <FontAwesomeIcon
            className="close-special"
            icon={faTimes}
            onClick={e => {
              e.stopPropagation();
              this.setState({ showTutorial: false });
            }}
          />
        </div>
        <div className="tutorial-title">{title}</div>
        <div className="tutorial-message">{message} </div>
      </div>
    );
  }
}
export default Tutorial;
