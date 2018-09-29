import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import moment from "moment-timezone";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  changePage,
  setUser,
  updateAccounts,
  setTutorial,
  openHeaderSideBar
} from "./redux/actions/";

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
          if (user.role === "demo") {
            let temp = { ...props.tutorial };
            temp.on = true;

            let somethingChanged = false;
            for (let index in temp) {
              if (temp[index] != props.tutorial[index]) somethingChanged = true;
            }
            if (somethingChanged) props.setTutorial(temp);
            props.openHeaderSideBar(true);
          }

          this.setState({ datebaseConnection: true });
        });
      } else {
        if (
          props.activePage &&
          props.activePage != "sign-in" &&
          props.activePage != "sign-up"
        )
          props.changePage("");

        this.setState({ datebaseConnection: true });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    // Hardcoded stuff for product pop up tutorials
    // It is kind of complicated. if(confuzzled) Talk to Peter;
    const { accounts, user, activePage } = nextProps;
    if (user) {
      if (user.role === "demo") {
        let temp = { ...nextProps.tutorial };
        if (activePage === "content") {
          for (let index in accounts) {
            let account = accounts[index];

            if (
              account.socialType === "facebook" &&
              account.accountType === "profile"
            ) {
              if (temp.value < 2) temp.value = 2;
            } else if (temp.value < 4) temp.value = 4;
          }
          if (temp.value < 3) temp.value = 0;
          else if (temp.value === 3) temp.value = 4;
        } else {
          temp.value = 1;

          for (let index in accounts) {
            let account = accounts[index];

            if (
              account.socialType === "facebook" &&
              account.accountType === "profile"
            ) {
              if (temp.value < 2) temp.value = 2;
            } else temp.value = 3;
          }
        }
        let somethingChanged = false;
        for (let index in temp) {
          if (temp[index] != nextProps.tutorial[index]) somethingChanged = true;
        }

        if (somethingChanged) nextProps.setTutorial(temp);
      }
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
  getPage = activePage => {
    if (activePage === "") return <LoginPage />;
    else if (activePage === "sign-up") return <LoginPage signUp={true} />;
    else if (activePage === "sign-in") return <LoginPage />;
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
    const { activePage, user, getKeyListenerFunction, changePage } = this.props;

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
            user.role === "demo" && (
              <div className="trial-days-left flex hc vc pa4">
                {7 - new moment().diff(new moment(user.dateCreated), "days") > 0
                  ? 7 - new moment().diff(new moment(user.dateCreated), "days")
                  : 0}{" "}
                days left in trial
                {activePage !== "subscribe" && (
                  <div
                    className="sign-up-now button pl4"
                    onClick={() => changePage("subscribe")}
                  >
                    Sign Up Now
                  </div>
                )}
              </div>
            )}
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
    getKeyListenerFunction: state.getKeyListenerFunction,
    tutorial: state.tutorial,
    accounts: state.accounts
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage,
      setUser,
      updateAccounts,
      setTutorial,
      openHeaderSideBar
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
