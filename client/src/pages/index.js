import React, { Component } from "react";
import moment from "moment-timezone";
import { Route, withRouter, Switch } from "react-router-dom";
import { SizeMe } from "react-sizeme";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { setUser, setaccounts } from "../redux/actions";

import LoaderWedge from "../components/Notifications/LoaderWedge";
import Container from "../components/Container";
import Header from "../components/Navigations/Header";
import SignedInAs from "../components/SignedInAs";

import Subscribe from "./SubscribePage";
import Content from "./ContentPage";
import Accounts from "./AccountsPage";
import Manage from "./ManagePage";
import Profile from "./ProfilePage";
import MySubscription from "./MySubscriptionPage";
import Analytics from "./AnalyticsPage";
import Ads from "./AdsPage";
import ViewWebsiteBlog from "../components/GhostitBlog/View";

import WebsiteHeader from "../website/WebsiteHeader";
import WebsiteFooter from "../website/WebsiteFooter";
import HomePage from "../website/HomePage";
import PricingPage from "../website/PricingPage";
import TeamPage from "../website/TeamPage";
import BlogPage from "../website/BlogPage";
import GhostitAgency from "../website/GhostitAgency";
import LoginPage from "../website/LoginPage";
import TermsPage from "../website/TermsPage";
import PrivacyPage from "../website/PrivacyPage";

import {
  getUser,
  getBlogs,
  userIsInPlatform,
  getAccounts,
  useAppropriateFunctionForEscapeKey,
  shouldShowSignedInAsDiv
} from "./util";

class Routes extends Component {
  state = {
    datebaseConnection: false,
    ghostitBlogs: [],
    headerWidth: 0
  };
  constructor(props) {
    super(props);

    if (process.env.NODE_ENV !== "development")
      ReactGA.initialize("UA-121236003-1");
  }

  componentDidMount() {
    this.getUserDataAndCheckAuthorization();

    getBlogs(ghostitBlogs => this.setState({ ghostitBlogs, loading: false }));
  }
  getUserDataAndCheckAuthorization = () => {
    const { setUser, setaccounts } = this.props; // Functions
    const { location, history } = this.props; // Variables

    getUser(user => {
      if (user) {
        getAccounts(accounts => {
          this.setState({ datebaseConnection: true });
          setUser(user);
          setaccounts(accounts);
        });
      } else if (userIsInPlatform(location.pathname)) {
        history.push("/sign-in");
        this.setState({ datebaseConnection: true });
      } else {
        this.setState({ datebaseConnection: true });
      }
    });
  };

  onSize = sizeChangeObj => {
    this.setState({ headerWidth: sizeChangeObj.width });
  };
  websiteOrPlatformHeader = activePage => {
    if (!userIsInPlatform(activePage)) return <WebsiteHeader />;
    else return <Header onSize={this.onSize} />;
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
    let { headerWidth } = this.state; // Variables
    const { datebaseConnection, ghostitBlogs } = this.state; // Variables
    const { user, getKeyListenerFunction, location } = this.props; // Variables
    const activePage = location.pathname;

    const blogPages = this.createBlogPages(ghostitBlogs);
    const header = this.websiteOrPlatformHeader(activePage);

    if (!userIsInPlatform(activePage) && process.env.NODE_ENV !== "development")
      ReactGA.pageview(activePage);
    if (!userIsInPlatform(activePage)) headerWidth = 0;

    useAppropriateFunctionForEscapeKey(getKeyListenerFunction);

    if (!datebaseConnection) return <LoaderWedge />;

    return (
      <Container style={{ marginLeft: headerWidth }} className="main-wrapper">
        <Helmet>
          <meta charSet="utf-8" />
          <title>All-In-One Marketing Solution</title>
          <meta
            name="description"
            content="Organize your marketing process with an all-in-one solution for unified content promotion."
          />
        </Helmet>
        {header}
        {shouldShowSignedInAsDiv(user, activePage) && (
          <SignedInAs user={user} />
        )}
        <Switch>
          <Route path="/content/" component={Content} />
          <Route path="/subscribe/" component={Subscribe} />
          <Route path="/analytics/" component={Analytics} />
          <Route path="/social-accounts/" component={Accounts} />
          <Route path="/manage/:id" component={Manage} />
          <Route path="/manage" component={Manage} />
          <Route path="/profile/" component={Profile} />
          <Route path="/subscription/" component={MySubscription} />
          <Route path="/ads/" component={Ads} />

          <Route path="/home/" component={HomePage} />
          <Route path="/pricing/" component={PricingPage} />
          <Route path="/team/" component={TeamPage} />
          <Route path="/blog/" component={BlogPage} exact />
          <Route path="/agency/" component={GhostitAgency} />
          <Route path="/sign-in/" component={LoginPage} />
          <Route
            path="/sign-up/"
            render={props => {
              return <LoginPage signUp={true} />;
            }}
          />
          <Route path="/terms-of-service/" component={TermsPage} />
          <Route path="/privacy-policy/" component={PrivacyPage} />
          {blogPages}
          <Route component={HomePage} />
        </Switch>
        {!userIsInPlatform(activePage) && <WebsiteFooter />}
      </Container>
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
