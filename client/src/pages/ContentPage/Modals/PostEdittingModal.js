import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import { connect } from "react-redux";

import PostingOptions from "./PostingOptions";
import Notification from "../../../components/Notification";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Loader from "../../../components/Loader/";

import "./style.css";

class PostEdittingModal extends Component {
	state = {
		notification: {},
		saving: false
	};

	deletePostPopUp = () => {
		this.setState({ deletePost: true });
	};
	deletePost = deletePost => {
		this.setState({ deletePost: false, saving: true });
		if (!this.props.clickedCalendarEvent._id) {
			alert("Error cannot find post. Please contact our dev team immediately");
			return;
		}
		if (deletePost) {
			axios.delete("/api/post/delete/" + this.props.clickedCalendarEvent._id).then(res => {
				if (res.data) {
					this.props.savePostCallback();
				} else {
					this.setState({
						notification: { on: true, notificationType: "danger", title: "Something went wrong", message: "" }
					});
				}
			});
		}
	};
	setSaving = () => {
		this.setState({ saving: true });
	};
	render() {
		if (this.state.saving) {
			return <Loader />;
		}
		const { close, savePostCallback, clickedCalendarEvent, accounts, timezone } = this.props;

		let modalFooter;
		let canEditPost = clickedCalendarEvent.status !== "posted";
		if (canEditPost) {
			modalFooter = (
				<div className="modal-footer">
					<button onClick={this.deletePostPopUp} className="fa fa-trash fa-2x delete" />
				</div>
			);
		}

		return (
			<div className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<div className="modal-header">
						<span className="close-dark" onClick={() => close()}>
							&times;
						</span>
					</div>
					<div className="modal-body">
						<PostingOptions
							setSaving={this.setSaving}
							post={clickedCalendarEvent}
							canEditPost={canEditPost}
							postFinishedSavingCallback={savePostCallback}
							accounts={accounts}
							timezone={timezone}
						/>
					</div>

					{modalFooter}
				</div>
				{this.state.notification.on && (
					<Notification
						notificationType={this.state.notification.notificationType}
						title={this.state.notification.title}
						message={this.state.notification.message}
						callback={this.hideNotification}
					/>
				)}
				{this.state.deletePost && (
					<ConfirmAlert
						title="Delete Post"
						message="Are you sure you want to delete this post?"
						callback={this.deletePost}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		accounts: state.accounts
	};
}
export default connect(mapStateToProps)(PostEdittingModal);
