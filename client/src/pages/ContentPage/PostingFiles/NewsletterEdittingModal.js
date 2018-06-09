import React, { Component } from "react";
import axios from "axios";

import "font-awesome/css/font-awesome.min.css";

import Notification from "../../../components/Notifications/Notification";
import ConfirmAlert from "../../../components/Notifications/ConfirmAlert";
import CreateNewsletter from "./CreateNewsletter/";
import Loader from "../../../components/Notifications/Loader/";
import "./style.css";

class NewsletterEdittingModal extends Component {
	state = {
		deleteNewsletter: false,
		notification: {},
		newsletter: this.props.clickedPost,
		saving: false
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ newsletter: nextProps.clickedPost });
	}
	deleteNewsletterPopUp = () => {
		this.setState({ deleteNewsletter: true });
	};
	deleteNewsletter = deleteNewsletter => {
		this.setState({ deleteNewsletter: false, saving: true });
		if (!this.state.newsletter) {
			alert("Error cannot find newsletter. Please contact our dev team immediately");
			return;
		}
		if (deleteNewsletter) {
			axios.delete("/api/newsletter/delete/" + this.state.newsletter._id).then(res => {
				if (res.data) {
					this.props.updateCalendarNewsletters();
					this.props.close();
				} else {
					this.setState({
						notification: { on: true, notificationType: "danger", title: "Something went wrong", message: "" }
					});
				}
			});
		}
	};
	hideNotification = () => {
		this.setState({ notification: {} });
	};
	setSaving = () => {
		this.setState({ saving: true });
	};
	render() {
		if (this.state.saving) {
			return <Loader />;
		}
		return (
			<div className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<div className="modal-header">
						<span className="close-dark fa fa-times" onClick={() => this.props.close()} />
					</div>
					<div className="modal-body">
						<CreateNewsletter
							newsletter={this.props.clickedPost}
							callback={() => {
								this.props.updateCalendarNewsletters();
								this.props.close();
							}}
							setSaving={this.setSaving}
						/>
					</div>

					<div className="modal-footer">
						<button onClick={this.deleteNewsletterPopUp} className="fa fa-trash fa-2x delete" />
					</div>
				</div>
				{this.state.notification.on && (
					<Notification
						notificationType={this.state.notification.notificationType}
						title={this.state.notification.title}
						message={this.state.notification.message}
						callback={this.hideNotification}
					/>
				)}
				{this.state.deleteNewsletter && (
					<ConfirmAlert
						title="Delete Newsletter"
						message="Are you sure you want to delete this newsletter?"
						callback={this.deleteNewsletter}
					/>
				)}
			</div>
		);
	}
}

export default NewsletterEdittingModal;
