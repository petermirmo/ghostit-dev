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
import sizeMe from "react-sizeme";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser, setaccounts } from "../../../redux/actions/";

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

  logout = () => {
    axios.get("/api/logout").then(res => {
      const { success } = res.data;

      if (success) {
        this.props.setUser(null);
        this.props.setaccounts([]);
      } else {
        window.location.reload();
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

    return (
      <Consumer>
        {context => (
          <GIContainer className="header-navbar">
            <GIContainer className="navbar pt16" style={{ zIndex: "-1" }}>
              {context.headerSideBar && !context.clientSideBar && (
                <GIContainer className="x-fill column">
                  {(isManager || isAdmin) && (
                    <GIContainer
                      className="header-button"
                      onClick={() =>
                        context.handleChange({
                          clientSideBar: true,
                          headerSideBar: false
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faUsers} />
                      Client Accounts
                    </GIContainer>
                  )}
                  {(user.role === "demo" || isAdmin) && (
                    <Link
                      className={"header-button " + this.isActive("subscribe")}
                      to="/subscribe"
                    >
                      <FontAwesomeIcon icon={faStar} />
                      Upgrade Plan
                    </Link>
                  )}
                  <Link
                    className={"header-button " + this.isActive("dashboard")}
                    to="/dashboard"
                  >
                    <FontAwesomeIcon icon={faThLarge} />
                    Dashboard
                  </Link>
                  <Link
                    className={"header-button " + this.isActive("calendar")}
                    to="/calendar"
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                    Calendar
                  </Link>

                  {isAdmin && (
                    <Link
                      className={"header-button " + this.isActive("analytics")}
                      to="/analytics"
                    >
                      <FontAwesomeIcon icon={faChartLine} />
                      Analytics
                    </Link>
                  )}

                  <Link
                    className={
                      "header-button " + this.isActive("social-accounts")
                    }
                    to="/social-accounts"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Social Accounts
                  </Link>
                  {isAdmin && (
                    <Link
                      className={"header-button " + this.isActive("manage")}
                      to="/manage"
                    >
                      <FontAwesomeIcon icon={faCogs} />
                      Manage
                    </Link>
                  )}
                  <Link
                    className={"header-button " + this.isActive("profile")}
                    to="/profile"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </Link>
                  {(user.role === "client" || isAdmin) && (
                    <Link
                      className={
                        "header-button " + this.isActive("subscription")
                      }
                      to="/subscription"
                    >
                      <FontAwesomeIcon icon={faHistory} />
                      Billing History
                    </Link>
                  )}
                </GIContainer>
              )}
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
      setUser,
      setaccounts
    },
    dispatch
  );
}
export default sizeMe()(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(HeaderSideBar)
  )
);
