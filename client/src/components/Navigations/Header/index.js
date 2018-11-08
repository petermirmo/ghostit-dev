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

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  changePage,
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
  constructor(props) {
    super(props);

    if (
      (!props.activePage ||
        props.activePage === "sign-in" ||
        props.activePage === "sign-up") &&
      props.user
    ) {
      props.changePage("content");
    }
  }
  signOutOfUsersAccount = () => {
    axios.get("/api/signOutOfUserAccount").then(res => {
      let { success, loggedIn, user } = res.data;
      if (success) {
        this.props.setUser(user);
        window.location.reload();
      } else {
        if (loggedIn === false) window.location.reload();
      }
    });
  };
  isActive = page => {
    switch (this.props.activePage) {
      case page:
        return " active";
      default:
        return "";
    }
  };
  logout = () => {
    axios.get("/api/logout").then(res => {
      let { success, loggedIn } = res.data;
      if (success) {
        this.props.changePage("");
        this.props.updateAccounts([]);
        this.props.setUser(null);
      } else {
        window.location.reload();
      }
    });
  };
  render() {
    const {
      user,
      activePage,
      changePage,
      headerSideBar,
      clientSideBar,
      tutorial
    } = this.props;

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

        {headerSideBar &&
          !clientSideBar && (
            <div className="navbar pa16">
              {(user.role === "demo" || isAdmin) && (
                <div
                  className={"header-button mb16 " + this.isActive("subscribe")}
                  onClick={() => changePage("subscribe")}
                >
                  <FontAwesomeIcon icon={faStar} />
                  Upgrade to Plan
                </div>
              )}
              <div
                className={"header-button mb16 " + this.isActive("content")}
                onClick={() => changePage("content")}
              >
                <FontAwesomeIcon icon={faCalendar} />
                Calendar
                {tutorial.on &&
                  tutorial.value === 3 && (
                    <Tutorial
                      title="Tutorial"
                      message="Click 'Calendar' in the sidebar to go to our main screen, the calendar!"
                      position="right"
                    />
                  )}
              </div>
              {isAdmin && (
                <div
                  className={
                    "header-button mb16  " + this.isActive("analytics")
                  }
                  onClick={() => changePage("analytics")}
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  Analytics
                </div>
              )}
              {isAdmin &&
                false && (
                  <div
                    className={"header-button mb16  " + this.isActive("ads")}
                    onClick={() => changePage("ads")}
                  >
                    <FontAwesomeIcon icon={faAd} />
                    Create an Ad
                  </div>
                )}
              <div
                className={
                  "header-button mb16 " + this.isActive("social-accounts")
                }
                onClick={() => changePage("social-accounts")}
              >
                <FontAwesomeIcon icon={faPlus} />
                Social Profiles
                {tutorial.on &&
                  tutorial.value === 0 && (
                    <Tutorial
                      title="Tutorial"
                      message="Click 'Social Profiles' in the sidebar to connect your first social media profile!"
                      position="right"
                    />
                  )}
              </div>
              {isAdmin && (
                <div
                  className={"header-button mb16  " + this.isActive("manage")}
                  onClick={() => changePage("manage")}
                >
                  <FontAwesomeIcon icon={faCogs} />
                  Manage
                </div>
              )}
              <div
                className={"header-button mb16 " + this.isActive("profile")}
                onClick={() => changePage("profile")}
              >
                <FontAwesomeIcon icon={faUser} />
                Profile
              </div>
              {(user.role === "client" || isAdmin) && (
                <div
                  className={
                    "header-button mb16 " + this.isActive("subscription")
                  }
                  onClick={() => changePage("subscription")}
                >
                  <FontAwesomeIcon icon={faHistory} />
                  Billing History
                </div>
              )}
              <div
                className="header-button mb16 "
                onClick={() => this.logout()}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </div>
              {(isAdmin || isManager) &&
                false && (
                  <div
                    className={
                      "header-button mb16 " + this.isActive("writers-brief")
                    }
                    onClick={() => changePage("writers-brief")}
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
                    Monthly Strategy
                  </div>
                )}
              {(isAdmin || isManager) &&
                false && (
                  <div
                    className={
                      "header-button mb16 " + this.isActive("strategy")
                    }
                    onClick={() => changePage("strategy")}
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
                    Your Questionnaire
                  </div>
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
    activePage: state.activePage,
    user: state.user,
    clientSideBar: state.clientSideBar,
    headerSideBar: state.headerSideBar,
    tutorial: state.tutorial
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage,
      setUser,
      updateAccounts,
      openHeaderSideBar,
      openClientSideBar,
      setTutorial
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderSideBar);
