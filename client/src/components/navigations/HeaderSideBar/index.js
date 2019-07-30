import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faChartLine,
  faHistory,
  faStar,
  faPlus,
  faCogs,
  faCalendar,
  faUser,
  faUsers,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../../redux/actions/";

import SideBarClients from "../../SideBarClients/";
import FileUpload from "../../views/FileUpload/";

import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import { saveUser } from "../../../pages/Profile/util";
import Consumer from "../../../context";

import "./style.css";

class HeaderSideBar extends Component {
  signOutOfUsersAccount = () => {
    axios.get("/api/signOutOfUserAccount").then(res => {
      const { success, loggedIn, user } = res.data;
      if (success) {
        this.props.setUser(user);
        window.location.reload();
      } else {
        if (loggedIn === false) this.props.history.push("/sign-in");
      }
    });
  };

  isActive = activePage => {
    if ("/" + activePage === this.props.location.pathname) return " active";
  };
  render() {
    const { user } = this.props;

    if (!user) {
      return <div style={{ display: "none" }} />;
    }

    let isAdmin = user.role === "admin";
    let isManager = user.role === "manager";
    /*{(isManager || isAdmin) && (


      {(user.role === "demo" || isAdmin) && (
        <Link
          className={"header-button " + this.isActive("subscribe")}
          to="/subscribe"
        >
          <FontAwesomeIcon icon={faStar} />

          <p>Upgrade</p>
          <p>Plan</p>
        </Link>
      )}
    )}*/

    return (
      <Consumer>
        {context => (
          <GIContainer className="header-navbar mr16">
            <GIContainer className="column">
              <GIContainer
                className="header-button"
                onClick={() =>
                  context.handleChange({
                    clientSideBar: !context.clientSideBar
                  })
                }
              >
                <FontAwesomeIcon icon={faUsers} />
                <p>Client</p>
                <p>Accounts</p>
              </GIContainer>
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

              {isAdmin && (
                <Link
                  className={"header-button " + this.isActive("analytics")}
                  to="/analytics"
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  <p>Analytics</p>
                </Link>
              )}

              <Link
                className={"header-button " + this.isActive("social-accounts")}
                to="/social-accounts"
              >
                <FontAwesomeIcon icon={faPlus} />
                <p>Social</p>
                <p>Accounts</p>
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
              <Link
                className={"header-button " + this.isActive("profile")}
                to="/profile"
              >
                <FontAwesomeIcon icon={faUser} />
                <p>Profile</p>
              </Link>
            </GIContainer>
            {context.clientSideBar && <SideBarClients />}
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser
    },
    dispatch
  );
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderSideBar)
);
