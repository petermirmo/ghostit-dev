import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faAd,
  faUsers,
  faBars,
  faChartLine,
  faHistory,
  faStar,
  faTimes,
  faPlus,
  faCogs,
  faFileAlt,
  faDoorOpen,
  faCalendar,
  faUser,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setUser,
  updateAccounts,
  openClientSideBar,
  openHeaderSideBar,
  setTutorial
} from "../../../redux/actions/";

import ClientsSideBar from "../../SideBarClients/";
import Tutorial from "../../Tutorial/";
import "./styles/";

class HeaderSideBar extends Component {
  signOutOfUsersAccount = () => {
    axios.get("/api/signOutOfUserAccount").then(res => {
      let { success, loggedIn, user } = res.data;
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
      let { success, loggedIn } = res.data;
      if (success) {
        this.props.setUser(null);
        this.props.updateAccounts([]);
        this.props.history.push("/sign-in");
      } else {
        window.location.reload();
      }
    });
  };
  isActive = () => {
    return false;
  };
  render() {
    const { user, headerSideBar, clientSideBar, tutorial } = this.props;

    if (!user) {
      return <div style={{ display: "none" }} />;
    }

    let isAdmin = user.role === "admin";
    let isManager = user.role === "manager";

    return (
      <div className="header-navbar">
        <div className="header-stationary-column pa8">
          <FontAwesomeIcon
            icon={faBars}
            size="2x"
            className="button transparent common-transition pb8"
            onClick={() => {
              this.props.openHeaderSideBar(!headerSideBar);
              this.props.openClientSideBar(false);
            }}
          />

          {(isAdmin || isManager) && (
            <FontAwesomeIcon
              icon={faUsers}
              size="2x"
              className="button transparent common-transition pb8"
              onClick={() => {
                this.props.openHeaderSideBar(false);
                this.props.openClientSideBar(!clientSideBar);
              }}
            />
          )}
        </div>

        {headerSideBar && !clientSideBar && (
          <div className="navbar pa16 flex column">
            {(user.role === "demo" || isAdmin) && (
              <Link to="/subscribe">
                <button
                  className={
                    "header-button mb16 button" + this.isActive("subscribe")
                  }
                >
                  <FontAwesomeIcon icon={faStar} className="test2" />
                  <p className="test">Upgrade to Plan</p>
                </button>
              </Link>
            )}
            <Link to="/content">
              <button
                className={"header-button mb16 " + this.isActive("content")}
              >
                <FontAwesomeIcon icon={faCalendar} />
                Calendar
                {tutorial.on && tutorial.value === 3 && (
                  <Tutorial
                    title="Tutorial"
                    message="Click 'Calendar' in the sidebar to go to our main screen, the calendar!"
                    position="right"
                  />
                )}
              </button>
            </Link>
            {isAdmin && (
              <Link to="/analytics">
                <button
                  className={
                    "header-button mb16  " + this.isActive("analytics")
                  }
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  Analytics
                </button>
              </Link>
            )}
            {isAdmin && false && (
              <Link to="/ads">
                <button
                  className={"header-button mb16  " + this.isActive("ads")}
                >
                  <FontAwesomeIcon icon={faAd} />
                  Create an Ad
                </button>
              </Link>
            )}
            <Link to="/social-accounts">
              <button
                className={
                  "header-button mb16 " + this.isActive("social-accounts")
                }
              >
                <FontAwesomeIcon icon={faPlus} />
                Social Profiles
                {tutorial.on && tutorial.value === 0 && (
                  <Tutorial
                    title="Tutorial"
                    message="Click 'Social Profiles' in the sidebar to connect your first social media profile!"
                    position="right"
                  />
                )}
              </button>
            </Link>
            {isAdmin && (
              <Link to="/manage">
                <button
                  className={"header-button mb16  " + this.isActive("manage")}
                >
                  <FontAwesomeIcon icon={faCogs} />
                  Manage
                </button>
              </Link>
            )}
            <Link to="/profile">
              <button
                className={"header-button mb16 " + this.isActive("profile")}
              >
                <FontAwesomeIcon icon={faUser} />
                Profile
              </button>
            </Link>
            {(user.role === "client" || isAdmin) && (
              <Link to="/subscription">
                <button
                  className={
                    "header-button mb16 " + this.isActive("subscription")
                  }
                >
                  <FontAwesomeIcon icon={faHistory} />
                  Billing History
                </button>
              </Link>
            )}
            <Link to="/sign-in">
              <button
                className="header-button mb16 "
                onClick={() => this.logout()}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </Link>
            {(isAdmin || isManager) && false && (
              <Link to="/writers-brief">
                <button
                  className={
                    "header-button mb16 " + this.isActive("writers-brief")
                  }
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  Monthly Strategy
                </button>
              </Link>
            )}
            {(isAdmin || isManager) && false && (
              <Link to="/strategy">
                <button
                  className={"header-button mb16 " + this.isActive("strategy")}
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  Your Questionnaire
                </button>
              </Link>
            )}
          </div>
        )}
        {clientSideBar && <ClientsSideBar />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    clientSideBar: state.clientSideBar,
    headerSideBar: state.headerSideBar,
    tutorial: state.tutorial
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser,
      updateAccounts,
      openHeaderSideBar,
      openClientSideBar,
      setTutorial
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
