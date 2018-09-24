import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faInstagram from "@fortawesome/fontawesome-free-brands/faInstagram";

import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateAccounts } from "../../redux/actions/";

import AddPageOrGroupModal from "./AddPagesOrGroupsModal/";
import ConfirmAlert from "../../components/Notifications/ConfirmAlert/";
import "./styles/";

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

  openModal = (socialType, accountType) => {
    // Open facebook add page modal
    this.setState({ addPageOrGroupModal: true });
    if (socialType === "facebook") {
      if (accountType === "page") {
        this.getFacebookPages();
      } else if (accountType === "group") {
        this.getFacebookGroups();
      }
    } else if (socialType === "linkedin") {
      if (accountType === "page") {
        this.getLinkedinPages();
      }
    } else if (socialType === "instagram") {
      if (accountType === "page") {
        this.getInstagramPages();
      }
    }
  };

  getUserAccounts = () => {
    // Get all connected accounts of the user
    axios.get("/api/accounts").then(res => {
      let { accounts, success, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      if (success) {
        // Set user's accounts to state
        this.setState({ accounts });
        this.props.updateAccounts(accounts);
      }
    });
  };

  getFacebookPages = () => {
    this.setState({
      accountType: "page",
      socialType: "facebook",
      pageOrGroupArray: []
    });
    axios.get("/api/facebook/pages").then(res => {
      let errorMessage = "";

      let { pages, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      if (pages) {
        if (pages.length === 0) errorMessage = "No Facebook pages found";
      } else errorMessage = "Please connect your Facebook profile first.";

      // If pages returns false, there was an error so just set to undefined
      if (!pages) pages = [];

      // Set data to state
      this.setState({
        pageOrGroupArray: pages,
        errorMessage
      });
    });
  };
  getFacebookGroups = () => {
    this.setState({
      accountType: "group",
      socialType: "facebook",
      pageOrGroupArray: []
    });
    axios.get("/api/facebook/groups").then(res => {
      let errorMessage;

      // Set user's facebook groups to state
      let { groups, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      if (groups) {
        if (groups.length === 0) errorMessage = "No Facebook groups found";
      } else errorMessage = "Please connect your Facebook profile first.";

      // If groups returns false, there was an error so just set to undefined
      if (!groups) groups = [];

      // Set data to state
      this.setState({
        pageOrGroupArray: groups,
        errorMessage
      });
    });
  };
  getInstagramPages = () => {
    this.setState({
      accountType: "page",
      socialType: "instagram",
      pageOrGroupArray: []
    });
    axios.get("/api/instagram/pages").then(res => {
      let { pages, loggedIn, errorMessage } = res.data;
      if (loggedIn === false) window.location.reload();

      // Set data to state
      this.setState({
        pageOrGroupArray: pages,
        errorMessage
      });
    });
  };
  getLinkedinPages = () => {
    this.setState({
      accountType: "page",
      socialType: "linkedin",
      pageOrGroupArray: []
    });
    axios.get("/api/linkedin/pages").then(res => {
      let errorMessage;
      // Check to see if array is empty or a profile account was found
      let { pages, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      if (pages) {
        if (pages.length === 0) {
          errorMessage = "No Linkedin pages found";
        }
      } else {
        errorMessage = "Please connect your Linkedin profile first.";
      }
      // If pageOrGroupArray returns false, there was an error so just set to []
      if (!pages) {
        pages = [];
      }
      // Set data to state
      this.setState({
        pageOrGroupArray: pages,
        errorMessage
      });
    });
  };
  deleteConfirm = account => {
    this.setState({ accountToDelete: account, deleteAccount: true });
  };
  disconnectAccount = confirmDelete => {
    const { accountToDelete } = this.state;
    if (confirmDelete) {
      axios.delete("/api/account/" + accountToDelete._id).then(res => {
        // Set user's facebook pages to state
        if (res.data) {
          this.getUserAccounts();
        }
        this.setState({ accountToDelete: undefined, deleteAccount: false });
      });
    } else {
      this.setState({ accountToDelete: undefined, deleteAccount: false });
    }
  };
  pushNewConnectedAccountDiv = (connectedAccountsDivArray, account) => {
    let name;
    if (account.givenName)
      name =
        account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
    if (account.familyName)
      name +=
        " " +
        account.familyName.charAt(0).toUpperCase() +
        account.familyName.slice(1);
    if (account.username !== "" && account.username) name = account.username;

    let icon = faFacebook;
    let color = "#4267b2";
    if (account.socialType === "twitter") {
      icon = faTwitter;
      color = "#1da1f2";
    } else if (account.socialType === "linkedin") {
      icon = faLinkedin;
      color = "#0077b5";
    } else if (account.socialType === "instagram") {
      icon = faInstagram;
      color = "#cd486b";
    }
    connectedAccountsDivArray.push(
      <div
        className="connected-social-div"
        key={connectedAccountsDivArray.length + account.socialType}
      >
        <span className="connected-social-media-icon">
          <FontAwesomeIcon icon={icon} size="2x" color={color} />
        </span>
        <div className="connected-social center">
          <h4>{name}</h4>
          <p>
            {account.accountType.charAt(0).toUpperCase() +
              account.accountType.slice(1)}
          </p>
        </div>
        <span
          onClick={event => this.deleteConfirm(account)}
          className="disconnect-social-account"
        >
          <FontAwesomeIcon icon={faTrash} color="var(--red-theme-color)" />
        </span>
      </div>
    );
  };
  close = () => {
    this.setState({ addPageOrGroupModal: false });
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

    let connectedFacebookAccountDivs = [];
    let connectedTwitterAccountDivs = [];
    let connectedLinkedinAccountDivs = [];
    let connectedInstagramAccountDivs = [];

    for (let index in accounts) {
      let account = accounts[index];
      switch (account.socialType) {
        case "facebook":
          this.pushNewConnectedAccountDiv(
            connectedFacebookAccountDivs,
            account
          );
          break;
        case "twitter":
          this.pushNewConnectedAccountDiv(connectedTwitterAccountDivs, account);
          break;
        case "linkedin":
          this.pushNewConnectedAccountDiv(
            connectedLinkedinAccountDivs,
            account
          );
          break;
        case "instagram":
          this.pushNewConnectedAccountDiv(
            connectedInstagramAccountDivs,
            account
          );
          break;
        default:
        // There is an error
      }
    }
    return (
      <div  >
        <div className="accounts-wrapper">
          <div className="account-column">
            <button
              className="social-header-button facebook"
              onClick={() => {
                window.location = "/api/facebook";
              }}
            >
              Connect Facebook
            </button>

            <button
              className="social-media-connect facebook"
              onClick={() => this.openModal("facebook", "page")}
            >
              Page
            </button>
            <button
              className="social-media-connect facebook"
              onClick={() => this.openModal("facebook", "group")}
            >
              Group
            </button>
            {connectedFacebookAccountDivs}
          </div>
          <div className="account-column">
            <button
              className="social-header-button twitter"
              onClick={() => {
                window.location = "/api/twitter";
              }}
            >
              Connect Twitter
            </button>

            {connectedTwitterAccountDivs}
          </div>
          <div className="account-column">
            <button
              className="social-header-button linkedin"
              onClick={() => {
                window.location = "/api/linkedin";
              }}
            >
              Connect Linkedin
            </button>

            <button
              className="social-media-connect linkedin"
              onClick={() => this.openModal("linkedin", "page")}
            >
              Page
            </button>
            {connectedLinkedinAccountDivs}
          </div>
          <div className="account-column">
            <button className="social-header-button instagram">
              Connect Instagram <br />(Coming Soon)
            </button>
            {connectedInstagramAccountDivs}
          </div>
        </div>
        {addPageOrGroupModal && (
          <AddPageOrGroupModal
            getUserAccounts={this.getUserAccounts}
            pageOrGroupArray={pageOrGroupArray}
            accountType={accountType}
            socialType={socialType}
            errorMessage={errorMessage}
            close={this.close}
          />
        )}
        {deleteAccount && (
          <ConfirmAlert
            close={() => this.setState({ confirmDelete: false })}
            title="Delete Account"
            message="Are you sure you want to delete this social account from our software?"
            callback={this.disconnectAccount}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    clientSideBar: state.clientSideBar,
    accounts: state.accounts
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateAccounts: updateAccounts }, dispatch);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsPage);
