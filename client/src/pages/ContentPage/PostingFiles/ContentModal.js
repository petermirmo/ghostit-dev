import React, { Component } from "react";
import "font-awesome/css/font-awesome.min.css";

import { connect } from "react-redux";

import CreateBlog from "./CreateBlog/";
import ContentModalHeader from "./ContentModalHeader";
import Loader from "../../../components/Loader/";
import PostingOptions from "./PostingOptions";
import InstagramPosting from "./InstagramPosting";
import "./style.css";

class ContentModal extends Component {
	state = {
		saving: false,
		activeTab: "facebook",
		categories: ["facebook", "twitter", "linkedin", "instagram", "blog"]
	};

	switchTabState = activeTab => {
		this.setState({
			activeTab: activeTab,
			postingToAccountId: ""
		});
	};

	setSaving = () => {
		this.setState({ saving: true });
	};

	render() {
		if (this.state.saving) {
			return <Loader />;
		}
		const { activeTab } = this.state;
		const { close, clickedCalendarDate, accounts, savePostCallback, saveBlogCallback } = this.props;

		let modalBody;

		// Check if this is a blog placeholder
		if (activeTab === "blog") {
			modalBody = (
				<CreateBlog clickedCalendarDate={clickedCalendarDate} callback={saveBlogCallback} setSaving={this.setSaving} />
			);
		} else if (activeTab === "instagram") {
			modalBody = (
				<div className="modal-body">
					<InstagramPosting
						accounts={accounts}
						clickedCalendarDate={clickedCalendarDate}
						postFinishedSavingCallback={savePostCallback}
						setSaving={this.setSaving}
						socialType={activeTab}
						canEditPost={true}
					/>
				</div>
			);
		} else {
			// If the user has an account for the active tab connected
			if (
				accounts
					.map(function(e) {
						return e.socialType;
					})
					.indexOf(activeTab) !== -1
			) {
				modalBody = (
					<div className="modal-body">
						<PostingOptions
							accounts={accounts}
							clickedCalendarDate={clickedCalendarDate}
							postFinishedSavingCallback={savePostCallback}
							setSaving={this.setSaving}
							socialType={activeTab}
							canEditPost={true}
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
