import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setKeyListenerFunction } from "../../../redux/actions/";

import CreateBlog from "../../../components/CreateBlog/";
import CreateNewsletter from "../../../components/CreateNewsletter/";
import ContentModalHeader from "./ContentModalHeader";
import Loader from "../../../components/Notifications/Loader/";
import Post from "../../../components/Post";
import InstagramPosting from "./InstagramPosting";
import "./styles/";

class ContentModal extends Component {
  state = {
    saving: false,
    activeTab: { name: "facebook" },
    categories: [
      { name: "facebook" },
      { name: "twitter", maxCharacters: 280 },
      { name: "linkedin", maxCharacters: 700 },
      { name: "blog" },
      { name: "newsletter" },
      { name: "instagram" }
    ],
    listOfPostChanges: {}
  };
  componentDidMount() {
    this._ismounted = true;

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.close(); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  switchTabState = activeTab => {
    if (activeTab.name === this.state.activeTab.name) return;
    this.setState(prevState => {
      return {
        activeTab,
        listOfPostChanges: {
          ...prevState.listOfPostChanges,
          accountID: "",
          accountType: "",
          socialType: activeTab.name
        }
      };
    });
  };

  setSaving = () => {
    this.setState({ saving: true });
  };

  backupPostChanges = (value, index) => {
    // function so that switching between different
    // socialTypes doesn't reset all the changes (date, content, name, instructions, etc.)
    if (index === "accountType" || index === "accountID") {
      // don't save the account chosen
      return;
    }
    this.setState(prevState => {
      const newChanges = { ...prevState.listOfPostChanges };
      if (newChanges.accountID === "") {
        delete newChanges.accountID;
        delete newChanges.accountType;
      }
      return {
        listOfPostChanges: {
          ...newChanges,
          [index]: value
        }
      };
    });
  };

  render() {
    if (this.state.saving) {
      return <Loader />;
    }
    const { activeTab, listOfPostChanges } = this.state;
    const {
      close,
      clickedCalendarDate,
      accounts,
      savePostCallback,
      saveBlogCallback,
      saveNewsletterCallback
    } = this.props;
    let modalBody;

    // Check if this is a blog placeholder
    if (activeTab.name === "blog") {
      modalBody = (
        <CreateBlog
          postingDate={clickedCalendarDate}
          callback={saveBlogCallback}
          calendarID={this.props.calendarID}
          setSaving={this.setSaving}
        />
      );
    } else if (activeTab.name === "newsletter") {
      modalBody = (
        <div className="modal-body">
          <CreateNewsletter
            postingDate={clickedCalendarDate}
            callback={saveNewsletterCallback}
            calendarID={this.props.calendarID}
            setSaving={this.setSaving}
          />
        </div>
      );
    } else if (activeTab.name === "instagram") {
      modalBody = (
        <div className="modal-body">
          <InstagramPosting
            postFinishedSavingCallback={savePostCallback}
            setSaving={this.setSaving}
            socialType={activeTab.name}
            calendarID={this.props.calendarID}
            canEditPost={true}
          />
        </div>
      );
    } else {
      modalBody = (
        <Post
          post={{
            postingDate:
              clickedCalendarDate < new moment()
                ? new moment().add(5, "minutes")
                : clickedCalendarDate
          }}
          postFinishedSavingCallback={() => {
            savePostCallback();
            close();
          }}
          calendarID={this.props.calendarID}
          setSaving={this.setSaving}
          socialType={activeTab.name}
          canEditPost={true}
          maxCharacters={activeTab.maxCharacters}
          listOfChanges={
            Object.keys(listOfPostChanges).length > 0
              ? listOfPostChanges
              : undefined
          }
          backupChanges={this.backupPostChanges}
          notify={this.props.notify}
        />
      );
    }

    return (
      <div className="modal" onClick={this.props.close}>
        <div className="post-modal" onClick={e => e.stopPropagation()}>
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => close("contentModal")}
          />

          <ContentModalHeader
            categories={this.state.categories}
            switchTabs={this.switchTabState}
            activeTab={activeTab}
            accounts={accounts}
          />
          <div className="post-modal-body">{modalBody}</div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage,
      setKeyListenerFunction
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentModal);
