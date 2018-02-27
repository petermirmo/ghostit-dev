import React, { Component } from "react";
import axios from "axios";

import "../../css/theme.css";

var connectedFacebookAccounts = [];
var connectedTwitterAccounts = [];
var connectedLinkedinAccounts = [];
var connectedAccountsHeader;
class ConnectedAccountsList extends Component {
    constructor(props) {
        super(props);

        this.confirmDelete = this.confirmDelete.bind(this);
    }
    confirmDelete(event) {
        // ID of event.target is the index in the props account array
        var account = this.props.accounts[event.target.id];
        var message =
            "Are you sure you want to disconnect " + account.givenName + "?";
        if (account.accountType === "profile") {
            message +=
                " Disconnecting a profile account will also disconnect all groups and pages.";
        }
    }
    disconnectAccount(account) {
        axios.delete("/api/account", { data: account }).then(res => {
            // Set user's facebook pages to state
            if (res.data) {
                this.props.getUserAccounts();
            }
        });
    }
    render() {
        // Initialize
        var accounts = this.props.accounts;
        connectedFacebookAccounts = [];
        connectedTwitterAccounts = [];
        connectedLinkedinAccounts = [];

        for (var index in accounts) {
            // Initialize
            var account = accounts[index];
            var title = account.givenName;
            if (account.familyName) {
                title += " " + account.familyName;
            }
            // Header for connected accounts
            connectedAccountsHeader = (
                <h2
                    className="center"
                    style={{
                        color: "var(--blue-theme-color)",
                        textAlign: "center",
                        width: "90%",
                        borderRadius: "4px",
                        border: " 2px solid var(--blue-theme-color)"
                    }}
                >
                    Connected Accounts
                </h2>
            );
            // Create div for each connected account
            if (account.socialType === "facebook") {
                connectedFacebookAccounts.push(
                    <div
                        key={connectedFacebookAccounts.length}
                        className="connected-social-div center"
                        style={{
                            borderLeft: "4px solid #4267b2",
                            paddingLeft: "10px"
                        }}
                    >
                        <h4>{title}</h4>
                        <p>
                            {account.accountType.charAt(0).toUpperCase() +
                                account.accountType.slice(1)}
                            <button
                                id={index}
                                className="fa fa-trash"
                                style={{
                                    float: "right",
                                    color: "red",
                                    background: "none"
                                }}
                                onClick={event => this.confirmDelete(event)}
                            />
                        </p>
                    </div>
                );
            }
            if (account.socialType === "twitter") {
                connectedTwitterAccounts.push(
                    <div
                        key={connectedTwitterAccounts.length}
                        className="connected-social-div center"
                        style={{
                            borderLeft: "4px solid #1da1f2",
                            paddingLeft: "10px"
                        }}
                    >
                        <h4>
                            {account.givenName.charAt(0).toUpperCase() +
                                account.givenName.slice(1)}
                        </h4>
                        <p>
                            {account.accountType.charAt(0).toUpperCase() +
                                account.accountType.slice(1)}
                            <button
                                id={connectedFacebookAccounts.length}
                                className="fa fa-trash"
                                style={{
                                    float: "right",
                                    color: "red",
                                    background: "none"
                                }}
                                onClick={event => this.confirmDelete(event)}
                            />
                        </p>
                    </div>
                );
            }
            if (account.socialType === "linkedin") {
                connectedLinkedinAccounts.push(
                    <div
                        key={connectedLinkedinAccounts.length}
                        className="connected-social-div center"
                        style={{
                            borderLeft: "4px solid #0077b5",
                            paddingLeft: "10px"
                        }}
                    >
                        <h4>
                            {account.givenName.charAt(0).toUpperCase() +
                                account.givenName.slice(1)}
                        </h4>
                        <p>
                            {account.accountType.charAt(0).toUpperCase() +
                                account.accountType.slice(1)}
                            <button
                                id={connectedLinkedinAccounts.length}
                                className="fa fa-trash"
                                style={{
                                    float: "right",
                                    color: "red",
                                    background: "none"
                                }}
                                onClick={this.confirmDelete}
                            />
                        </p>
                    </div>
                );
            }
        }
        return (
            <div>
                {connectedAccountsHeader}
                {connectedFacebookAccounts}
                {connectedTwitterAccounts}
                {connectedLinkedinAccounts}
            </div>
        );
    }
}

export default ConnectedAccountsList;
