import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons/faThLarge";
import { faChartLine } from "@fortawesome/free-solid-svg-icons/faChartLine";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faCogs } from "@fortawesome/free-solid-svg-icons/faCogs";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../../redux/actions/";

import Consumer, { ExtraContext } from "../../../context";

import SideBarClients from "../../SideBarClients/";
import FileUpload from "../../views/FileUpload/";

import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { saveUser } from "../../../pages/Profile/util";

import "./style.css";

class HeaderSideBar extends Component {
  signOutOfUsersAccount = () => {
    axios.get("/api/signOutOfUserAccount").then((res) => {
      const { success, loggedIn, user } = res.data;
      const { context } = this;
      if (success) {
        context.handleChange({ user });
        this.props.setUser(user);
        window.location.reload();
      } else {
        if (loggedIn === false) this.props.history.push("/sign-in");
      }
    });
  };

  isActive = (activePage) => {
    if ("/" + activePage === this.props.location.pathname) return " active";
  };
  render() {
    const { user } = this.props;
    const { context } = this;

    if (!user) {
      return <div style={{ display: "none" }} />;
    }

    const isAdmin = user.role === "admin";
    const isManager = user.role === "manager";

    return (
      <GIContainer className="header-navbar mr16">
        <GIContainer className="column">
          {(isAdmin || isManager) && (
            <GIContainer
              className="header-button"
              onClick={() =>
                context.handleChange({
                  clientSideBar: !context.clientSideBar,
                })
              }
            >
              <FontAwesomeIcon icon={faUsers} />
              <p>Client</p>
              <p>Accounts</p>
            </GIContainer>
          )}

          <Link
            className={"header-button " + this.isActive("dashboard")}
            to="/dashboard"
          >
            <FontAwesomeIcon icon={faThLarge} />
            <p>Dashboard</p>
          </Link>
          <Link
            className={"header-button " + this.isActive("calendar")}
            to="/calendar"
          >
            <FontAwesomeIcon icon={faCalendar} />
            <p>Calendar</p>
          </Link>
          <Link
            className={"header-button " + this.isActive("social-accounts")}
            to="/social-accounts"
          >
            <FontAwesomeIcon icon={faPlus} />
            <p>Social</p>
            <p>Accounts</p>
          </Link>
          {false && (
            <Link
              className={"header-button " + this.isActive("analytics")}
              to="/analytics"
            >
              <FontAwesomeIcon icon={faChartLine} />

              <p>Analytics</p>
            </Link>
          )}
          <Link
            className={"header-button " + this.isActive("profile")}
            to="/profile"
          >
            <FontAwesomeIcon icon={faUser} />
            <p>Profile</p>
          </Link>
          {isAdmin && (
            <Link
              className={"header-button " + this.isActive("manage")}
              to="/manage"
            >
              <FontAwesomeIcon icon={faCogs} />

              <p>Manage</p>
            </Link>
          )}
        </GIContainer>
        {context.clientSideBar && <SideBarClients />}
      </GIContainer>
    );
  }
}
HeaderSideBar.contextType = ExtraContext;

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser,
    },
    dispatch
  );
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderSideBar)
);
