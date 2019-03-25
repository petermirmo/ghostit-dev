import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBars,
  faThLarge,
  faAngleRight,
  faAngleLeft
} from "@fortawesome/free-solid-svg-icons";
import { Link, withRouter } from "react-router-dom";
import sizeMe from "react-sizeme";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setUser,
  setaccounts,
  openContentModal,
  openCampaignModal,
  openCalendarManagerModal
} from "../../../redux/actions/";

import SideBarClients from "../../SideBarClients/";
import ImagesDiv from "../../ImagesDiv/";

import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import "./style.css";

class HeaderSideBar extends Component {
  state = {
    headerSideBar: true,
    clientSideBar: false,
    images: [],
    pushToImageDeleteArray: []
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

  logout = () => {
    axios.get("/api/logout").then(res => {
      let { success, loggedIn } = res.data;

      if (success) {
        this.props.setUser(null);
        this.props.setaccounts([]);
      } else {
        window.location.reload();
      }
    });
  };
  isActive = activePage => {
    if ("/" + activePage == this.props.location.pathname) return " active";
  };
  render() {
    const { user } = this.props;
    const {
      clientSideBar,
      headerSideBar,
      images,
      pushToImageDeleteArray
    } = this.state;

    if (!user) {
      return <div style={{ display: "none" }} className="mr8" />;
    }

    let isAdmin = user.role === "admin";
    let isManager = user.role === "manager";

    return (
      <div className="header-navbar">
        <GIContainer
          className="absolute-50-over-container"
          style={{
            top: "16px",
            width: "48px",
            height: "48px"
          }}
        >
          <GIButton
            className="absolute-50-over-container-2 round regular-button-colors full-center"
            onClick={() => this.setState({ headerSideBar: !headerSideBar })}
          >
            <FontAwesomeIcon
              size="3x"
              icon={headerSideBar || clientSideBar ? faAngleLeft : faAngleRight}
            />
          </GIButton>
        </GIContainer>
        <div className="navbar pt64" style={{ zIndex: "-1" }}>
          {headerSideBar && !clientSideBar && (
            <GIContainer className="x-fill column">
              <ImagesDiv
                postImages={images}
                handleChange={images => this.handleChange(images, "images")}
                imageLimit={4}
                pushToImageDeleteArray={this.pushToImageDeleteArray}
              />
              {(user.role === "demo" || isAdmin) && (
                <Link to="/subscribe">
                  <div
                    className={
                      "header-button px16 py8 " + this.isActive("subscribe")
                    }
                  >
                    <FontAwesomeIcon icon={faThLarge} className="mr8" />
                    Upgrade to Plan
                  </div>
                </Link>
              )}
              <Link to="/content">
                <div
                  className={
                    this.isActive("content")
                      ? "header-button px16 py8 " + this.isActive("content")
                      : "header-button px16 py8 "
                  }
                >
                  <FontAwesomeIcon icon={faThLarge} className="mr8" />
                  Calendar
                </div>
              </Link>

              {isAdmin && (
                <Link to="/analytics">
                  <div
                    className={
                      "header-button px16 py8 " + this.isActive("analytics")
                    }
                  >
                    <FontAwesomeIcon icon={faThLarge} className="mr8" />
                    Analytics
                  </div>
                </Link>
              )}

              <Link to="/social-accounts">
                <div
                  className={
                    "header-button px16 py8 " + this.isActive("social-accounts")
                  }
                >
                  <FontAwesomeIcon icon={faThLarge} className="mr8" />
                  Social Profiles
                </div>
              </Link>
              {isAdmin && (
                <Link to="/manage">
                  <div
                    className={
                      "header-button px16 py8 " + this.isActive("manage")
                    }
                  >
                    <FontAwesomeIcon icon={faThLarge} className="mr8" />
                    Manage
                  </div>
                </Link>
              )}
              <Link to="/profile">
                <div
                  className={
                    "header-button px16 py8 " + this.isActive("profile")
                  }
                >
                  <FontAwesomeIcon icon={faThLarge} className="mr8" />
                  Profile
                </div>
              </Link>
              {(user.role === "client" || isAdmin) && (
                <Link to="/subscription">
                  <div
                    className={
                      "header-button px16 py8 " + this.isActive("subscription")
                    }
                  >
                    <FontAwesomeIcon icon={faThLarge} className="mr8" />
                    Billing History
                  </div>
                </Link>
              )}
              <Link to="/home">
                <div
                  className="header-button px16 py8 "
                  onClick={() => this.logout()}
                >
                  <FontAwesomeIcon icon={faThLarge} className="mr8" />
                  Logout
                </div>
              </Link>
            </GIContainer>
          )}
        </div>
        {clientSideBar && <SideBarClients />}
      </div>
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
      setaccounts,
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
