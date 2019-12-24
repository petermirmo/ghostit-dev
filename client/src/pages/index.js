import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { setUser, setAccounts } from "../redux/actions";

import Consumer, { ExtraContext } from "../context";

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
import LandingPage1 from "../website/LandingPage1";
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
  getAllAccountsFromAllCalendars,
  getCalendars,
  getUser,
  getGhostitBlogs,
  getAccounts,
  getNotifications,
  useAppropriateFunctionForEscapeKey
} from "./util";

import { getCalendarAccounts, getCalendarUsers } from "./Calendar/util";

import { isUserInPlatform } from "../components/containers/Page/util";

import { getAccountAnalytics } from "./Analytics/util";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };

  componentDidMount() {
    const { context } = this;
    const { location } = this.props; // Variables

    this.getUserDataAndCheckAuthorization();
    getNotifications(context.handleChange);
    getCalendars(stateObject => {
      context.handleChange(stateObject, () => {
        getCalendarAccounts(
          stateObject.activeCalendarIndex,
          stateObject.calendars,
          context.handleCalendarChange
        );
        getCalendarUsers(
          stateObject.activeCalendarIndex,
          stateObject.calendars,
          context.handleCalendarChange
        );
      });
    });
    getAllAccountsFromAllCalendars(allAccounts => {
      context.handleChange({ allAccounts });
    });

    getGhostitBlogs(ghostitBlogs => {
      context.handleChange({ ghostitBlogs });
    });
  }
  getUserDataAndCheckAuthorization = () => {
    const { setUser, setAccounts } = this.props; // Functions
    const { location, history } = this.props; // Variables
    const { context } = this;

    getUser((signedInAsUser, user) => {
      if (user) {
        if (signedInAsUser) context.handleChange({ signedInAsUser });
        context.handleChange({ user });
        setUser(user);
        getAccounts(accounts => {
          this.setState({ datebaseConnection: true });
          setAccounts(accounts);
        });
      } else if (isUserInPlatform(location.pathname)) {
        history.push("/sign-in");
        this.setState({ datebaseConnection: true });
      } else this.setState({ datebaseConnection: true });
    });
  };

  createBlogPages = ghostitBlogs => {
    return ghostitBlogs.map((ghostitBlog, index) => (
      <Route
        path={"/blog/" + ghostitBlog.url + "/"}
        key={index}
        render={props => (
          <ViewWebsiteBlog
            contentArray={ghostitBlog.contentArray}
            featuredBlogs={ghostitBlogs.slice(0, 3)}
            id={ghostitBlog._id}
            images={ghostitBlog.images}
          />
        )}
      />
    ));
  };

  render() {
    const { datebaseConnection } = this.state;
    const { getKeyListenerFunction, ghostitBlogs = [] } = this.props; // Variables
    const { location, user } = this.props; // Functions
    const { calendars } = this.context;

    useAppropriateFunctionForEscapeKey(getKeyListenerFunction);

    if (!datebaseConnection) return <LoaderWedge />;
    if (isUserInPlatform(location.pathname) && calendars.length === 0)
      return <LoaderWedge />;

    return (
      <Consumer>
        {context => (
          <GIContainer>
            <Switch>
              <Route path="/dashboard/" component={DashboardPage} />
              <Route path="/calendar/" component={CalendarPage} />
              <Route path="/subscribe/" component={SubscribePage} />
              <Route path="/analytics/" component={AnalyticsPage} />
              <Route path="/social-accounts/" component={AccountsPage} />
              <Route path="/manage/:id" component={ManagePage} />
              <Route path="/manage" component={ManagePage} exact />
              <Route path="/profile/" component={ProfilePage} />
              <Route path="/subscription/" component={MySubscriptionPage} />

              <Route path="/home/" component={HomePage} />
              <Route path="/landing-page/" component={LandingPage1} />
              <Route path="/pricing/" component={PricingPage} />
              <Route path="/team/" component={TeamPage} />
              <Route path="/blog/" component={BlogPage} exact />
              <Route path="/agency/" component={GhostitAgencyPage} />
              <Route path="/sign-in/" component={LoginPage} />
              <Route path="/sign-up/" component={RegisterPage} />
              <Route path="/forgot-password/" component={ForgotPasswordPage} />

              <Route path="/terms-of-service/" component={TermsPage} />
              <Route path="/privacy-policy/" component={PrivacyPage} />
              {this.createBlogPages(context.ghostitBlogs)}
              <Route component={HomePage} />
            </Switch>
          </GIContainer>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

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
      setAccounts
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
