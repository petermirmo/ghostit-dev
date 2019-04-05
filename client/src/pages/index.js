import React, { Component } from "react";
import moment from "moment-timezone";
import { Route, Switch, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { setUser, setaccounts } from "../redux/actions";

import LoaderWedge from "../components/notifications/LoaderWedge";
import GIContainer from "../components/containers/GIContainer";

import DashboardPage from "./Dashboard";
import CalendarPage from "./Calendar";
import AccountsPage from "./Accounts";
import ManagePage from "./Manage";
import ProfilePage from "./Profile";
import MySubscriptionPage from "./MySubscription";
import AnalyticsPage from "./Analytics";
import SubscribePage from "./Subscribe";
import ViewWebsiteBlog from "../components/ghostitBlog/ViewGhostitBlog";

import HomePage from "../website/HomePage";
import PricingPage from "../website/PricingPage";
import TeamPage from "../website/TeamPage";
import BlogPage from "../website/BlogPage";
import GhostitAgencyPage from "../website/GhostitAgencyPage";
import LoginPage from "../website/LoginPage";
import RegisterPage from "../website/RegisterPage";
import ForgotPasswordPage from "../website/ForgotPasswordPage";
import TermsPage from "../website/TermsPage";
import PrivacyPage from "../website/PrivacyPage";

import {
  getUser,
  getBlogs,
  getAccounts,
  useAppropriateFunctionForEscapeKey
} from "./util";

import { isUserInPlatform } from "../components/containers/Page/util";

class Routes extends Component {
  state = {
    datebaseConnection: false,
    ghostitBlogs: []
  };

  componentDidMount() {
    this.getUserDataAndCheckAuthorization();

    getBlogs(ghostitBlogs => this.setState({ ghostitBlogs, loading: false }));
  }
  getUserDataAndCheckAuthorization = () => {
    const { setUser, setaccounts } = this.props; // Functions
    const { location, history } = this.props; // Variables

    getUser(user => {
      if (user) {
        setUser(user);
        getAccounts(accounts => {
          this.setState({ datebaseConnection: true });
          setaccounts(accounts);
        });
      } else if (isUserInPlatform(location.pathname)) {
        history.push("/sign-in");
        this.setState({ datebaseConnection: true });
      } else {
        this.setState({ datebaseConnection: true });
      }
    });
  };

  createBlogPages = ghostitBlogs => {
    ghostitBlogs.map((obj, index) => {
      return (
        <Route
          path={"/blog/" + obj.url + "/"}
          key={index}
          render={props => {
            return (
              <ViewWebsiteBlog
                contentArray={obj.contentArray}
                images={obj.images}
              />
            );
          }}
        />
      );
    });
  };
  render() {
    const { datebaseConnection, ghostitBlogs } = this.state; // Variables
    const { getKeyListenerFunction, location } = this.props; // Variables

    const blogPages = this.createBlogPages(ghostitBlogs);

    useAppropriateFunctionForEscapeKey(getKeyListenerFunction);

    if (!datebaseConnection) return <LoaderWedge />;

    return (
      <GIContainer className="main-wrapper">
        <Switch>
          <Route path="/dashboard/" component={DashboardPage} />
          <Route path="/calendar/" component={CalendarPage} />
          <Route path="/subscribe/" component={SubscribePage} />
          <Route path="/analytics/" component={AnalyticsPage} />
          <Route path="/social-accounts/" component={AccountsPage} />
          <Route path="/manage/:id" component={ManagePage} />
          <Route path="/manage" component={ManagePage} />
          <Route path="/profile/" component={ProfilePage} />
          <Route path="/subscription/" component={MySubscriptionPage} />

          <Route path="/home/" component={HomePage} />
          <Route path="/pricing/" component={PricingPage} />
          <Route path="/team/" component={TeamPage} />
          <Route path="/blog/" component={BlogPage} exact />
          <Route path="/agency/" component={GhostitAgencyPage} />
          <Route path="/sign-in/" component={LoginPage} />
          <Route path="/sign-up/" component={RegisterPage} />
          <Route path="/forgot-password/" component={ForgotPasswordPage} />

          <Route path="/terms-of-service/" component={TermsPage} />
          <Route path="/privacy-policy/" component={PrivacyPage} />
          {blogPages}
          <Route component={HomePage} />
        </Switch>
      </GIContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction,
    accounts: state.accounts
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
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Routes)
);
