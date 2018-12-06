import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import moment from "moment-timezone";
import { Route, withRouter, Switch } from "react-router-dom";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import {
  setUser,
  updateAccounts,
  setTutorial,
  openHeaderSideBar
} from "../redux/actions/";

import LoaderWedge from "../components/Notifications/LoaderWedge";

import Header from "../components/Navigations/Header/";

import Subscribe from "./SubscribePage/";
import Content from "./ContentPage/";
import Strategy from "./StrategyPage/";
import Accounts from "./AccountsPage/";
import Manage from "./ManagePage/";
import Profile from "./ProfilePage/";
import MySubscription from "./MySubscriptionPage/";
import Analytics from "./AnalyticsPage/";
import WritersBrief from "./WritersBriefPage/";
import Ads from "./AdsPage/";

import WebsiteHeader from "../website/WebsiteHeader";
import HomePage from "../website/HomePage";
import PricingPage from "../website/PricingPage";
import TeamPage from "../website/TeamPage";
import BlogPage from "../website/BlogPage";
import GhostitAgency from "../website/GhostitAgency";
import LoginPage from "../website/LoginPage";

import "./style.css";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };
  constructor(props) {
    super(props);
    axios.get("/api/user").then(res => {
      let { success, user } = res.data;

      if (user) {
        // Get all connected accounts of the user
        axios.get("/api/accounts").then(res => {
          // Set user's accounts to state
          let { accounts } = res.data;

          if (!accounts) accounts = [];
          props.setUser(user);
          props.updateAccounts(accounts);
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
      } else this.setState({ datebaseConnection: true });
    });
  }
  signOutOfUsersAccount = () => {
    axios.get("/api/signOutOfUserAccount").then(res => {
      let { success, loggedIn, user } = res.data;
      if (success) window.location.reload();
      else this.props.history.push("/sign-in");
    });
  };
  userIsInPlatform = activePage => {
    if (
      activePage === "/content" ||
      activePage === "/subscribe" ||
      activePage === "/strategy" ||
      activePage === "/analytics" ||
      activePage === "/social-accounts" ||
      activePage === "/writers-brief" ||
      activePage === "/manage" ||
      activePage === "/profile" ||
      activePage === "/subscription" ||
      activePage === "/ads"
    )
      return true;
    else return false;
  };
  render() {
    const { datebaseConnection } = this.state;
    const { user, getKeyListenerFunction } = this.props;

    document.removeEventListener("keydown", getKeyListenerFunction[1], false);
    document.addEventListener("keydown", getKeyListenerFunction[0], false);

    let accessClientButton;
    if (!datebaseConnection) return <LoaderWedge />;

    let activePage = "hello";

    return (
      <div className="flex">
        {this.userIsInPlatform(this.props.location.pathname) && <Header />}

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
          {!this.userIsInPlatform(this.props.location.pathname) && (
            <WebsiteHeader />
          )}
          <Switch>
            <Route path="/content/" component={Content} />
            <Route path="/subscribe/" component={Subscribe} />
            <Route path="/strategy/" component={Strategy} />
            <Route path="/analytics/" component={Analytics} />
            <Route path="/social-accounts/" component={Accounts} />
            <Route path="/writers-brief/" component={WritersBrief} />
            <Route path="/manage/" component={Manage} />
            <Route path="/profile/" component={Profile} />
            <Route path="/subscription/" component={MySubscription} />
            <Route path="/ads/" component={Ads} />

            <Route path="/home/" component={HomePage} />
            <Route path="/pricing/" component={PricingPage} />
            <Route path="/team/" component={TeamPage} />
            <Route path="/blog/" component={BlogPage} />
            <Route path="/agency/" component={GhostitAgency} />
            <Route path="/sign-in/" component={LoginPage} />
            <Route
              path="/sign-up/"
              render={props => {
                return <LoginPage signUp={true} />;
              }}
            />
            <Route component={HomePage} />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction,
    tutorial: state.tutorial,
    accounts: state.accounts
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser,
      updateAccounts,
      setTutorial,
      openHeaderSideBar
    },
    dispatch
  );
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Routes)
);
