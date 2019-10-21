import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import Modal from "../containers/Modal";
import GIContainer from "../containers/GIContainer";
import GIButton from "../views/GIButton";
import GIText from "../views/GIText";
import LoaderSimpleCircle from "../notifications/LoaderSimpleCircle";

import SocialMediaDiv from "./SocialMediaDiv";

class AddPagesOrGroupsModal extends Component {
  state = {
    pagesToAdd: []
  };

  setPagesToAdd = pagesToAdd => {
    this.setState({
      pagesToAdd
    });
  };
  addAccounts = () => {
    const { pagesToAdd } = this.state;
    const { getUserAccounts, close } = this.props; // Functions

    if (pagesToAdd.length === 0 || !pagesToAdd) {
      alert("You have not selected any pages to add!");
    } else {
      for (let index in pagesToAdd) {
        let page = pagesToAdd[index];
        // Add accountType and socialType
        page.accountType = this.props.accountType;
        page.socialType = this.props.socialType;
        axios.post("/api/account", page).then(res => {
          let { loggedIn } = res.data;
          if (loggedIn === false) this.props.history.push("/sign-in");

          // Check to see if accounts were successfully saved
          if (res.data) {
            getUserAccounts();
          } else {
            alert("Account already added");
          }
        });
      }
      close();
      getUserAccounts();
    }
  };

  render() {
    const { accountType, errorMessage, loading, socialType } = this.props;
    let { pageOrGroupArray } = this.props;
    if (!pageOrGroupArray) pageOrGroupArray = [];

    return (
      <Modal
        body={
          loading ? (
            <GIContainer className="fill-parent full-center">
              <LoaderSimpleCircle />
            </GIContainer>
          ) : (
            <GIContainer className="column x-fill y-fill">
              {!errorMessage && (
                <SocialMediaDiv
                  updateParentAccounts={this.setPagesToAdd}
                  accounts={pageOrGroupArray}
                  errorMessage={errorMessage}
                />
              )}

              {errorMessage && (
                <GIContainer className="pa16">
                  <div>{errorMessage}</div>
                </GIContainer>
              )}
            </GIContainer>
          )
        }
        className="br8"
        footer={
          <GIContainer className="x-fill full-center my16">
            <GIButton
              className="regular-button"
              onClick={() => this.addAccounts()}
              text="Connect"
            />
          </GIContainer>
        }
        header={
          <GIContainer className="bg-seven-blue x-fill full-center py16">
            <GIContainer className="fill-flex" />
            <GIText
              className="white"
              text={`Connect ${socialType
                .charAt(0)
                .toUpperCase()}${socialType.slice(1)} ${accountType
                .charAt(0)
                .toUpperCase()}${accountType.slice(1)}`}
              type="h2"
            />
            <GIContainer className="justify-end fill-flex px16">
              <FontAwesomeIcon
                icon={faTimes}
                className="opposite-button-colors clickable br4 round-icon-small"
                onClick={() => this.props.close()}
              />
            </GIContainer>
          </GIContainer>
        }
        showClose={false}
      />
    );
  }
}

export default AddPagesOrGroupsModal;
