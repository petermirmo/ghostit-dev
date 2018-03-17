import React, { Component } from "react";
import axios from "axios";
import "../../css/theme.css";
import CreateBlog from "../forms/CreateBlog.js";

class BlogEdittingModal extends Component {
	render() {
		return (
			<div id="BlogEdittingModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center", width: "35%" }}>
					<div className="modal-header" />

					<div className="modal-body">
						<CreateBlog blog={this.props.blog} />
					</div>

					<div className="modal-footer" />
				</div>
			</div>
		);
	}
}

export default BlogEdittingModal;
