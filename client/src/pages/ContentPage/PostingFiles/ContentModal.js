import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage } from "../../../redux/actions/";

import CreateBlog from "../../../components/CreateBlog/";
import CreateNewsletter from "../../../components/CreateNewsletter/";
import ContentModalHeader from "./ContentModalHeader";
import Loader from "../../../components/Notifications/Loader/";
import Post from "../../../components/Post";
import InstagramPosting from "./InstagramPosting";
import "./styles/";

class ContentModal extends Component {
	state = {
		saving: false,
		activeTab: { name: "facebook" },
		categories: [
			{ name: "facebook" },
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
					<Post
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
				);
			} else {
				modalBody = (
					<div className="connect-accounts-button" onClick={() => this.props.changePage("accounts")}>
						Connect Accounts!
					</div>
				);
			}
		}

		return (
			<div className="modal" onClick={this.props.close}>
				<div className="post-modal" onClick={e => e.stopPropagation()}>
					<FontAwesomeIcon icon={faTimes} size="2x" className="close" onClick={() => close("contentModal")} />

					<ContentModalHeader
						categories={this.state.categories}
						switchTabs={this.switchTabState}
						activeTab={activeTab}
						accounts={accounts}
					/>
					<div className="post-modal-body">{modalBody}</div>
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
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			changePage: changePage
		},
		dispatch
	);
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContentModal);
