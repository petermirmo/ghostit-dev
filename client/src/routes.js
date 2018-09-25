import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts } from "./redux/actions/";

import LoaderWedge from "./components/Notifications/LoaderWedge";

import Header from "./components/Navigations/Header/";

import LoginPage from "./pages/LoginPage/";
import Subscribe from "./pages/SubscribePage/";
import Content from "./pages/ContentPage/";
import Strategy from "./pages/StrategyPage/";
import Accounts from "./pages/AccountsPage/";
import Manage from "./pages/ManagePage/";
import Profile from "./pages/ProfilePage/";
import MySubscription from "./pages/MySubscriptionPage/";
import Analytics from "./pages/AnalyticsPage/";
import WritersBrief from "./pages/WritersBriefPage/";

import "./css/";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };
  constructor(props) {
    super(props);
    axios.get("/api/user").then(res => {
      let { success, user } = res.data;

      if (success) {
        // Get all connected accounts of the user
        axios.get("/api/accounts").then(res => {
          // Set user's accounts to state
          let { accounts } = res.data;
          if (!accounts) accounts = [];
          props.updateAccounts(accounts);
          props.setUser(user);

          this.setState({ datebaseConnection: true });
        });
      } else {
        this.setState({ datebaseConnection: true });
      }
    });
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
  getPage = activePage => {
    if (activePage === "") return <LoginPage />;
    else if (activePage === "subscribe") return <Subscribe />;
    else if (activePage === "content") return <Content />;
    else if (activePage === "strategy") return <Strategy />;
    else if (activePage === "analytics") return <Analytics />;
    else if (activePage === "social-accounts") return <Accounts />;
    else if (activePage === "writers-brief") return <WritersBrief />;
    else if (activePage === "manage") return <Manage />;
    else if (activePage === "profile") return <Profile />;
    else if (activePage === "subscription") return <MySubscription />;
    else return <Content />;
  };
  render() {
    const { datebaseConnection } = this.state;
    const { activePage, user, getKeyListenerFunction } = this.props;

    document.removeEventListener("keydown", getKeyListenerFunction[1], false);
    document.addEventListener("keydown", getKeyListenerFunction[0], false);

    let accessClientButton;
    if (!datebaseConnection) return <LoaderWedge />;

    let page = this.getPage(activePage);

    return (
      <div className="flex">
        {user && <Header />}
        <div className="wrapper">
          {user &&
            ((activePage === "content" ||
              activePage === "strategy" ||
              activePage === "writersBrief" ||
              activePage === "subscribe" ||
              activePage === "accounts") &&
              user.signedInAsUser && (
                <div className="signed-in-as">
                  Logged in as: {user.signedInAsUser.fullName}
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => this.signOutOfUsersAccount()}
                    className="sign-out-of-clients-account"
                  />
                </div>
              ))}

          {page}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activePage: state.activePage,
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage,
      setUser,
      updateAccounts
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
