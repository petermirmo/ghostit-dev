import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faAngleRight,
  faAngleLeft,
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
      return <div style={{ display: "none" }} className="mr8" />;
    }

    let isAdmin = user.role === "admin";
    let isManager = user.role === "manager";

    return (
      <Consumer>
        {context => (
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
                onClick={() =>
                  context.handleChange({
                    headerSideBar: !context.headerSideBar,
                    clientSideBar: false
                  })
                }
              >
                <FontAwesomeIcon
                  size="3x"
                  icon={
                    context.headerSideBar || context.clientSideBar
                      ? faAngleLeft
                      : faAngleRight
                  }
                />
              </GIButton>
            </GIContainer>
            <div className="navbar pt16" style={{ zIndex: "-1" }}>
              {context.headerSideBar && !context.clientSideBar && (
                <GIContainer className="x-fill column">
                  <GIContainer className="full-center">
                    <FileUpload
                      canEdit={false}
                      className="profile-image-container medium round"
                      currentFiles={user.image ? [user.image] : []}
                      handleParentChange={parentStateChangeObject =>
                        saveUser(
                          parentStateChangeObject,
                          parentStateChangeObject =>
                            this.setState(parentStateChangeObject)
                        )
                      }
                      fileLimit={1}
                      id="hjq"
                      imageClassName="profile-image medium"
                      imageContainerClassName="profile-image-container medium round"
                      imageOnly={true}
                    />
                  </GIContainer>

                  {(isManager || isAdmin) && (
                    <div
                      className="header-button px16 py8"
                      onClick={() =>
                        context.handleChange({
                          clientSideBar: true,
                          headerSideBar: false
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faUsers} className="mr8" />
                      Client Accounts
                    </div>
                  )}
                  {(user.role === "demo" || isAdmin) && (
                    <Link to="/subscribe">
                      <div
                        className={
                          "header-button px16 py8 " + this.isActive("subscribe")
                        }
                      >
                        <FontAwesomeIcon icon={faStar} className="mr8" />
                        Upgrade Plan
                      </div>
                    </Link>
                  )}
                  <Link to="/dashboard">
                    <div
                      className={
                        this.isActive("dashboard")
                          ? "header-button px16 py8 " +
                            this.isActive("dashboard")
                          : "header-button px16 py8 "
                      }
                    >
                      <FontAwesomeIcon icon={faThLarge} className="mr8" />
                      Dashboard
                    </div>
                  </Link>
                  <Link to="/calendar">
                    <div
                      className={
                        this.isActive("calendar")
                          ? "header-button px16 py8 " +
                            this.isActive("calendar")
                          : "header-button px16 py8 "
                      }
                    >
                      <FontAwesomeIcon icon={faCalendar} className="mr8" />
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
                        <FontAwesomeIcon icon={faChartLine} className="mr8" />
                        Analytics
                      </div>
                    </Link>
                  )}

                  <Link to="/social-accounts">
                    <div
                      className={
                        "header-button px16 py8 " +
                        this.isActive("social-accounts")
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr8" />
                      Social Accounts
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link to="/manage">
                      <div
                        className={
                          "header-button px16 py8 " + this.isActive("manage")
                        }
                      >
                        <FontAwesomeIcon icon={faCogs} className="mr8" />
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
                      <FontAwesomeIcon icon={faUser} className="mr8" />
                      Profile
                    </div>
                  </Link>
                  {(user.role === "client" || isAdmin) && (
                    <Link to="/subscription">
                      <div
                        className={
                          "header-button px16 py8 " +
                          this.isActive("subscription")
                        }
                      >
                        <FontAwesomeIcon icon={faHistory} className="mr8" />
                        Billing History
                      </div>
                    </Link>
                  )}
                  <Link to="/home">
                    <div
                      className="header-button px16 py8 "
                      onClick={() => this.logout()}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr8" />
                      Logout
                    </div>
                  </Link>
                </GIContainer>
              )}
              {!context.headerSideBar && (
                <GIContainer className="x-fill column pt48">
                  {(isManager || isAdmin) && (
                    <div
                      className="header-button px16 py8 justify-center flex"
                      onClick={() =>
                        context.handleChange({
                          clientSideBar: true,
                          headerSideBar: false
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                  )}
                  {(user.role === "demo" || isAdmin) && (
                    <Link to="/subscribe">
                      <div
                        className={
                          "header-button px16 py8 justify-center flex " +
                          this.isActive("subscribe")
                        }
                      >
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                    </Link>
                  )}
                  <Link to="/dashboard">
                    <div
                      className={
                        this.isActive("dashboard")
                          ? "header-button px16 py8 justify-center flex " +
                            this.isActive("dashboard")
                          : "header-button px16 py8 justify-center flex "
                      }
                    >
                      <FontAwesomeIcon icon={faThLarge} />
                    </div>
                  </Link>
                  <Link to="/calendar">
                    <div
                      className={
                        this.isActive("calendar")
                          ? "header-button px16 py8 justify-center flex " +
                            this.isActive("calendar")
                          : "header-button px16 py8 justify-center flex "
                      }
                    >
                      <FontAwesomeIcon icon={faCalendar} />
                    </div>
                  </Link>

                  {isAdmin && (
                    <Link to="/analytics">
                      <div
                        className={
                          "header-button px16 py8 justify-center flex " +
                          this.isActive("analytics")
                        }
                      >
                        <FontAwesomeIcon icon={faChartLine} />
                      </div>
                    </Link>
                  )}

                  <Link to="/social-accounts">
                    <div
                      className={
                        "header-button px16 py8 justify-center flex " +
                        this.isActive("social-accounts")
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link to="/manage">
                      <div
                        className={
                          "header-button px16 py8 justify-center flex " +
                          this.isActive("manage")
                        }
                      >
                        <FontAwesomeIcon icon={faCogs} />
                      </div>
                    </Link>
                  )}
                  <Link to="/profile">
                    <div
                      className={
                        "header-button px16 py8 justify-center flex " +
                        this.isActive("profile")
                      }
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </Link>
                  {(user.role === "client" || isAdmin) && (
                    <Link to="/subscription">
                      <div
                        className={
                          "header-button px16 py8 justify-center flex " +
                          this.isActive("subscription")
                        }
                      >
                        <FontAwesomeIcon icon={faHistory} />
                      </div>
                    </Link>
                  )}
                  <Link to="/home">
                    <div
                      className="header-button px16 py8 justify-center flex"
                      onClick={() => this.logout()}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </div>
                  </Link>
                </GIContainer>
              )}
            </div>
            {context.clientSideBar && <SideBarClients />}
          </div>
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
