import React, { Component } from "react";
import "font-awesome/css/font-awesome.min.css";

import { connect } from "react-redux";

import CreateBlog from "./CreateBlog/";
import ContentModalHeader from "./ContentModalHeader";
import Loader from "../../../components/Loader/";
import PostingOptions from "./PostingOptions";
import "./style.css";

class ContentModal extends Component {
	state = {
		linkImagesArray: [],
		saving: false,
		activeTab: "facebook",
		categories: ["facebook", "twitter", "linkedin", "blog"]
	};

	switchTabState = activeTab => {
		this.setState({
			activeTab: activeTab,
			linkImagesArray: [],
			postingToAccountId: ""
		});
	};

	setSaving = () => {
		this.setState({ saving: true });
	};
	postFinishedSavingCallback = result => {
		this.setState({ saving: false });
	};

	render() {
		if (this.state.saving) {
			return <Loader />;
		}
		const { activeTab } = this.state;
		const { updateCalendarBlogs, close, clickedCalendarDate, accounts } = this.props;

		let modalBody;
		// Loop through all accounts
		let activePageAccountsArray = [];
		for (let index in accounts) {
			// Check if the account is the same as active tab
			if (accounts[index].socialType === activeTab) {
				activePageAccountsArray.push(accounts[index]);
			}
		}

		// Check if this is a blog placeholder
		if (activeTab === "blog") {
			modalBody = (
				<CreateBlog
					clickedCalendarDate={clickedCalendarDate}
					updateCalendarBlogs={updateCalendarBlogs}
					callback={this.setSaving}
				/>
			);
		} else {
			// If the user has an account for the active tab connected
			if (activePageAccountsArray.length !== 0) {
				modalBody = (
					<div className="modal-body">
						<PostingOptions
							accounts={activePageAccountsArray}
							clickedCalendarDate={clickedCalendarDate}
							postFinishedSavingCallback={this.postFinishedSavingCallback}
							setSaving={this.setSaving}
							socialType={activeTab}
						/>
					</div>
				);
			} else {
				modalBody = (
					<div className="modal-body center">
						<h4>Connect {activeTab} Profile first!</h4>
					</div>
				);
			}
		}

		return (
			<div className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<span className="close-dark" onClick={() => close("contentModal")}>
						&times;
					</span>
					<div className="modal-header">
						<ContentModalHeader
							categories={this.state.categories}
							switchTabs={this.switchTabState}
							activeTab={activeTab}
						/>
					</div>
					{modalBody}
				</div>
			</div>
		);
	}
}
function mapStateToProps(state) {
	return {
		accounts: state.accounts
	};
}

export default connect(mapStateToProps)(ContentModal);
