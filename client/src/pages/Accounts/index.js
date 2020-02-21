import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {faPlus} from "@fortawesome/pro-solid-svg-icons/faPlus";
import {faTrash} from "@fortawesome/pro-solid-svg-icons/faTrash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setAccounts } from "../../redux/actions";

import { ExtraContext } from "../../context";

import AddPageOrGroupModal from "../../components/AddPagesOrGroupsModal";
import ConfirmAlert from "../../components/notifications/ConfirmAlert";
import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import {
  disconnectAccount,
  getInstagramPages,
  getUserAccounts,
  getFacebookPages,
  getFacebookGroups,
  getLinkedinPages
} from "./util";

import {
  getPostIcon,
  getPostColor,
  getSocialDisplayName
} from "../../componentFunctions";

import "./style.css";

class AccountsPage extends Component {
  state = {
    pageOrGroupArray: [],
    accountType: "",
    socialType: "",
    errorMessage:
      "You either have no accounts to connect or you need to re-authenticate your profile account by re-adding it!",
    addPageOrGroupModal: false,
    accountToDelete: undefined,
    deleteAccount: false
  };
  componentDidMount() {
    this._ismounted = true;

    const { history, location } = this.props; // Variables

    if (
      location.pathname.substring(
        location.pathname.length - 10,
        location.pathname.length
      ) === "/connected"
    ) {
      this.context.notify({ title: "Account Connected!", type: "success" });
      history.push("/social-accounts");
    } else if (
      location.pathname.substring(
        location.pathname.length - 10,
        location.pathname.length
      ) === "/connected"
    ) {
      this.context.notify({
        message: "Please reload the page and try again or contact support.",
        title: "Connection failed",
        type: "danger"
      });
      history.push("/social-accounts");
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  openModal = (socialType, accountType) => {
    this.setState({
      loading: true,
      socialType,
      accountType,
      addPageOrGroupModal: true
    });
    const { errorMessage } = this.state;

    if (socialType === "facebook") {
      if (accountType === "page") {
        getFacebookPages((pageOrGroupArray, errorMessage) =>
          this.setState({ loading: false, pageOrGroupArray, errorMessage })
        );
      } else if (accountType === "group") {
        getFacebookGroups((pageOrGroupArray, errorMessage) =>
          this.setState({ loading: false, pageOrGroupArray, errorMessage })
        );
      }
    } else if (socialType === "linkedin") {
      if (accountType === "page") {
        getLinkedinPages((pageOrGroupArray, errorMessage) =>
          this.setState({ loading: false, pageOrGroupArray, errorMessage })
        );
      }
    } else if (socialType === "instagram") {
      if (accountType === "page") {
        getInstagramPages((pageOrGroupArray, errorMessage) =>
          this.setState({ loading: false, pageOrGroupArray, errorMessage })
        );
      }
    }
  };

  pushNewConnectedAccountDiv = (account, index) => {
    const { socialType } = account;

    return (
      <GIContainer className="x-fill mb8" key={index}>
        <GIContainer className="full-center">
          <FontAwesomeIcon
            icon={getPostIcon(socialType)}
            size="2x"
            color={getPostColor(socialType)}
          />
        </GIContainer>
        <GIContainer className="connected-social column pl8">
          {getSocialDisplayName(account)}
          <br />
          <GIContainer className="connected-social-account">
            {account.accountType.charAt(0).toUpperCase() +
              account.accountType.slice(1)}
          </GIContainer>
        </GIContainer>
        <GIContainer className="full-center">
          <FontAwesomeIcon
            icon={faTrash}
            onClick={event =>
              this.setState({ accountToDelete: account, deleteAccount: true })
            }
            className="button delete"
          />
        </GIContainer>
      </GIContainer>
    );
  };

  render() {
    const {
      accountToDelete,
      accountType,
      addPageOrGroupModal,
      deleteAccount,
      errorMessage,
      loading,
      pageOrGroupArray,
      socialType
    } = this.state;

    const { setAccounts, accounts = [] } = this.props; // Functions
    const { user } = this.props; // Variables

    const connectedFacebookProfileAccountDivs = [];
    const connectedFacebookPageAccountDivs = [];
    const connectedFacebookGroupAccountDivs = [];
    const connectedTwitterAccountDivs = [];
    const connectedLinkedinProfileAccountDivs = [];
    const connectedLinkedinPageAccountDivs = [];
    const connectedInstagramPageAccountDivs = [];

    accounts.map((account, index) => {
      if (account.socialType === "facebook") {
        if (account.accountType === "profile")
          return connectedFacebookProfileAccountDivs.push(
            this.pushNewConnectedAccountDiv(account, index)
          );
        else if (account.accountType === "page")
          return connectedFacebookPageAccountDivs.push(
            this.pushNewConnectedAccountDiv(account, index)
          );
        else if (account.accountType === "group")
          return connectedFacebookGroupAccountDivs.push(
            this.pushNewConnectedAccountDiv(account, index)
          );
      } else if (account.socialType === "twitter") {
        return connectedTwitterAccountDivs.push(
          this.pushNewConnectedAccountDiv(account, index)
        );
      } else if (account.socialType === "linkedin") {
        if (account.accountType === "profile")
          return connectedLinkedinProfileAccountDivs.push(
            this.pushNewConnectedAccountDiv(account, index)
          );
        else if (account.accountType === "page")
          return connectedLinkedinPageAccountDivs.push(
            this.pushNewConnectedAccountDiv(account, index)
          );
      } else if (account.socialType === "instagram") {
        return connectedInstagramPageAccountDivs.push(
          this.pushNewConnectedAccountDiv(account, index)
        );
      } else return false;
    });

    return (
      <Page title="Social Accounts">
        <GIContainer className="wrap py16 px32 align-start">
          <GIContainer className="column align-center fill-flex common-border br8 py32 px16 mx4">
            <GIContainer className="align-center mb16">
              <FontAwesomeIcon
                className="mr8"
                color={getPostColor("facebook")}
                icon={getPostIcon("facebook")}
                size="2x"
              />
              <GIText text="Facebook" type="h4" />
            </GIContainer>
            <GIText
              className="tac mb16"
              text="Connect a Facebook account to use it on Ghostit."
              type="h6"
            />

            <GIButton
              className="regular-button mb16"
              onClick={() => {
                window.location = "/api/facebook";
              }}
              text="Connect Facebook"
            />
            {connectedFacebookProfileAccountDivs}
            <GIText
              className="my16 border-bottom x-fill"
              text="Your Facebook Pages"
              type="h4"
            />
            {connectedFacebookProfileAccountDivs.length === 0 && (
              <GIText
                className="mb8"
                text="You must first connect a profile account."
                type="h6"
              />
            )}
            {connectedFacebookPageAccountDivs}
            {connectedFacebookProfileAccountDivs.length > 0 && (
              <GIContainer className="align-center x-fill mt16">
                <FontAwesomeIcon
                  className="regular-button-colors round clickable round-icon pa8"
                  icon={faPlus}
                  onClick={() => this.openModal("facebook", "page")}
                />
                <GIText className="pa4" text="Add Page" type="h6" />
              </GIContainer>
            )}
            {(user.role === "admin" || user.role === "tester") && (
              <GIText
                className="my16 border-bottom x-fill"
                text="Your Facebook Groups"
                type="h4"
              />
            )}
            {(user.role === "admin" || user.role === "tester") &&
              connectedFacebookProfileAccountDivs.length === 0 && (
                <GIText
                  className="mb8"
                  text="You must first connect a profile account."
                  type="h6"
                />
              )}
            {(user.role === "admin" || user.role === "tester") &&
              connectedFacebookGroupAccountDivs}
            {(user.role === "admin" || user.role === "tester") &&
              connectedFacebookProfileAccountDivs.length > 0 && (
                <GIContainer className="align-center x-fill mt16">
                  <FontAwesomeIcon
                    className="regular-button-colors round clickable round-icon pa8"
                    icon={faPlus}
                    onClick={() => this.openModal("facebook", "group")}
                  />
                  <GIText className="pa4" text="Add Group" type="h6" />
                </GIContainer>
              )}
          </GIContainer>

          <GIContainer className="column align-center fill-flex common-border br8 py32 px16 mx4">
            <GIContainer className="align-center mb16">
              <FontAwesomeIcon
                className="mr8"
                color={getPostColor("twitter")}
                icon={getPostIcon("twitter")}
                size="2x"
              />
              <GIText text="Twitter" type="h4" />
            </GIContainer>
            <GIText
              className="tac mb16"
              text="Connect a Twitter account to use it on Ghostit."
              type="h6"
            />

            <GIButton
              className="regular-button mb16"
              onClick={() => {
                window.location = "/api/twitter";
              }}
              text="Connect Twitter"
            />

            {connectedTwitterAccountDivs}
          </GIContainer>

          <GIContainer className="column align-center fill-flex common-border br8 py32 px16 mx4">
            <GIContainer className="align-center mb16">
              <FontAwesomeIcon
                className="mr8"
                color={getPostColor("linkedin")}
                icon={getPostIcon("linkedin")}
                size="2x"
              />
              <GIText text="LinkedIn" type="h4" />
            </GIContainer>
            <GIText
              className="tac mb16"
              text="Connect a LinkedIn account to use it on Ghostit."
              type="h6"
            />

            <GIButton
              className="regular-button mb16"
              onClick={() => {
                window.location = "/api/linkedin";
              }}
              text="Connect Linkedin"
            />
            {connectedLinkedinProfileAccountDivs}

            <GIText
              className="my16 border-bottom x-fill"
              text="Your LinkedIn Pages"
              type="h4"
            />
            {connectedLinkedinProfileAccountDivs.length === 0 && (
              <GIText
                className="mb8"
                text="You must first connect a profile account."
                type="h6"
              />
            )}

            {connectedLinkedinPageAccountDivs}
            {connectedLinkedinProfileAccountDivs.length > 0 && (
              <GIContainer className="align-center x-fill mt16">
                <FontAwesomeIcon
                  className="regular-button-colors round clickable round-icon pa8"
                  icon={faPlus}
                  onClick={() => this.openModal("linkedin", "page")}
                />
                <GIText className="pa4" text="Add Page" type="h6" />
              </GIContainer>
            )}
          </GIContainer>

          {user && (user.role === "admin" || user.role === "tester") && (
            <GIContainer className="column align-center fill-flex common-border br8 py32 px16 mx4">
              <GIContainer className="align-center mb16">
                <FontAwesomeIcon
                  className="mr8"
                  color={getPostColor("instagram")}
                  icon={getPostIcon("instagram")}
                  size="2x"
                />
                <GIText text="Instagram" type="h4" />
              </GIContainer>
              <GIText
                className="tac mb16"
                text="Connect a Facebook account to add an Instagram Page."
                type="h6"
              />
              <GIButton
                className="regular-button mb16"
                onClick={() => {
                  window.location = "/api/facebook";
                }}
                text="Connect Facebook"
              />

              <GIText
                className="mb16 border-bottom x-fill"
                text="Your Instagram Pages"
                type="h4"
              />
              {connectedFacebookProfileAccountDivs.length === 0 && (
                <GIText
                  className="mb8"
                  text="You must first connect a Facebook Profile."
                  type="h6"
                />
              )}

              {connectedInstagramPageAccountDivs}
              {connectedFacebookProfileAccountDivs.length > 0 && (
                <GIContainer className="align-center x-fill mt16">
                  <FontAwesomeIcon
                    className="regular-button-colors round clickable round-icon pa8"
                    icon={faPlus}
                    onClick={() => this.openModal("instagram", "page")}
                  />
                  <GIText className="pa4" text="Add Page" type="h6" />
                </GIContainer>
              )}
            </GIContainer>
          )}

          {addPageOrGroupModal && (
            <AddPageOrGroupModal
              accountType={accountType}
              close={() => this.setState({ addPageOrGroupModal: false })}
              errorMessage={errorMessage}
              getUserAccounts={() =>
                getUserAccounts(accounts => setAccounts(accounts))
              }
              loading={loading}
              pageOrGroupArray={pageOrGroupArray}
              socialType={socialType}
            />
          )}
          {deleteAccount && (
            <ConfirmAlert
              close={() => this.setState({ confirmDelete: false })}
              title="Delete Account"
              message="Are you sure you want to delete this social account from our software?"
              callback={confirmDelete =>
                disconnectAccount(
                  confirmDelete,
                  accountToDelete,
                  stateObject => {
                    this.handleChange(stateObject);
                    getUserAccounts(accounts => setAccounts(accounts));
                  }
                )
              }
            />
          )}
        </GIContainer>
      </Page>
    );
  }
}
AccountsPage.contextType = ExtraContext;

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccounts }, dispatch);
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountsPage)
);
