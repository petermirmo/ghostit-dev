import React, { Component } from "react";
import Textarea from "react-textarea-autosize";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";

import ImagesDiv from "../../Divs/ImagesDiv/";
import "./style.css";

class CreateBlogComponent extends Component {
	state = {
		blog: this.props.blog
			? this.props.blog
			: {
					_id: undefined,
					title: "",
					keywords: [
						{ keyword: "", keywordDifficulty: 0, keywordSearchVolume: 0 },
						{ keyword: "", keywordDifficulty: 0, keywordSearchVolume: 0 },
						{ keyword: "", keywordDifficulty: 0, keywordSearchVolume: 0 }
					],

					about: "",
					resources: "",
					dueDate: this.props.postingDate,
					postingDate: this.props.postingDate
				},
		blogImages: [],
		blogFile: {},
		imagesToDelete: [],
		saving: false
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.blog) {
			this.setState({ blog: nextProps.blog, blogImages: [], blogFile: {}, imagesToDelete: [], saving: false });
		} else {
			this.setState({
				blog: {
					_id: undefined,
					title: "",
					keywords: [
						{ keyword: "", keywordDifficulty: 0, keywordSearchVolume: 0 },
						{ keyword: "", keywordDifficulty: 0, keywordSearchVolume: 0 },
						{ keyword: "", keywordDifficulty: 0, keywordSearchVolume: 0 }
					],

					about: "",
					resources: "",
					dueDate: nextProps.postingDate,
					postingDate: nextProps.postingDate
				},
				blogImages: [],
				blogFile: {},
				imagesToDelete: [],
				saving: false
			});
		}
	}

	saveBlog = () => {
		let { blog, imagesToDelete, blogImages, blogFile } = this.state;

		this.props.setSaving();

		blog.eventColor = "#e74c3c";

		for (let index in imagesToDelete) {
			axios.delete("/api/delete/file/" + imagesToDelete[index].publicID).then(res => {});
		}
		// Check if we are updating a blog or creating a new blog

		if (!blog._id) {
			axios
				.post("/api/blog", { blog: blog, blogImages: blogImages, blogFile: blogFile, blogFileName: blogFile.name })
				.then(res => {
					this.props.callback();
				});
		} else {
			axios
				.post("/api/blog/" + blog._id, {
					blog: blog,
					blogImages: blogImages,
					blogFile: blogFile,
					blogFileName: blogFile.name
				})
				.then(res => {
					this.props.callback();
				});
		}
	};

	showFile = event => {
		let reader = new FileReader();
		let blogFile = event.target.files[0];

		if (blogFile === undefined) {
			alert("Could not read file!");
			return;
		}

		let ext = blogFile.name.split(".").pop();

		if (ext !== "pdf" && ext !== "docx" && ext !== "doc") {
			alert("Only pdf, docx or doc files can be uploaded! Nice try though ;)");
			return;
		}

		reader.onloadend = () => {
			blogFile.localPath = reader.result;
			this.setState({ blogFile: blogFile });
		};

		reader.readAsDataURL(blogFile);
	};

	handleBlogFormChange = (value, index, secondIndex, thirdIndex) => {
		let { blog } = this.state;
		if (thirdIndex) {
			blog[index][secondIndex][thirdIndex] = value;
		} else if (secondIndex) {
			blog[index][secondIndex] = value;
		} else if (index) {
			blog[index] = value;
		}
		this.setState({ blog: blog });
	};
	setPostImages = imagesArray => {
		this.setState({ blogImages: imagesArray });
	};
	pushToImageDeleteArray = image => {
		let { imagesToDelete, blog } = this.state;
		imagesToDelete.push(image);
		blog.image = undefined;
		this.setState({ imagesToDelete: imagesToDelete, blog: blog, blogImages: [] });
	};

	render() {
		const { blog, blogFile, blogImages } = this.state;
		let { postingDate, dueDate } = blog;

		postingDate = new moment(postingDate);
		dueDate = new moment(dueDate);

		let fileDiv;
		if (blog.wordDoc) {
			fileDiv = (
				<a download href={blog.wordDoc.url}>
					{blog.wordDoc.name}
				</a>
			);
		}
		if (blogFile.name) {
			fileDiv = <h4>{blogFile.name}</h4>;
		}
		let images = [];
		if (blog.image) {
			images.push(blog.image);
		} else if (blogImages) {
			images = blogImages;
		}
		return (
			<div className="modal-body">
				<form className="create-placeholder-form">
					<input
						value={blog.title ? blog.title : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "title")}
						type="text"
						placeholder="Working Title"
						className="create-placeholder-form-regular"
					/>
					<input
						value={blog.keywords[0].keyword ? blog.keywords[0].keyword : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 0, "keyword")}
						type="text"
						placeholder="Keyword"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[0].keywordDifficulty ? blog.keywords[0].keywordDifficulty : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 0, "keywordDifficulty")}
						type="number"
						placeholder="Keyword Difficulty"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[0].keywordSearchVolume ? blog.keywords[0].keywordSearchVolume : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 0, "keywordSearchVolume")}
						type="number"
						placeholder="Search Volume"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[1].keyword ? blog.keywords[1].keyword : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 1, "keyword")}
						type="text"
						placeholder="Keyword"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[1].keywordDifficulty ? blog.keywords[1].keywordDifficulty : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 1, "keywordDifficulty")}
						type="number"
						placeholder="Keyword Difficulty"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[1].keywordSearchVolume ? blog.keywords[1].keywordSearchVolume : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 1, "keywordSearchVolume")}
						type="number"
						placeholder="Search Volume"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[2].keyword ? blog.keywords[2].keyword : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 2, "keyword")}
						type="text"
						placeholder="Keyword"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[2].keywordDifficulty ? blog.keywords[2].keywordDifficulty : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 2, "keywordDifficulty")}
						type="number"
						placeholder="Keyword Difficulty"
						className="create-placeholder-form-keyword"
					/>
					<input
						value={blog.keywords[2].keywordSearchVolume ? blog.keywords[2].keywordSearchVolume : ""}
						onChange={event => this.handleBlogFormChange(event.target.value, "keywords", 2, "keywordSearchVolume")}
						type="number"
						placeholder="Search Volume"
						className="create-placeholder-form-keyword"
					/>
					<Textarea
						value={blog.resources}
						onChange={event => this.handleBlogFormChange(event.target.value, "resources")}
						placeholder="Resources"
					/>
					<Textarea
						value={blog.about}
						onChange={event => this.handleBlogFormChange(event.target.value, "about")}
						placeholder="About(notes)"
					/>
					<p className="date-label">Due Date:</p>
					<DatePicker
						className="date-picker center"
						selected={dueDate}
						onChange={date => this.handleBlogFormChange(date, "dueDate")}
						dateFormat="MMMM Do YYYY"
					/>
					<p className="date-label">Posting Date:</p>
					<DatePicker
						className="date-picker center"
						selected={postingDate}
						onChange={date => this.handleBlogFormChange(date, "postingDate")}
						dateFormat="MMMM Do YYYY"
					/>
					<ImagesDiv
						postImages={images}
						setPostImages={this.setPostImages}
						imageLimit={1}
						divID={"blogImagesDiv"}
						pushToImageDeleteArray={this.pushToImageDeleteArray}
						canEdit={true}
					/>
					<label
						htmlFor="blogUploadWordDoc"
						className="custom-file-upload"
						style={{ marginBottom: "10px", marginTop: "5px" }}
					>
						Upload Word Document or pdf
					</label>
					<input
						id="blogUploadWordDoc"
						type="file"
						name="blogWordDoc"
						placeholder="Working Title"
						className="create-placeholder-form-regular"
						onChange={event => this.showFile(event)}
					/>
					{fileDiv}
				</form>
				<button className="bright-save-button" onClick={event => this.saveBlog()}>
					Save Blog
				</button>
			</div>
		);
	}
}

export default CreateBlogComponent;
