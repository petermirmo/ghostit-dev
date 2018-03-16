import React, { Component } from "react";
import axios from "axios";

class CreateBlogComponent extends Component {
	state = {
		blogFile: undefined
	};
	showFile(event) {
		let reader = new FileReader();
		let blogFile = event.target.files[0];

		if (blogFile === undefined) {
			return;
		}

		var ext = blogFile.name.split(".").pop();
		if (ext !== "pdf" && ext !== "docx" && ext !== "doc") {
			alert("Only pdf, docx or doc files can be uploaded! Nice try though ;)");
			return;
		}

		reader.onloadend = () => {
			blogFile.localPath = reader.result;
			this.setState({ blogFile: blogFile });
		};

		reader.readAsDataURL(blogFile);
	}
	saveBlog() {
		var formData = new FormData();
		var image;
		if (this.props.postImages[0] !== undefined) {
			image = this.props.postImages[0].image;
		}
		formData.append("postingDate", this.props.clickedCalendarDate);
		formData.append("title", document.getElementById("workingTitle").value);
		formData.append("image", image);
		formData.append("blogFile", this.state.blogFile);
		formData.append("keyword1", document.getElementById("keyword1").value);
		formData.append("keyword2", document.getElementById("keyword2").value);
		formData.append("keyword3", document.getElementById("keyword3").value);
		formData.append("keywordDifficulty1", document.getElementById("keywordDifficulty1").value);
		formData.append("keywordDifficulty2", document.getElementById("keywordDifficulty2").value);
		formData.append("keywordDifficulty3", document.getElementById("keywordDifficulty3").value);
		formData.append("keywordSearchVolume1", document.getElementById("keywordSearchVolume1").value);
		formData.append("keywordSearchVolume2", document.getElementById("keywordSearchVolume2").value);
		formData.append("keywordSearchVolume3", document.getElementById("keywordSearchVolume3").value);
		formData.append("resources", document.getElementById("resources").value);
		formData.append("about", document.getElementById("about").value);
		formData.append("eventColor", "#e74c3c");

		axios.post("/api/blog", formData).then(res => {
			document.getElementById("postingModal").style.display = "none";
		});
	}
	render() {
		return (
			<div className="modal-body">
				<form id="createBlogForm" className="create-blog-form">
					<input
						id="workingTitle"
						type="text"
						name="title"
						placeholder="Working Title"
						align="left"
						className="create-blog-form-regular"
					/>
					<input
						id="keyword1"
						type="text"
						name="keyword1"
						placeholder="Keyword 1"
						className="create-blog-form-keyword"
					/>
					<input
						id="keywordDifficulty1"
						type="text"
						name="keywordDifficulty1"
						placeholder="Keyword Difficulty"
						className="create-blog-form-keyword"
					/>
					<input
						id="keywordSearchVolume1"
						type="text"
						name="keywordSearchVolume1"
						placeholder="Search Volume"
						className="create-blog-form-keyword"
					/>
					<input
						id="keyword2"
						type="text"
						name="keyword2"
						placeholder="Keyword 2"
						className="create-blog-form-keyword"
					/>
					<input
						id="keywordDifficulty2"
						type="text"
						name="keywordDifficulty2"
						placeholder="Keyword Difficulty"
						className="create-blog-form-keyword"
					/>
					<input
						id="keywordSearchVolume2"
						type="text"
						name="keywordSearchVolume2"
						placeholder="Search Volume"
						className="create-blog-form-keyword"
					/>
					<input
						id="keyword3"
						type="text"
						name="keyword3"
						placeholder="Keyword 3"
						className="create-blog-form-keyword"
					/>
					<input
						id="keywordDifficulty3"
						type="text"
						name="keywordDifficulty3"
						placeholder="Keyword Difficulty"
						className="create-blog-form-keyword"
					/>
					<input
						id="keywordSearchVolume3"
						type="text"
						name="keywordSearchVolume3"
						placeholder="Search Volume"
						className="create-blog-form-keyword"
					/>
					<textarea id="resources" form="createBlogForm" name="resources" placeholder="Resources" rows={2} />
					<textarea id="about" form="createBlogForm" name="about" placeholder="About(notes)" rows={2} />
					<label
						htmlFor="blogUploadImage"
						className="custom-file-upload"
						style={{ marginBottom: "5px", marginTop: "5px" }}
					>
						Upload an image!
					</label>
					{this.props.imagesDiv}
					<input
						id="blogUploadImage"
						type="file"
						name="blogImage"
						placeholder="Working Title"
						className="create-blog-form-regular"
						onChange={event => {
							this.props.showImages(event);
						}}
					/>
					<label
						htmlFor="blogUploadWordDoc"
						className="custom-file-upload"
						style={{ marginBottom: "10px", marginTop: "5px" }}
					>
						Upload Word Document
					</label>
					<input
						id="blogUploadWordDoc"
						type="file"
						name="blogWordDoc"
						placeholder="Working Title"
						className="create-blog-form-regular"
						onChange={event => this.showFile(event)}
					/>
				</form>
				<h4 id="test" />
				<button onClick={() => this.saveBlog()}>Save Post</button>
			</div>
		);
	}
}

export default CreateBlogComponent;
