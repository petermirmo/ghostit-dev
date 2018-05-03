import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import PostingOptions from "./PostingOptions";

import Notification from "../../../components/Notification";
import ConfirmAlert from "../../../components/ConfirmAlert";

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
		this.setState({ deletePost: false });
		if (!this.state.postID) {
			alert("Error cannot find post. Please contact our dev team immediately");
			return;
		}
		if (deletePost) {
			axios.delete("/api/post/delete/" + this.state.postID).then(res => {
				if (res.data) {
					this.props.updateCalendarPosts();
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
		let modalFooter;
		let canEditPost = this.state.status === "pending" || this.state.status === "error";
		if (canEditPost) {
			modalFooter = (
				<div className="modal-footer">
					<button onClick={this.deletePostPopUp} className="fa fa-trash fa-2x delete" />
				</div>
			);
		}

		return (
			<div id="edittingModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<div className="modal-header">
						<span className="close-dark" onClick={() => this.props.close("postEdittingModal")}>
							&times;
						</span>
					</div>
					<PostingOptions
						postFinishedSavingCallback={this.postFinishedSavingCallback}
						setSaving={this.setSaving}
						post={this.props.clickedCalendarEvent}
						canEditPost={canEditPost}
					/>

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

export default PostEdittingModal;
