import React, { Component } from "react";
import moment from "moment-timezone";
import { Route, Switch } from "react-router-dom";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { setUser, setaccounts } from "../redux/actions";

import LoaderWedge from "../components/notifications/LoaderWedge";
import CommonContainer from "../components/containers/CommonContainer";

import Subscribe from "./SubscribePage";
import Content from "./ContentPage";
import Accounts from "./AccountsPage";
import Manage from "./ManagePage";
import Profile from "./ProfilePage";
import MySubscription from "./MySubscriptionPage";
import Analytics from "./AnalyticsPage";
import Ads from "./AdsPage";
import ViewWebsiteBlog from "../components/ghostitBlog/ViewGhostitBlog";

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
  getAccounts,
  useAppropriateFunctionForEscapeKey
} from "./util";

class Routes extends Component {
  state = {
    datebaseConnection: true,
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
        getAccounts(accounts => {
          this.setState({ datebaseConnection: true });
          setUser(user);
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
    const { user, getKeyListenerFunction, location } = this.props; // Variables

    const blogPages = this.createBlogPages(ghostitBlogs);

    useAppropriateFunctionForEscapeKey(getKeyListenerFunction);

    if (!datebaseConnection) return <LoaderWedge />;

    return (
      <CommonContainer className="main-wrapper">
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
      </CommonContainer>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
