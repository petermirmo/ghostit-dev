import React, { Component } from "react";
import CreateBlog from "./CreateBlog.js";
import "../../css/modal.css";

class BlogEdittingModal extends Component {
	initialize(blog) {
		this.refs.refFillBlogForm.fillBlogForm(blog);
	}
	render() {
		return (
			<div id="BlogEdittingModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<div className="modal-body">
						<CreateBlog ref="refFillBlogForm" blog={this.props.blog} />
					</div>

					<div className="modal-footer" />
				</div>
			</div>
		);
	}
}

export default BlogEdittingModal;
