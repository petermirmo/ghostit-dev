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
import TeamMemberPage from "../website/TeamMemberPage";
import BlogPage from "../website/BlogPage";
import GhostitAgencyPage from "../website/GhostitAgencyPage";
import ServiceBlogPage from "../website/GhostitAgencyPage/SEOBlogPosts";
import LoginPage from "../website/LoginPage";
import RegisterPage from "../website/RegisterPage";
import ContactUsPage from "../website/ContactUs";
import ForgotPasswordPage from "../website/ForgotPasswordPage";
import TermsPage from "../website/TermsPage";
import PrivacyPage from "../website/PrivacyPage";
import ThankYouPage from "../website/ThankYou";
import Demo from "../website/Demo";

import Logo from "../components/navigations/WebsiteHeader/Logo";

import {
  getAllAccountsFromAllCalendars,
  getCalendars,
  getUser,
  getAccounts,
  useAppropriateFunctionForEscapeKey
} from "./util";
import { getGhostitBlogs } from "../website/BlogPage/util";

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
      if (ghostitBlogs && ghostitBlogs.length > 0)
        context.handleChange({
          ghostitBlogs: context.ghostitBlogs.concat(ghostitBlogs)
        });
    }, context.ghostitBlogs.length);
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

  render() {
    const { datebaseConnection } = this.state;
    const { getKeyListenerFunction } = this.props; // Variables
    const { location, user } = this.props; // Functions
    const { calendars } = this.context;

    useAppropriateFunctionForEscapeKey(getKeyListenerFunction);

    if (!datebaseConnection && false)
      return (
        <GIContainer className="screen-container full-center pr32">
          <Logo
            displayText={false}
            style={{
              animation: "loading-animation 2s infinite linear",
              width: "10vw",
              minWidth: "115px"
            }}
          />
        </GIContainer>
      );
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
              <Route path="/team/" component={TeamPage} exact />
              <Route path="/blog/" component={BlogPage} exact />
              <Route path="/services/" component={GhostitAgencyPage} />
              <Route path="/seo-blog-posts/" component={ServiceBlogPage} />
              <Route path="/social-media-posts/" component={ServiceBlogPage} />
              <Route path="/paid-advertising/" component={ServiceBlogPage} />
              <Route path="/email-newsletter/" component={ServiceBlogPage} />
              <Route path="/web-content/" component={ServiceBlogPage} />
              <Route
                path="/website-design-and-development/"
                component={ServiceBlogPage}
              />
              <Route
                path="/lead-generation-e-book/"
                component={ServiceBlogPage}
              />

              <Route path="/sign-in/" component={LoginPage} />
              <Route path="/sign-up/" component={RegisterPage} />
              <Route path="/forgot-password/" component={ForgotPasswordPage} />
              <Route path="/contact-us/" component={ContactUsPage} />

              <Route path="/terms-of-service/" component={TermsPage} />
              <Route path="/privacy-policy/" component={PrivacyPage} />
              <Route path="/team-member/" component={TeamMemberPage} />
              <Route path="/blog/" component={ViewWebsiteBlog} />
              <Route path="/thank-you/" component={ThankYouPage} />
              <Route path="/demo/" component={Demo} />
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
