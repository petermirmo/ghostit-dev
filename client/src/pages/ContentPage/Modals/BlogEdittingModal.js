import React, { Component } from "react";
import axios from "axios";

import "../../../css/modal.css";
import "font-awesome/css/font-awesome.min.css";

import Notification from "../../../components/Notification";
import ConfirmAlert from "../../../components/ConfirmAlert";
import CreateBlog from "./CreateBlog.js";

class BlogEdittingModal extends Component {
	state = {
		deletePost: false,
		notification: {},
		blog: this.props.clickedCalendarEvent
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ blog: nextProps.clickedCalendarEvent });
	}
	deleteBlogPopUp = () => {
		this.setState({ deletePost: true });
	};
	deleteBlog = deleteBlog => {
		this.setState({ deletePost: false });
		if (!this.state.blog) {
			alert("Error cannot find blog. Please contact our dev team immediately");
			return;
		}
		if (deleteBlog) {
			axios.delete("/api/blog/delete/" + this.state.blog._id).then(res => {
				if (res.data) {
					this.props.updateCalendarBlogs();
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
	render() {
		return (
			<div id="BlogEdittingModal" className="modal">
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
						title="Delete Blog"
						message="Are you sure you want to delete this blog?"
						callback={this.deleteBlog}
					/>
				)}
				<div className="modal-content" style={{ textAlign: "center" }}>
					<div className="modal-header">
						<span className="close-dark" onClick={() => this.props.close("blogEdittingModal")}>
							&times;
						</span>
					</div>
					<div className="modal-body">
						<CreateBlog blog={this.props.clickedCalendarEvent} updateCalendarBlogs={this.props.updateCalendarBlogs} />
					</div>

					<div className="modal-footer">
						<button onClick={this.deleteBlogPopUp} className="fa fa-trash fa-2x delete" />
					</div>
				</div>
			</div>
		);
	}
}

export default BlogEdittingModal;
