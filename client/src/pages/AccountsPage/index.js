import React, { Component } from "react";
import axios from "axios";
import MetaTags from "react-meta-tags";

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
import CommonContainer from "../../components/containers/CommonContainer";
import Page from "../../components/containers/Page";
import SquareButton from "../../components/buttons/SquareButton";

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
    accounts: this.props.accounts,
    pageOrGroupArray: [],
    accountType: "",
    socialType: "",
    errorMessage: "",
    addPageOrGroupModal: false,
    accountToDelete: undefined,
    deleteAccount: false
  };
  componentDidMount() {
    
  }
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
      <CommonContainer className="connected-social-div flex" key={index}>
        <CommonContainer className="flex vc hc">
          <FontAwesomeIcon
            icon={getPostIcon(socialType)}
            size="2x"
            color={getPostColor(socialType)}
          />
        </CommonContainer>
        <CommonContainer className="connected-social pl8">
          {getSocialDisplayName(account)}
          <br />
          <CommonContainer className="connected-social-account">
            {account.accountType.charAt(0).toUpperCase() +
              account.accountType.slice(1)}
          </CommonContainer>
        </CommonContainer>
        <CommonContainer className="flex vc hc">
          <FontAwesomeIcon
            icon={faTrash}
            onClick={event =>
              this.setState({ accountToDelete: account, deleteAccount: true })
            }
            className="button delete"
          />
        </CommonContainer>
      </CommonContainer>
    );
  };

  render() {
    const {
      accounts,
      addPageOrGroupModal,
      deleteAccount,
      errorMessage,
      pageOrGroupArray,
      socialType,
      accountType
    } = this.state;

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
      <Page className="py16 px32">
        <MetaTags>
          <title>Ghostit | Social Accounts</title>
        </MetaTags>
        <CommonContainer className="mx16" containerType={1}>
          <SomeButton
            className="social-header-button flex hc button mb16 pa8 button mb16 pa8 facebook"
            onClick={() => {
              window.location = "/api/facebook";
            }}
          >
            Connect Facebook
          </SomeButton>

          <SomeButton
            className="social-media-connect button mb16 facebook"
            onClick={() => this.openModal("facebook", "page")}
            text="Connect Facebook Page"
          >
            Page
          </SomeButton>
          <SomeButton
            className="social-media-connect button mb16 facebook"
            onClick={() => this.openModal("facebook", "group")}
          >
            Group
          </SomeButton>
          {connectedFacebookAccountDivs}
        </CommonContainer>

        <CommonContainer className="mx16" containerType={1}>
          <SomeButton
            className="social-header-button flex hc button mb16 pa8 twitter"
            onClick={() => {
              window.location = "/api/twitter";
            }}
          >
            Connect Twitter
          </SomeButton>

          {connectedTwitterAccountDivs}
        </CommonContainer>
        <CommonContainer className="mx16" containerType={1}>
          <SomeButton
            className="social-header-button flex hc button mb16 pa8 linkedin"
            onClick={() => {
              window.location = "/api/linkedin";
            }}
          >
            Connect Linkedin
          </SomeButton>

          <SomeButton
            className="social-media-connect button mb16 linkedin"
            onClick={() => this.openModal("linkedin", "page")}
          >
            Page
          </SomeButton>
          {connectedLinkedinAccountDivs}
        </CommonContainer>
        <CommonContainer className="mx16" containerType={1}>
          <SomeButton className="social-header-button flex hc button mb16 pa8 instagram">
            Connect Instagram <br />
            (Coming Soon)
          </SomeButton>
          {connectedInstagramAccountDivs}
        </CommonContainer>
        {addPageOrGroupModal && (
          <AddPageOrGroupModal
            getUserAccounts={() =>
              getUserAccounts(accounts => {
                this.setState({ accounts });
                this.props.setaccounts(accounts);
              })
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
              this.disconnectAccount(confirmDelete, accountToDelete)
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
