import React, { Component } from "react";
import axios from "axios";
import "../../css/theme.css";
import SocialMediaDiv from "../divs/SocialMediaDiv";

function closeModal() {
    var modal = document.getElementById("FacebookPagesModal");
    modal.style.display = "none";
}

class FacebookPagesModal extends Component {
    constructor(props) {
        super(props);

        this.updateParentState = this.updateParentState.bind(this);
    }

    updateParentState(pagesToAdd) {
        this.setState({
            pagesToAdd: pagesToAdd
        });
    }
    addFacebookPages() {
        var pagesToAdd = this.state.pagesToAdd;
        if (pagesToAdd.length === 0 || !pagesToAdd) {
            alert("You have not selected any pages to add!");
        } else {
            for (var index in pagesToAdd) {
                axios
                    .post("/api/facebook/page", pagesToAdd[index])
                    .then(res => {
                        // Check to see if accounts were successfully saved
                        var success = res.data;
                        if (success) {
                            this.props.getUserAccounts();
                        } else {
                            alert("Account already added");
                        }
                    });
            }
            closeModal();
            this.props.getUserAccounts();
        }
    }

    render() {
        return (
            <div id="FacebookPagesModal" className="modal">
                <div
                    className="modal-content"
                    style={{ textAlign: "center", width: "35%" }}
                >
                    <div className="facebook modal-header">
                        <span className="close" onClick={() => closeModal()}>
                            &times;
                        </span>
                        <h2>
                            Connect {this.props.accountType}{" "}
                            {this.props.socialType}
                        </h2>
                    </div>

                    <div className="modal-body">
                        <SocialMediaDiv
                            updateParentAccounts={this.updateParentState}
                            accounts={this.props.pageOrGroup}
                            message={
                                "Please connect your facebook profile before adding any pages!"
                            }
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            className="facebook"
                            onClick={() => this.addFacebookPages()}
                        >
                            Connect
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default FacebookPagesModal;
