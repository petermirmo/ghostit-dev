import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import axios from "axios";

import { connect } from "react-redux";

import Post from "../../../components/Post";
import Notification from "../../../components/Notifications/Notification";
import ConfirmAlert from "../../../components/Notifications/ConfirmAlert";
import Loader from "../../../components/Notifications/Loader/";
import "./styles/";

class PostEdittingModal extends Component {
	state = {
		notification: {},
		saving: false,
		confirmDelete: false
	};

	deletePostPopUp = () => {
		this.setState({ confirmDelete: true });
	};
	deletePost = deletePost => {
		this.setState({ confirmDelete: false, saving: true });
		if (!this.props.clickedEvent._id) {
			alert("Error cannot find post. Please contact our dev team immediately");
			return;
		}
		if (deletePost) {
			axios.delete("/api/post/delete/" + this.props.clickedEvent._id).then(res => {
				let { loggedIn } = res.data;
				if (loggedIn === false) window.location.reload();

				if (res.data) {
					this.props.savePostCallback();
					this.props.close();
				} else {
					this.setState({
						notification: { on: true, notificationType: "danger", title: "Something went wrong", message: "" }
					});
				}
			});
		} else {
			this.setState({
				confirmDelete: false,
				saving: false
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
		const { close, savePostCallback, clickedEvent, accounts, timezone } = this.props;

		let modalFooter;
		let canEditPost = clickedEvent.status !== "posted";
		if (canEditPost) {
			modalFooter = (
				<div className="modal-footer">
					<FontAwesomeIcon onClick={this.deletePostPopUp} className="delete" icon={faTrash} size="2x" />
				</div>
			);
		}
		let maxCharacters;
		if (clickedEvent.socialType === "twitter") {
			maxCharacters = 280;
		} else if (clickedEvent.socialType === "linkedin") {
			maxCharacters = 700;
		}

		return (
			<div className="modal" onClick={this.props.close}>
				<div className="modal-content" onClick={e => e.stopPropagation()}>
					<div className="modal-header">
						<FontAwesomeIcon icon={faTimes} className="close" size="2x" onClick={() => close()} />
					</div>
					<div className="modal-body">
						<Post
							setSaving={this.setSaving}
							post={clickedEvent}
							canEditPost={canEditPost}
							postFinishedSavingCallback={() => {
								savePostCallback();
								close();
							}}
							accounts={accounts}
							timezone={timezone}
							maxCharacters={maxCharacters}
						/>
						{this.state.confirmDelete && (
							<ConfirmAlert
								close={() => this.setState({ confirmDelete: false })}
								title="Delete Post"
								message="Are you sure you want to delete this post?"
								callback={this.deletePost}
							/>
						)}
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
