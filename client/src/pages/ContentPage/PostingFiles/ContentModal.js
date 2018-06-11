import React, { Component } from "react";
import "font-awesome/css/font-awesome.min.css";

import { connect } from "react-redux";

import CreateBlog from "./CreateBlog/";
import CreateNewsletter from "./CreateNewsletter/";
import ContentModalHeader from "./ContentModalHeader";
import Loader from "../../../components/Notifications/Loader/";
import PostingOptions from "./PostingOptions";
import InstagramPosting from "./InstagramPosting";
import "./style.css";

class ContentModal extends Component {
	state = {
		saving: false,
		activeTab: { name: "facebook", maxCharacters: 63206 },
		categories: [
			{ name: "facebook", maxCharacters: 63206 },
			{ name: "twitter", maxCharacters: 280 },
			{ name: "linkedin", maxCharacters: 700 },
			{ name: "blog" },
			{ name: "newsletter" },
			{ name: "instagram" }
		]
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
		const { timezone } = this.props;

		if (this.state.saving) {
			return <Loader />;
		}
		const { activeTab } = this.state;
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
					setSaving={this.setSaving}
					timezone={timezone}
				/>
			);
		} else if (activeTab.name === "newsletter") {
			modalBody = (
				<div className="modal-body">
					<CreateNewsletter
						postingDate={clickedCalendarDate}
						callback={saveNewsletterCallback}
						setSaving={this.setSaving}
						timezone={timezone}
					/>
				</div>
			);
		} else if (activeTab.name === "instagram") {
			modalBody = (
				<div className="modal-body">
					<InstagramPosting
						accounts={accounts}
						clickedCalendarDate={clickedCalendarDate}
						postFinishedSavingCallback={savePostCallback}
						setSaving={this.setSaving}
						socialType={activeTab.name}
						canEditPost={true}
						timezone={timezone}
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
					.indexOf(activeTab.name) !== -1
			) {
				modalBody = (
					<div className="modal-body">
						<PostingOptions
							accounts={accounts}
							clickedCalendarDate={clickedCalendarDate}
							postFinishedSavingCallback={() => {
								savePostCallback();
								close();
							}}
							setSaving={this.setSaving}
							socialType={activeTab.name}
							maxCharacters={activeTab.maxCharacters}
							canEditPost={true}
							timezone={timezone}
						/>
					</div>
				);
			} else {
				modalBody = (
					<div className="modal-body center">
						<h4>Connect {activeTab.name} Profile first!</h4>
					</div>
				);
			}
		}

		return (
			<div className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<span className="close-dark fa fa-times fa-10x" onClick={() => close("contentModal")} />
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
