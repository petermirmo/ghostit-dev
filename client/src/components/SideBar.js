import React, { Component } from "react";
import axios from "axios";

import "../css/theme.css";
import AddPageOrGroupModal from "../components/modals/FacebookPagesModalComponent";
import ConnectedAccountsDiv from "../components/divs/ConnectedAccountsDiv";

class SideBar extends Component {
    state = {
        accounts: [],
        pageOrGroup: [],
        accountType: "",
        socialType: ""
    };
    constructor(props) {
        super(props);
        this.getUserAccounts = this.getUserAccounts.bind(this);

        this.getUserAccounts();
    }

    closeSideBar() {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("main").style.marginLeft = "0%";
    }

    openModal(socialType, accountType) {
        // Open facebook add page modal
        var modal = document.getElementById("FacebookPagesModal");
        modal.style.display = "block";

        if (socialType === "facebook") {
            if (accountType === "page") {
                this.getFacebookPages();
            }
        }
    }

    getUserAccounts() {
        // Get all connected accounts of the user
        axios.get("/api/accounts").then(res =>
            // Set user's accounts to state
            this.setState({ accounts: res.data }, () => {})
        );
    }

    getFacebookPages() {
        axios.get("/api/facebook/pages").then(res => {
            // Set user's facebook pages to state
            var pageOrGroup = res.data.data;
            this.setState({
                pageOrGroup: pageOrGroup,
                accountType: "facebook",
                socialType: "page"
            });
        });
    }
    getFacebookGroups() {
        axios.get("/api/facebook/groups").then(res => {
            // Set user's facebook pages to state
            var pageOrGroup = res.data.data;
            this.setState({ pageOrGroup: pageOrGroup });
        });
    }

    render() {
        // Initialize
        var accounts = this.state.accounts;

        return (
            <div
                className="side-bar animate-left"
                style={{ display: "none" }}
                id="mySidebar"
            >
                <AddPageOrGroupModal
                    getUserAccounts={this.getUserAccounts}
                    pageOrGroup={this.state.pageOrGroup}
                    accountType={this.state.accountType}
                    socialType={this.state.socialType}
                />

                <span
                    className="close-dark"
                    onClick={() => this.closeSideBar()}
                >
                    &times;
                </span>
                <br />
                <br />
                <ConnectedAccountsDiv
                    accounts={accounts}
                    getUserAccounts={this.getUserAccounts}
                />
                <div className="side-bar-container center">
                    <h4 className="facebook">Connect Facebook</h4>
                    <button
                        className="side-bar-button-center facebook"
                        onClick={() => {
                            window.location = "/api/facebook";
                        }}
                    >
                        Profile
                    </button>
                    <button
                        className="side-bar-button-center facebook"
                        onClick={() => this.openModal("facebook", "page")}
                    >
                        Page
                    </button>
                    <button className="side-bar-button-center facebook">
                        Group
                    </button>
                    <h4 className="twitter">Connect Twitter</h4>
                    <button
                        className="side-bar-button-center twitter"
                        style={{ width: "60%" }}
                    >
                        Profile
                    </button>
                    <h4 className="linkedin">Connect Linkedin</h4>{" "}
                    <button className="side-bar-button-center linkedin">
                        Profile
                    </button>
                    <button className="side-bar-button-center linkedin">
                        Page
                    </button>
                    <h4 className="instagram">Connect Instagram</h4>
                    <button
                        className="side-bar-button-center instagram"
                        style={{
                            width: "60%",
                            cursor: "default",
                            marginBottom: "100px"
                        }}
                    >
                        Coming Soon!
                    </button>
                </div>
            </div>
        );
    }
}

export default SideBar;
