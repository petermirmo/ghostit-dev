import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";
import axios from "axios";

import DateTimePicker from "../DateTimePicker";
import SelectAccountDiv from "../SelectAccountDiv/";
import Carousel from "../Carousel";
import ImagesDiv from "../ImagesDiv/";
import { savePost, postChecks, carouselOptions } from "../../extra/functions/CommonFunctions";

import "./styles";

class PostingOptions extends Component {
	state = {
		id: this.props.post ? this.props.post._id : undefined,
		postingToAccountId: this.props.post ? this.props.post.accountID : "",
		link: this.props.post ? this.props.post.link : "",
		linkImage: this.props.post ? this.props.post.linkImage : "",
		postImages: this.props.post ? this.props.post.images : [],
		accountType: this.props.post ? this.props.post.accountType : "",
		socialType: this.props.post ? this.props.post.socialType : this.props.socialType,
		contentValue: this.props.post ? this.props.post.content : "",
		date: this.props.post ? moment(this.props.post.postingDate) : this.props.clickedCalendarDate,
		deleteImagesArray: [],
		linkImagesArray: [],
		timezone: this.props.timezone
	};
	componentWillReceiveProps(nextProps) {
		if (this._ismounted)
			this.setState({
				id: nextProps.post ? nextProps.post._id : undefined,
				postingToAccountId: nextProps.post ? nextProps.post.accountID : "",
				link: nextProps.post ? nextProps.post.link : "",
				linkImage: nextProps.post ? nextProps.post.linkImage : "",
				postImages: nextProps.post ? nextProps.post.images : [],
				accountType: nextProps.post ? nextProps.post.accountType : "",
				socialType: nextProps.post ? nextProps.post.socialType : nextProps.socialType,
				contentValue: nextProps.post ? nextProps.post.content : "",
				date: nextProps.post ? moment(nextProps.post.postingDate) : nextProps.clickedCalendarDate,
				linkImagesArray: []
			});
	}
	componentDidMount() {
		this._ismounted = true;
		this.findLink(this.state.contentValue);
	}
	componentWillUnmount() {
		this._ismounted = false;
	}

	setPostImages = imagesArray => {
		if (this._ismounted) this.setState({ postImages: imagesArray });
	};

	handleChange = (index, value) => {
		if (this._ismounted)
			this.setState({
				[index]: value
			});
	};

	updatePostingAccount = account => {
		if (this._ismounted)
			this.setState({
				postingToAccountId: account._id,
				accountType: account.accountType
			});
	};
	pushToImageDeleteArray = image => {
		let temp = this.state.deleteImagesArray;
		temp.push(image);
		if (this._ismounted) this.setState({ deleteImagesArray: temp });
	};
	findLink(textAreaString) {
		// Url regular expression
		let urlRegularExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

		let regex = new RegExp(urlRegularExpression);

		// Finds url
		let match = textAreaString.match(regex);

		let link;
		// Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
		if (match) {
			link = match[0];
			this.getDataFromURL(link);
		} else {
			this.setState({ link: "" });
		}
	}
	getDataFromURL = newLink => {
		let { linkImage, link } = this.state;
		axios.post("/api/link", { link: newLink }).then(res => {
			let { loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();
			if (this._ismounted && res.data) {
				if (!linkImage) linkImage = res.data[0];
				if (link !== newLink) linkImage = res.data[0];
				this.setState({ link: newLink, linkImagesArray: res.data, linkImage: linkImage });
			}
		});
	};

	render() {
		const {
			id,
			contentValue,
			link,
			linkImage,
			linkImagesArray,
			postImages,
			postingToAccountId,
			accountType,
			socialType,
			deleteImagesArray
		} = this.state;
		let { date } = this.state;

		const { postFinishedSavingCallback, setSaving, accounts, canEditPost, maxCharacters } = this.props;
		const returnOfCarouselOptions = carouselOptions(socialType);

		const linkPreviewCanShow = returnOfCarouselOptions[0];
		const linkPreviewCanEdit = returnOfCarouselOptions[1];

		// Loop through all accounts
		let activePageAccountsArray = [];
		if (canEditPost) {
			for (let index in accounts) {
				// Check if the account is the same as active tab
				if (accounts[index].socialType === socialType) {
					activePageAccountsArray.push(accounts[index]);
				}
			}
		} else {
			for (let index in accounts) {
				let account = accounts[index];
				if (account._id === postingToAccountId) {
					activePageAccountsArray.push(account);
				}
			}
		}

		return (
			<div className="posting-form">
				<Textarea
					className="posting-textarea"
					placeholder="Success doesn't write itself!"
					onChange={event => {
						this.findLink(event.target.value);
						this.handleChange("contentValue", event.target.value);
					}}
					value={contentValue}
					readOnly={!canEditPost}
				/>
				<div className="post-images-and-carousel">
					<ImagesDiv
						postImages={postImages}
						setPostImages={this.setPostImages}
						imageLimit={4}
						canEdit={canEditPost}
						pushToImageDeleteArray={this.pushToImageDeleteArray}
					/>
					{linkPreviewCanShow &&
						link && (
							<Carousel
								linkPreviewCanEdit={linkPreviewCanEdit && canEditPost}
								linkImagesArray={linkImagesArray}
								linkImage={linkImage}
								handleChange={this.handleChange}
							/>
						)}
				</div>
				{maxCharacters && <div className="max-characters">{maxCharacters - contentValue.length}</div>}

				<SelectAccountDiv
					activePageAccountsArray={activePageAccountsArray}
					activeAccount={postingToAccountId}
					setActiveAccount={this.updatePostingAccount}
					canEdit={canEditPost}
				/>
				<div className="time-picker-and-save-post">
					<DateTimePicker
						date={date}
						dateFormat="MMMM Do YYYY hh:mm A"
						onChange={date => this.handleChange("date", date)}
						style={{
							bottom: "-80px"
						}}
						canEdit={canEditPost}
					/>
					{canEditPost && (
						<button
							className="schedule-post-button"
							onClick={() => {
								let newDate = new moment(date).utcOffset(0);
								if (!postChecks(postingToAccountId, newDate, link, postImages, contentValue, maxCharacters)) {
									return;
								}

								setSaving();

								savePost(
									id,
									contentValue,
									newDate,
									link,
									linkImage,
									postImages,
									postingToAccountId,
									socialType,
									accountType,
									postFinishedSavingCallback,
									deleteImagesArray
								);
							}}
						>
							Schedule Post!
						</button>
					)}
				</div>
			</div>
		);
	}
}
export default PostingOptions;
