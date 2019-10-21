import React, { Component } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import GIContainer from "../../containers/GIContainer";

import Header from "./Header";
import Loader from "../../notifications/Loader/";
import Post from "../Post";
import CustomTask from "../CustomTask";

import "../style.css";

class ContentModal extends Component {
  state = {
    activeTab: { name: "facebook" },
    categories: [
      { name: "facebook" },
      { name: "twitter" },
      { name: "linkedin" },
      { name: "custom" }
    ],
    listOfPostChanges: {},
    saving: false
  };
  componentDidMount() {
    this._ismounted = true;

    const {
      handleParentChange,
      setKeyListenerFunction,
      getKeyListenerFunction
    } = this.props; // Functions

    setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          handleParentChange({ contentModal: false }); // escape button pushed
        }
      },
      getKeyListenerFunction[0]
    ]);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  switchTabState = activeTab => {
    if (activeTab.name === this.state.activeTab.name) return;

    if (this._ismounted)
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
    if (this._ismounted) this.setState({ saving: true });
  };

  backupPostChanges = (value, index) => {
    // function so that switching between different
    // socialTypes doesn't reset all the changes (date, content, name, instructions, etc.)
    if (index === "accountType" || index === "accountID") {
      // don't save the account chosen
      return;
    }
    if (this._ismounted)
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
    const { activeTab, listOfPostChanges, saving } = this.state;
    const { calendarAccounts, calendarID, clickedCalendarDate } = this.props; // Variables
    const { handleParentChange, notify, savePostCallback } = this.props; // Functions
    let body;

    if (activeTab.name === "custom") {
      body = (
        <div className="modal-body">
          <CustomTask
            post={{
              postingDate:
                clickedCalendarDate < new moment()
                  ? new moment().add(5, "minutes")
                  : clickedCalendarDate
            }}
            postFinishedSavingCallback={(post, success, message) => {
              if (this._ismounted) this.setState({ saving: false });
              if (success) savePostCallback(post);
              else notify({ type: "danger", title: "Save Failed", message });
            }}
            calendarID={calendarID}
            setSaving={this.setSaving}
            socialType={activeTab.name}
            canEditPost={true}
            listOfChanges={
              Object.keys(listOfPostChanges).length > 0
                ? listOfPostChanges
                : undefined
            }
            backupChanges={this.backupPostChanges}
          />
        </div>
      );
    } else {
      body = (
        <Post
          backupChanges={this.backupPostChanges}
          calendarAccounts={calendarAccounts}
          calendarID={calendarID}
          canEditPost={true}
          listOfChanges={
            Object.keys(listOfPostChanges).length > 0
              ? listOfPostChanges
              : undefined
          }
          maxCharacters={activeTab.maxCharacters}
          notify={notify}
          post={{
            postingDate:
              clickedCalendarDate < new moment()
                ? new moment().add(5, "minutes")
                : clickedCalendarDate
          }}
          postFinishedSavingCallback={(post, success, message) => {
            handleParentChange({ loading: false });
            if (success) {
              savePostCallback(post);
            } else {
              notify({ type: "danger", title: "Save Failed", message });
            }
          }}
          setSaving={() => handleParentChange({ loading: true })}
          socialType={activeTab.name}
          switchTabState={this.switchTabState}
        />
      );
    }

    return <GIContainer className="x-fill">{body}</GIContainer>;
  }
}
function mapStateToProps(state) {
  return {
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentModal);
