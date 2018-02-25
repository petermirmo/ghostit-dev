import React, { Component } from "react";
import "../../css/theme.css";

var pagesToAdd = [];
var pagesMessage;
var indents = [];
var pages = [];
class socialMediaDiv extends Component {
    constructor(props) {
        super(props);

        this.handleParentClick = this.handleParentClick.bind(this);
        this.handleChildClick = this.handleChildClick.bind(this);
    }
    //  For social media background color change on click
    handleParentClick(event) {
        var div;
        if (event.target) {
            // Not a child click
            div = event.target;
        } else {
            // Child click
            div = event;
        }
        // Index in array of page to add
        var indexOfAccount = div.id;

        // Check if object is in state array
        if (!pagesToAdd.includes(this.props.accounts[indexOfAccount])) {
            // Page index is not in array
            pagesToAdd.push(this.props.accounts[indexOfAccount]);

            // Set div to active
            div.className += " add-fb-page-active";
        } else {
            // Page index is in array so remove it
            var index = pagesToAdd.indexOf(this.props.accounts[indexOfAccount]);
            pagesToAdd.splice(index, 1);

            // Take away class active from div
            div.className = "social-media-div";
        }
        this.props.updateParentAccounts(pagesToAdd);
    }
    handleChildClick(event) {
        // Make sure this function is not called on parent click
        event.stopPropagation();

        var div = event.target.parentNode;

        // Text of div was clicked but we want the div to be set as active not the h4
        this.handleParentClick(div);
    }

    render() {
        // Error message
        pagesMessage = <p>{this.props.message}</p>;

        // Check to see if accounts have changed
        if (pages !== this.props.accounts) {
            // If they have changed reset pagesToAdd array
            pagesToAdd = [];
        }

        pages = this.props.accounts;
        var page;
        indents = [];

        for (var index in pages) {
            page = pages[index];
            pagesMessage = null;
            // This creates a div for each page that can be clicked
            // by the user to save these pages to our database
            indents.push(
                <div
                    id={index}
                    key={index}
                    className="social-media-div"
                    onClick={this.handleParentClick}
                >
                    <h4 onClick={this.handleChildClick}>{page.name}</h4>
                    <p onClick={this.handleChildClick}>{page.category}</p>
                </div>
            );
        }
        return (
            <div>
                {pagesMessage}
                {indents}
            </div>
        );
    }
}

export default socialMediaDiv;
