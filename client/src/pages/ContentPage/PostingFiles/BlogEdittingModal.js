import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import axios from "axios";

import Notification from "../../../components/Notifications/Notification";
import ConfirmAlert from "../../../components/Notifications/ConfirmAlert";
import CreateBlog from "../../../components/CreateBlog/";
import Loader from "../../../components/Notifications/Loader/";
import "./styles/";

class BlogEdittingModal extends Component {
	state = {
		confirmDelete: false,
		notification: {},
		blog: this.props.clickedEvent,
		saving: false
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ blog: nextProps.clickedEvent });
	}
	deleteBlogPopUp = () => {
		this.setState({ confirmDelete: true });
	};
	deleteBlog = deleteBlog => {
		this.setState({ confirmDelete: false, saving: true });
		if (!this.state.blog) {
			alert("Error cannot find blog. Please contact our dev team immediately");
			return;
		}
		if (deleteBlog) {
			axios.delete("/api/blog/delete/" + this.state.blog._id).then(res => {
				if (res.data) {
					this.props.updateCalendarBlogs();
					this.props.close();
				} else {
					this.setState({
						notification: { on: true, notificationType: "danger", title: "Something went wrong", message: "" }
					});
				}
			});
		} else {
			this.setState({
				deleteBlog: false,
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
						<FontAwesomeIcon icon={faTimes} className="close-scroll" size="2x" onClick={() => this.props.close()} />
					</div>
					<CreateBlog
						blog={this.props.clickedEvent}
						callback={() => {
							this.props.updateCalendarBlogs();
							this.props.close();
						}}
						setSaving={this.setSaving}
					/>
					{this.state.confirmDelete && (
						<ConfirmAlert
							close={() => this.setState({ confirmDelete: false })}
							title="Delete Blog"
							message="Are you sure you want to delete this blog?"
							callback={this.deleteBlog}
						/>
					)}

					<div className="modal-footer">
						<FontAwesomeIcon onClick={this.deleteBlogPopUp} className="delete" icon={faTrash} size="2x" />
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
			</div>
		);
	}
}

export default BlogEdittingModal;
