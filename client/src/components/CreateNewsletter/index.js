import React, { Component } from "react";
import Textarea from "react-textarea-autosize";
import moment from "moment-timezone";
import axios from "axios";

import DateTimePicker from "../DateTimePicker";
import "./styles/";

class CreateNewsletter extends Component {
	state = {
		newsletter: this.props.newsletter
			? this.props.newsletter
			: {
					_id: undefined,
					notes: "",
					dueDate: this.props.postingDate,
					postingDate: this.props.postingDate
			  },
		newsletterFile: {},
		saving: false
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.newsletter) {
			this.setState({
				newsletter: nextProps.newsletter,
				newsletterFile: {},
				saving: false
			});
		} else {
			this.setState({
				newsletter: {
					_id: undefined,
					notes: "",
					dueDate: nextProps.postingDate,
					postingDate: nextProps.postingDate
				},
				newsletterFile: {},
				saving: false
			});
		}
	}

	saveNewsletter = () => {
		let { newsletter, newsletterFile } = this.state;

		this.props.setSaving();

		// Check if we are updating a newsletter or creating a new newsletter

		if (!newsletter._id) {
			axios
				.post("/api/newsletter", {
					newsletter: newsletter,
					newsletterFile: newsletterFile,
					newsletterFileName: newsletterFile.name
				})
				.then(res => {
					this.props.callback();
				});
		} else {
			axios
				.post("/api/newsletter/" + newsletter._id, {
					newsletter: newsletter,
					newsletterFile: newsletterFile,
					newsletterFileName: newsletterFile.name
				})
				.then(res => {
					this.props.callback();
				});
		}
	};

	showFile = event => {
		let reader = new FileReader();
		let newsletterFile = event.target.files[0];

		if (newsletterFile === undefined) {
			alert("Could not read file!");
			return;
		}

		let ext = newsletterFile.name.split(".").pop();

		if (ext !== "pdf" && ext !== "docx" && ext !== "doc") {
			alert("Only pdf, docx or doc files can be uploaded! Nice try though ;)");
			return;
		}

		reader.onloadend = () => {
			newsletterFile.localPath = reader.result;
			this.setState({ newsletterFile: newsletterFile });
		};

		reader.readAsDataURL(newsletterFile);
	};

	handleBlogFormChange = (value, index, secondIndex, thirdIndex) => {
		let { newsletter } = this.state;
		if (thirdIndex) {
			newsletter[index][secondIndex][thirdIndex] = value;
		} else if (secondIndex) {
			newsletter[index][secondIndex] = value;
		} else if (index) {
			newsletter[index] = value;
		}
		this.setState({ newsletter: newsletter });
	};
	render() {
		const { newsletter, newsletterFile } = this.state;
		let { postingDate, dueDate } = newsletter;

		postingDate = new moment(postingDate);
		dueDate = new moment(dueDate);

		let fileDiv;
		if (newsletter.wordDoc) {
			fileDiv = (
				<a download href={newsletter.wordDoc.url} className="uploaded-file">
					{newsletter.wordDoc.name}
				</a>
			);
		}
		if (newsletterFile.name) {
			fileDiv = <h4 className="uploaded-file">{newsletterFile.name}</h4>;
		}
		return (
			<div className="modal-body">
				<div className="create-placeholder-form">
					<Textarea
						value={newsletter.notes}
						onChange={event => this.handleBlogFormChange(event.target.value, "notes")}
						placeholder="Notes"
						className="newsletter-about create-placeholder-form-textarea"
					/>
					<div className="dates-container">
						<p className="blog-date-label">Due Date:</p>
						<DateTimePicker
							date={dueDate}
							handleChange={date => this.handleBlogFormChange(date, "dueDate")}
							dateFormat="MMMM Do YYYY"
							dateLowerBound={new moment()}
						/>
						<p className="blog-date-label">Posting Date:</p>
						<DateTimePicker
							date={postingDate}
							handleChange={date => this.handleBlogFormChange(date, "postingDate")}
							dateFormat="MMMM Do YYYY"
							dateLowerBound={new moment()}
						/>
					</div>
					<div className="image-file-save-container">
						<label htmlFor="newsletterUploadWordDoc" className="custom-file-upload">
							Upload Word Document or pdf
						</label>
						<input
							id="newsletterUploadWordDoc"
							type="file"
							name="newsletterWordDoc"
							placeholder="Working Title"
							className="create-newsletter-form-regular"
							onChange={event => this.showFile(event)}
						/>
						{fileDiv}

						<button className="blog-save-button" onClick={event => this.saveNewsletter()}>
							Schedule Newsletter Reminder!
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default CreateNewsletter;
