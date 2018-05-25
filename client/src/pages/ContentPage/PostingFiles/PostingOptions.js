import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import DatePicker from "../Divs/DatePicker";
import TimePicker from "../Divs/TimePicker";
import SelectAccountDiv from "../Divs/SelectAccountDiv/";
import Carousel from "../Divs/Carousel";
import ImagesDiv from "../Divs/ImagesDiv/";
import {
	savePost,
	postChecks,
	convertDateAndTimeToUtcTme,
	carouselOptions
} from "../../../extra/functions/CommonFunctions";

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
		time: this.props.post ? convertTimeAndDate(new Date(this.props.post.postingDate), this.props.timezone) : new Date(),
		date: this.props.post
			? convertTimeAndDate(new Date(this.props.post.postingDate), this.props.timezone)
			: this.props.clickedCalendarDate,
		deleteImagesArray: [],
		linkImagesArray: [],
		timezone: "America/Vancouver"
	};
	componentWillReceiveProps(nextProps) {
		this.setState({
			id: nextProps.post ? nextProps.post._id : undefined,
			postingToAccountId: nextProps.post ? nextProps.post.accountID : "",
			link: nextProps.post ? nextProps.post.link : "",
			linkImage: nextProps.post ? nextProps.post.linkImage : "",
			postImages: nextProps.post ? nextProps.post.images : [],
			accountType: nextProps.post ? nextProps.post.accountType : "",
			socialType: nextProps.post ? nextProps.post.socialType : nextProps.socialType,
			contentValue: nextProps.post ? nextProps.post.content : "",
			time: nextProps.post ? convertTimeAndDate(new Date(nextProps.post.postingDate), nextProps.timezone) : new Date(),
			date: nextProps.post
				? convertTimeAndDate(new Date(nextProps.post.postingDate), nextProps.timezone)
				: nextProps.clickedCalendarDate,
			linkImagesArray: []
		});
	}
	componentDidMount() {
		this.findLink(this.state.contentValue);
	}

	setPostImages = imagesArray => {
		this.setState({ postImages: imagesArray });
	};

	handleChange = (index, value) => {
		this.setState({
			[index]: value
		});
	};

	updatePostingAccount = account => {
		this.setState({
			postingToAccountId: account._id,
			accountType: account.accountType
		});
	};
	pushToImageDeleteArray = image => {
		let temp = this.state.deleteImagesArray;
		temp.push(image);
		this.setState({ deleteImagesArray: temp });
	};
	findLink(textAreaString) {
		// Url regular expression
		let urlRegularExpression = /((http|ftp|https):\\)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/;

		// Finds url
		let match = urlRegularExpression.exec(textAreaString);
		let link;

		// Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
		if (match !== null) {
			if (match[0].substring(0, 7) === "http://" || match[0].substring(0, 8) === "https://") {
				link = match[0];
			} else {
				link = "http://" + match[0];
			}
			this.getDataFromURL(link);
		}
	}
	getDataFromURL = link => {
		axios.post("/api/link", { link: link }).then(res => {
			this.setState({ link: link, linkImagesArray: res.data });
		});
	};

	render() {
		const {
			id,
			contentValue,
			link,
			linkImage,
			linkImagesArray,
			time,
			postImages,
			postingToAccountId,
			accountType,
			socialType,
			date,
			deleteImagesArray,
			timezone
		} = this.state;
		const { postFinishedSavingCallback, setSaving, accounts, canEditPost } = this.props;

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
				<textarea
					className="posting-textarea"
					rows={5}
					placeholder="Success doesn't write itself!"
					onChange={event => {
						this.findLink(event.target.value);
						this.handleChange("contentValue", event.target.value);
					}}
					value={contentValue}
					readOnly={!canEditPost}
				/>
				<ImagesDiv
					postImages={postImages}
					setPostImages={this.setPostImages}
					imageLimit={4}
					canEdit={canEditPost}
					pushToImageDeleteArray={this.pushToImageDeleteArray}
				/>

				<SelectAccountDiv
					activePageAccountsArray={activePageAccountsArray}
					activeAccount={postingToAccountId}
					setActiveAccount={this.updatePostingAccount}
					canEdit={canEditPost}
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
				<DatePicker clickedCalendarDate={date} callback={this.handleChange} canEdit={canEditPost} />
				<TimePicker timeForPost={time} callback={this.handleChange} canEdit={canEditPost} />

				{canEditPost && (
					<div className="save-post-button-background center">
						<button
							className="save-post-button center"
							onClick={() => {
								let dateToPostInUtcTime = convertDateAndTimeToUtcTme(date, time, timezone);

								if (!postChecks(postingToAccountId, dateToPostInUtcTime, link, postImages, contentValue)) {
									return;
								}

								setSaving();

								savePost(
									id,
									contentValue,
									dateToPostInUtcTime,
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
							Save Post
						</button>
					</div>
				)}
			</div>
		);
	}
}
function convertTimeAndDate(date, timezone) {
	// Don't mess with this date. Javascript dates are messed up and this makes it work.
	// It is complicated and weird. Do not touch it.
	let tempDate = new Date(
		moment(date)
			.toDate()
			.getTime() +
			moment()
				.tz(timezone)
				.utcOffset() *
				60 *
				1000 -
			moment()
				.tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
				.utcOffset() *
				60 *
				1000
	);
	return tempDate;
}

export default PostingOptions;
