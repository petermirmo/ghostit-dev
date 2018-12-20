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
import sizeMe from "react-sizeme";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setUser,
  updateAccounts,
  setTutorial,
  openContentModal,
  openCampaignModal,
  openCalendarManagerModal
} from "../../../redux/actions/";

import ClientsSideBar from "../../SideBarClients/";
import Tutorial from "../../Tutorial/";
import "./style.css";

class HeaderSideBar extends Component {
  state = {
    headerSideBar: false,
    clientSideBar: false
  };
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

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (!this.wrapperRef) return;

    if (this.wrapperRef.contains(event.target)) return;
    else if (this.state.headerSideBar)
      this.setStateMiddleware({ headerSideBar: false, clientSideBar: false });
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  logout = () => {
    axios.get("/api/logout").then(res => {
      let { success, loggedIn } = res.data;

      if (success) {
        this.props.setUser(null);
        this.props.updateAccounts([]);
      } else {
        window.location.reload();
      }
    });
  };
  isActive = activePage => {
    if ("/" + activePage == this.props.location.pathname) return " active";
    else return false;
  };
  setStateMiddleware = state => {
    this.setState(state);
  };
  render() {
    const { user, tutorial } = this.props;
    const { clientSideBar, headerSideBar } = this.state;

    if (!user) {
      return <div style={{ display: "none" }} />;
    }

    let isAdmin = user.role === "admin";
    let isManager = user.role === "manager";

    return (
      <div className="header-navbar" ref={this.setWrapperRef}>
        <div className="header-stationary-column pa8">
          <FontAwesomeIcon
            icon={faBars}
            size="2x"
            className="button transparent common-transition pb8"
            onClick={() =>
              this.setStateMiddleware({
                headerSideBar: !headerSideBar,
                clientSideBar: false
              })
            }
          />

          {(isAdmin || isManager) && (
            <FontAwesomeIcon
              icon={faUsers}
              size="2x"
              className="button transparent common-transition pb8"
              onClick={() =>
                this.setStateMiddleware({
                  clientSideBar: !clientSideBar,
                  headerSideBar: false
                })
              }
            />
          )}
        </div>

        {headerSideBar && !clientSideBar && (
          <div
            className="navbar pa16 animate-from-left-100"
            style={{ zIndex: "-1" }}
          >
            {(user.role === "demo" || isAdmin) && (
              <Link to="/subscribe">
                <div
                  className={"header-button mb16 " + this.isActive("subscribe")}
                >
                  <FontAwesomeIcon icon={faStar} />
                  Upgrade to Plan
                </div>
              </Link>
            )}
            <Link to="/content">
              <div
                className={
                  this.isActive("content")
                    ? "header-button mb8 " + this.isActive("content")
                    : "header-button mb16"
                }
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
              </div>
            </Link>
            {this.isActive("content") && (
              <div className="container-box ml32">
                <button
                  className="bold-hover"
                  onClick={() => {
                    this.setState({ headerSideBar: false });
                    this.props.openContentModal(true);
                  }}
                >
                  Create a Post
                </button>
                <button
                  className="bold-hover mt8"
                  onClick={() => {
                    this.setState({ headerSideBar: false });
                    this.props.openCampaignModal(true);
                  }}
                >
                  Create a Campaign
                </button>
                <button
                  className="bold-hover mt8 mb16"
                  onClick={() => {
                    this.setState({ headerSideBar: false });
                    this.props.openCalendarManagerModal(true);
                  }}
                >
                  Manage Calendars
                </button>
              </div>
            )}
            {isAdmin && (
              <Link to="/analytics">
                <div
                  className={
                    "header-button mb16  " + this.isActive("analytics")
                  }
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  Analytics
                </div>
              </Link>
            )}
            {isAdmin && false && (
              <Link to="/ads">
                <div className={"header-button mb16  " + this.isActive("ads")}>
                  <FontAwesomeIcon icon={faAd} />
                  Ads
                </div>
              </Link>
            )}
            <Link to="/social-accounts">
              <div
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
              </div>
            </Link>
            {isAdmin && (
              <Link to="/manage">
                <div
                  className={"header-button mb16  " + this.isActive("manage")}
                >
                  <FontAwesomeIcon icon={faCogs} />
                  Manage
                </div>
              </Link>
            )}
            <Link to="/profile">
              <div className={"header-button mb16 " + this.isActive("profile")}>
                <FontAwesomeIcon icon={faUser} />
                Profile
              </div>
            </Link>
            {(user.role === "client" || isAdmin) && (
              <Link to="/subscription">
                <div
                  className={
                    "header-button mb16 " + this.isActive("subscription")
                  }
                >
                  <FontAwesomeIcon icon={faHistory} />
                  Billing History
                </div>
              </Link>
            )}
            <Link to="/home">
              <div
                className="header-button mb16 "
                onClick={() => this.logout()}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </div>
            </Link>
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
    tutorial: state.tutorial
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser,
      updateAccounts,
      setTutorial,
      openContentModal,
      openCampaignModal,
      openCalendarManagerModal
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
