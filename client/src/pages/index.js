import React, { Component } from "react";
import moment from "moment-timezone";
import { Route, Switch, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { setUser, setaccounts } from "../redux/actions";

import LoaderWedge from "../components/notifications/LoaderWedge";
import GIContainer from "../components/containers/GIContainer";

import Subscribe from "./SubscribePage";
import Content from "./ContentPage";
import Accounts from "./AccountsPage";
import Manage from "./ManagePage";
import Profile from "./ProfilePage";
import MySubscription from "./MySubscriptionPage";
import Analytics from "./AnalyticsPage";
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
          <Route path="/content/" component={Content} />
          <Route path="/subscribe/" component={Subscribe} />
          <Route path="/analytics/" component={Analytics} />
          <Route path="/social-accounts/" component={Accounts} />
          <Route path="/manage/:id" component={Manage} />
          <Route path="/manage" component={Manage} />
          <Route path="/profile/" component={Profile} />
          <Route path="/subscription/" component={MySubscription} />

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
