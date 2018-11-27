import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import axios from "axios";

import SocialMediaDiv from "./SocialMediaDiv";
import "./styles/";

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
            this.props.getUserAccounts();
          } else {
            alert("Account already added");
          }
        });
      }
      this.props.close();
      this.props.getUserAccounts();
    }
  };

  render() {
    const { socialType, accountType, errorMessage } = this.props;
    let { pageOrGroupArray } = this.props;
    if (!pageOrGroupArray) pageOrGroupArray = [];

    return (
      <div className="modal">
        <div
          className="modal-content"
          style={{ textAlign: "center", width: "35%" }}
        >
          <div className={socialType + " modal-header"}>
            <FontAwesomeIcon
              icon={faTimes}
              size="2x"
              className="close"
              onClick={() => this.props.close()}
            />

            <h2 className="connect-header">
              Connect {socialType.charAt(0).toUpperCase() + socialType.slice(1)}{" "}
              {accountType.charAt(0).toUpperCase() + accountType.slice(1)}
            </h2>
          </div>

          <div className="modal-body">
            {!errorMessage && (
              <SocialMediaDiv
                updateParentAccounts={this.setPagesToAdd}
                accounts={pageOrGroupArray}
                errorMessage={errorMessage}
              />
            )}
            {errorMessage && <div>{errorMessage}</div>}
          </div>

          {pageOrGroupArray.length !== 0 && (
            <div className="modal-footer">
              <button
                className={socialType + " connect-social-media"}
                onClick={() => this.addAccounts()}
              >
                Connect
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AddPagesOrGroupsModal;
