import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { setUser, setAccounts } from "../redux/actions";

import Consumer, { ExtraContext } from "../context";

import LoaderWedge from "../components/notifications/LoaderWedge";
import GIContainer from "../components/containers/GIContainer";
import Loadable from 'react-loadable';

const DashboardPage =  Loadable({
  loader: () => import("./Dashboard"),
  loading: LoaderWedge,
});
const CalendarPage =  Loadable({
  loader: () => import("./Calendar"),
  loading: LoaderWedge,
});
const AccountsPage =  Loadable({
  loader: () => import("./Accounts"),
  loading: LoaderWedge,
});
const ManagePage =  Loadable({
  loader: () => import("./Manage"),
  loading: LoaderWedge,
});
const ProfilePage =  Loadable({
  loader: () => import("./Profile"),
  loading: LoaderWedge,
});
const MySubscriptionPage =  Loadable({
  loader: () => import("./MySubscription"),
  loading: LoaderWedge,
});
const AnalyticsPage =  Loadable({
  loader: () => import("./Analytics"),
  loading: LoaderWedge,
});
const SubscribePage =  Loadable({
  loader: () => import("./Subscribe"),
  loading: LoaderWedge,
});
const ViewWebsiteBlog =  Loadable({
  loader: () => import("../components/ghostitBlog/ViewGhostitBlog"),
  loading: LoaderWedge,
});

const HomePage =  Loadable({
  loader: () => import("../website/HomePage"),
  loading: LoaderWedge,
});
const PricingPage =  Loadable({
  loader: () => import("../website/PricingPage"),
  loading: LoaderWedge,
});
const TeamPage =  Loadable({
  loader: () => import("../website/TeamPage"),
  loading: LoaderWedge,
});
const BlogPage =  Loadable({
  loader: () => import("../website/BlogPage"),
  loading: LoaderWedge,
});
const GhostitAgencyPage =  Loadable({
  loader: () => import("../website/GhostitAgencyPage"),
  loading: LoaderWedge,
});
const PrivacyPage =  Loadable({
  loader: () => import("../website/PrivacyPage"),
  loading: LoaderWedge,
});
const LoginPage =  Loadable({
  loader: () => import("../website/LoginPage"),
  loading: LoaderWedge,
});
const RegisterPage =  Loadable({
  loader: () => import("../website/RegisterPage"),
  loading: LoaderWedge,
});
const ForgotPasswordPage =  Loadable({
  loader: () => import("../website/ForgotPasswordPage"),
  loading: LoaderWedge,
});
const TermsPage =  Loadable({
  loader: () => import("../website/TermsPage"),
  loading: LoaderWedge,
});

import {
  getCalendars,
  getUser,
  getGhostitBlogs,
  getAccounts,
  getNotifications,
  useAppropriateFunctionForEscapeKey
} from "./util";

import { getCalendarAccounts, getCalendarUsers } from "./Calendar/util";

import { isUserInPlatform } from "../components/containers/Page/util";

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
        getCalendarAccounts(this.context);
        getCalendarUsers(this.context);
      });
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
