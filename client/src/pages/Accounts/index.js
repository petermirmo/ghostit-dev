import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faInstagram from "@fortawesome/fontawesome-free-brands/faInstagram";

import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setaccounts } from "../../redux/actions";

import AddPageOrGroupModal from "./AddPagesOrGroupsModal";
import ConfirmAlert from "../../components/notifications/ConfirmAlert";
import GIContainer from "../../components/containers/GIContainer";
import Page from "../../components/containers/Page";
import GIButton from "../../components/views/GIButton";

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
    errorMessage: "",
    addPageOrGroupModal: false,
    accountToDelete: undefined,
    deleteAccount: false
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  openModal = (socialType, accountType) => {
    this.setState({
      socialType,
      accountType,
      addPageOrGroupModal: true
    });

    if (socialType === "facebook") {
      if (accountType === "page") {
        getFacebookPages((pageOrGroupArray, errorMessage) =>
          this.setState({ pageOrGroupArray, errorMessage })
        );
      } else if (accountType === "group") {
        getFacebookGroups((pageOrGroupArray, errorMessage) =>
          this.setState({ pageOrGroupArray, errorMessage })
        );
      }
    } else if (socialType === "linkedin") {
      if (accountType === "page") {
        getLinkedinPages((pageOrGroupArray, errorMessage) =>
          this.setState({ pageOrGroupArray, errorMessage })
        );
      }
    }
  };

  pushNewConnectedAccountDiv = (account, index) => {
    const { socialType } = account;

    return (
      <GIContainer className="connected-social-div" key={index}>
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
      addPageOrGroupModal,
      deleteAccount,
      errorMessage,
      pageOrGroupArray,
      socialType,
      accountType
    } = this.state;

    const { setaccounts, accounts } = this.props; // Functions

    const connectedFacebookAccountDivs = [];
    const connectedTwitterAccountDivs = [];
    const connectedLinkedinAccountDivs = [];
    const connectedInstagramAccountDivs = [];

    accounts.map((account, index) => {
      if (account.socialType === "facebook") {
        connectedFacebookAccountDivs.push(
          this.pushNewConnectedAccountDiv(account, index)
        );
      } else if (account.socialType === "twitter") {
        connectedTwitterAccountDivs.push(
          this.pushNewConnectedAccountDiv(account, index)
        );
      } else if (account.socialType === "linkedin") {
        connectedLinkedinAccountDivs.push(
          this.pushNewConnectedAccountDiv(account, index)
        );
      } else if (account.socialType === "instagram") {
        connectedInstagramAccountDivs.push(
          this.pushNewConnectedAccountDiv(account, index)
        );
      }
    });

    return (
      <Page className="py16 px32" title="Social Accounts">
        <GIContainer className="column align-center fill-flex mx16">
          <GIButton
            className="social-header-button tac pa8 mb16"
            onClick={() => {
              window.location = "/api/facebook";
            }}
            text="Connect Facebook"
            style={{ backgroundColor: getPostColor("facebook") }}
          />

          <GIButton
            className="social-media-connect mb16 pa4"
            onClick={() => this.openModal("facebook", "page")}
            text="Connect Facebook Page"
            style={{ backgroundColor: getPostColor("facebook") }}
          />
          <GIButton
            className="social-media-connect mb16 pa4"
            onClick={() => this.openModal("facebook", "group")}
            text="Connect Facebook Group"
            style={{ backgroundColor: getPostColor("facebook") }}
          />
          {connectedFacebookAccountDivs}
        </GIContainer>

        <GIContainer className="column align-center fill-flex mx16">
          <GIButton
            className="social-header-button tac pa8 mb16"
            onClick={() => {
              window.location = "/api/twitter";
            }}
            text="Connect Twitter"
            style={{ backgroundColor: getPostColor("twitter") }}
          />

          {connectedTwitterAccountDivs}
        </GIContainer>
        <GIContainer className="column align-center fill-flex mx16">
          <GIButton
            className="social-header-button tac pa8 mb16"
            onClick={() => {
              window.location = "/api/linkedin";
            }}
            text="Connect Linkedin"
            style={{ backgroundColor: getPostColor("linkedin") }}
          />

          <GIButton
            className="social-media-connect mb16 pa4"
            onClick={() => this.openModal("linkedin", "page")}
            text="Connect LinkedIn Page"
            style={{ backgroundColor: getPostColor("linkedin") }}
          />
          {connectedLinkedinAccountDivs}
        </GIContainer>
        <GIContainer className="column align-center fill-flex mx16">
          <GIButton className="social-header-button flex hc button mb16 pa8 instagram">
            Connect Instagram <br />
            (Coming Soon)
          </GIButton>
          {connectedInstagramAccountDivs}
        </GIContainer>
        {addPageOrGroupModal && (
          <AddPageOrGroupModal
            getUserAccounts={() =>
              getUserAccounts(accounts => this.props.setaccounts(accounts))
            }
            pageOrGroupArray={pageOrGroupArray}
            accountType={accountType}
            socialType={socialType}
            errorMessage={errorMessage}
            close={() => this.setState({ addPageOrGroupModal: false })}
          />
        )}
        {deleteAccount && (
          <ConfirmAlert
            close={() => this.setState({ confirmDelete: false })}
            title="Delete Account"
            message="Are you sure you want to delete this social account from our software?"
            callback={confirmDelete =>
              disconnectAccount(confirmDelete, accountToDelete, stateObject => {
                this.handleChange(stateObject);
                getUserAccounts(accounts => this.props.setaccounts(accounts));
              })
            }
          />
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setaccounts }, dispatch);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsPage);
