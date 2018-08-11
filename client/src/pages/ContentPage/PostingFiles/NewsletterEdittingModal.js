import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import axios from "axios";

import Notification from "../../../components/Notifications/Notification";
import ConfirmAlert from "../../../components/Notifications/ConfirmAlert";
import CreateNewsletter from "../../../components/CreateNewsletter/";
import Loader from "../../../components/Notifications/Loader/";
import "./styles/";

class NewsletterEdittingModal extends Component {
	state = {
		confirmDelete: false,
		notification: {},
		newsletter: this.props.clickedEvent,
		saving: false
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ newsletter: nextProps.clickedEvent });
	}
	deleteNewsletterPopUp = () => {
		this.setState({ confirmDelete: true });
	};
	deleteNewsletter = deleteNewsletter => {
		this.setState({ confirmDelete: false, saving: true });
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
		} else {
			this.setState({
				confirmDelete: false,
				saving: false
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
			<div className="modal" onClick={this.props.close}>
				<div className="modal-content" onClick={e => e.stopPropagation()}>
					<div className="modal-header">
						<FontAwesomeIcon onClick={() => this.props.close()} className="close" icon={faTimes} size="2x" />
					</div>
					<div className="modal-body">
						<CreateNewsletter
							newsletter={this.props.clickedEvent}
							callback={() => {
								this.props.updateCalendarNewsletters();
								this.props.close();
							}}
							setSaving={this.setSaving}
						/>
					</div>

					<div className="modal-footer">
						<FontAwesomeIcon onClick={this.deleteNewsletterPopUp} className="delete" icon={faTrash} size="2x" />
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
				{this.state.confirmDelete && (
					<ConfirmAlert
						close={() => this.setState({ confirmDelete: false })}
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
