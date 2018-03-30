import React, { Component } from "react";
import axios from "axios";
import ImagesDiv from "./ImagesDiv.js";

class CreateBlogComponent extends Component {
	state = {
		blogFile: undefined,
		blogImage: [],
		blogID: "",
		title: "",
		keyword1: "",
		keyword2: "",
		keyword3: "",
		keywordDifficulty1: "",
		keywordDifficulty2: "",
		keywordDifficulty3: "",
		keywordSearchVolume1: "",
		keywordSearchVolume2: "",
		keywordSearchVolume3: "",
		about: "",
		resources: "",
		postingDate: this.props.clickedCalendarDate,
		imagesToDelete: []
	};
	constructor(props) {
		super(props);
		this.setPostImages = this.setPostImages.bind(this);
		this.handleBlogFormChange = this.handleBlogFormChange.bind(this);
		this.pushToImageDeleteArray = this.pushToImageDeleteArray.bind(this);
	}
	fillBlogForm(blog) {
		var imageArray = [];
		if (blog.image) imageArray.push(blog.image);
		this.setState({
			blogID: blog._id || "",
			title: blog.title || "",
			keyword1: blog.keywords[0].keyword || "",
			keyword2: blog.keywords[1].keyword || "",
			keyword3: blog.keywords[2].keyword || "",
			keywordDifficulty1: blog.keywords[0].keywordDifficulty || "",
			keywordDifficulty2: blog.keywords[1].keywordDifficulty || "",
			keywordDifficulty3: blog.keywords[2].keywordDifficulty || "",
			keywordSearchVolume1: blog.keywords[0].keywordSearchVolume || "",
			keywordSearchVolume2: blog.keywords[1].keywordSearchVolume || "",
			keywordSearchVolume3: blog.keywords[2].keywordSearchVolume || "",
			about: blog.about || "",
			resources: blog.resources || "",
			postingDate: blog.postingDate || "",
			blogImage: imageArray,
			blogFile: blog.wordDoc
		});
	}

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
		if (this.state.blogImage.length > 0) image = this.state.blogImage[0].image;

		formData.append("postingDate", this.state.postingDate);
		formData.append("title", this.state.title);
		formData.append("image", image);
		formData.append("blogFile", this.state.blogFile);
		formData.append("keyword1", this.state.keyword1);
		formData.append("keyword2", this.state.keyword2);
		formData.append("keyword3", this.state.keyword3);
		formData.append("keywordDifficulty1", this.state.keywordDifficulty1);
		formData.append("keywordDifficulty2", this.state.keywordDifficulty2);
		formData.append("keywordDifficulty3", this.state.keywordDifficulty3);
		formData.append("keywordSearchVolume1", this.state.keywordSearchVolume1);
		formData.append("keywordSearchVolume2", this.state.keywordSearchVolume2);
		formData.append("keywordSearchVolume3", this.state.keywordSearchVolume3);
		formData.append("resources", this.state.resources);
		formData.append("about", this.state.about);
		formData.append("eventColor", "#e74c3c");
		for (var index in this.state.imagesToDelete) {
			axios.get("/api/delete/file/" + this.state.imagesToDelete[index].publicID).then(res => {});
		}
		// Check if we are updating a blog or creating a new blog
		if (this.state.blogID === "" || this.state.blogID === undefined || this.state.blogID === null) {
			axios.post("/api/blog", formData).then(res => {
				document.getElementById("postingModal").style.display = "none";
			});
		} else {
			axios.post("/api/blog/" + this.state.blogID, formData).then(res => {
				document.getElementById("BlogEdittingModal").style.display = "none";
			});
		}
	}

	handleBlogFormChange(event, stateVariable) {
		this.setState({ [stateVariable]: event.target.value });
	}
	setPostImages(imagesArray) {
		this.setState({ blogImage: imagesArray });
	}
	pushToImageDeleteArray(image) {
		var imagesToDeleteArray = this.state.imagesToDelete;
		imagesToDeleteArray.push(image);
		this.setState({ imagesToDelete: imagesToDeleteArray });
	}

	render() {
		var fileDiv;
		if (this.state.blogFile) {
			fileDiv = <h4>{this.state.blogFile.name}</h4>;
		}
		return (
			<div className="modal-body">
				<form id="createBlogForm" className="create-blog-form">
					<input
						value={this.state.title}
						onChange={event => this.handleBlogFormChange(event, "title")}
						type="text"
						placeholder="Working Title"
						className="create-blog-form-regular"
					/>
					<input
						value={this.state.keyword1}
						onChange={event => this.handleBlogFormChange(event, "keyword1")}
						type="text"
						placeholder="Keyword 1"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keywordDifficulty1}
						onChange={event => this.handleBlogFormChange(event, "keywordDifficulty1")}
						type="text"
						placeholder="Keyword Difficulty"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keywordSearchVolume1}
						onChange={event => this.handleBlogFormChange(event, "keywordSearchVolume1")}
						type="text"
						placeholder="Search Volume"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keyword2}
						onChange={event => this.handleBlogFormChange(event, "keyword2")}
						type="text"
						placeholder="Keyword 2"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keywordDifficulty2}
						onChange={event => this.handleBlogFormChange(event, "keywordDifficulty2")}
						type="text"
						placeholder="Keyword Difficulty"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keywordSearchVolume2}
						onChange={event => this.handleBlogFormChange(event, "keywordSearchVolume2")}
						type="text"
						placeholder="Search Volume"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keyword3}
						onChange={event => this.handleBlogFormChange(event, "keyword3")}
						type="text"
						placeholder="Keyword 3"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keywordDifficulty3}
						onChange={event => this.handleBlogFormChange(event, "keywordDifficulty3")}
						type="text"
						placeholder="Keyword Difficulty"
						className="create-blog-form-keyword"
					/>
					<input
						value={this.state.keywordSearchVolume3}
						onChange={event => this.handleBlogFormChange(event, "keywordSearchVolume3")}
						type="text"
						placeholder="Search Volume"
						className="create-blog-form-keyword"
					/>
					<textarea
						value={this.state.resources}
						onChange={event => this.handleBlogFormChange(event, "resources")}
						form="createBlogForm"
						placeholder="Resources"
						rows={2}
					/>
					<textarea
						value={this.state.about}
						onChange={event => this.handleBlogFormChange(event, "about")}
						form="createBlogForm"
						placeholder="About(notes)"
						rows={2}
					/>

					<ImagesDiv
						postImages={this.state.blogImage}
						setPostImages={this.setPostImages}
						imageLimit={1}
						divID={"blogImagesDiv"}
						pushToImageDeleteArray={this.pushToImageDeleteArray}
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
					{fileDiv}
				</form>
				<button onClick={event => this.saveBlog()}>Save Post</button>
			</div>
		);
	}
}

export default CreateBlogComponent;
