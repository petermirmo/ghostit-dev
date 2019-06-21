import React, { Component } from "react";
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
  isStillLoading,
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
    return ghostitBlogs.map((ghostitBlog, index) => {
      return (
        <Route
          path={"/blog/" + ghostitBlog.url + "/"}
          key={index}
          render={props => {
            return (
              <ViewWebsiteBlog
                contentArray={ghostitBlog.contentArray}
                images={ghostitBlog.images}
              />
            );
          }}
        />
      );
    });
  };
  render() {
    const { datebaseConnection, ghostitBlogs = [] } = this.state;
    const { getKeyListenerFunction } = this.props; // Variables
    const { user } = this.props; // Functions

    const blogPages = this.createBlogPages(ghostitBlogs);

    useAppropriateFunctionForEscapeKey(getKeyListenerFunction);

    if (!datebaseConnection && process.env.NODE_ENV !== "development")
      return <LoaderWedge />;

    return (
      <GIContainer className="main-wrapper">
        <Switch>
          <Route
            path="/dashboard/"
            component={isStillLoading(DashboardPage, user)}
          />
          <Route
            path="/calendar/"
            component={isStillLoading(CalendarPage, user)}
          />
          <Route
            path="/subscribe/"
            component={isStillLoading(SubscribePage, user)}
          />
          <Route
            path="/analytics/"
            component={isStillLoading(AnalyticsPage, user)}
          />
          <Route
            path="/social-accounts/"
            component={isStillLoading(AccountsPage, user)}
          />
          <Route
            path="/manage/:id"
            component={isStillLoading(ManagePage, user)}
          />
          <Route
            path="/manage"
            component={isStillLoading(ManagePage, user)}
            exact
          />
          <Route
            path="/profile/"
            component={isStillLoading(ProfilePage, user)}
          />
          <Route
            path="/subscription/"
            component={isStillLoading(MySubscriptionPage)}
          />

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
