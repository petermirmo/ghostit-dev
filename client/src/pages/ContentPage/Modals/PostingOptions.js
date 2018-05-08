import React, { Component } from "react";
import axios from "axios";

import DatePicker from "../Divs/DatePicker.js";
import TimePicker from "../Divs/TimePicker.js";
import SelectAccountDiv from "../Divs/SelectAccountDiv/";
import Carousel from "../Divs/Carousel";
import ImagesDiv from "../Divs/ImagesDiv/";
import { savePost, postChecks, convertDateAndTimeToUtcTme, carouselOptions } from "../../../functions/CommonFunctions";

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
		time: this.props.post ? new Date(this.props.post.postingDate) : new Date(),
		date: this.props.post ? new Date(this.props.post.postingDate) : this.props.clickedCalendarDate,
		deleteImagesArray: [],
		linkImagesArray: [],
		timezone: "America/Vancouver"
	};
	constructor(props) {
		super(props);
		axios.get("/api/getTimezone").then(res => {
			let result = res.data;
			if (result.success) {
				this.setState({ timezone: result.timezone });
			}
		});
	}
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
			time: nextProps.post ? new Date(nextProps.post.postingDate) : new Date(),
			date: nextProps.post ? new Date(nextProps.post.postingDate) : nextProps.clickedCalendarDate,
			linkImagesArray: []
		});
	}
	componentDidMount() {
		this.findLink();
	}
	findLink = () => {
		if (this.refs.carousel) this.refs.carousel.findLink(this.state.contentValue);
	};
	setPostImages = imagesArray => {
		this.setState({ postImages: imagesArray });
	};

	linkPreviewSetState = (link, imagesArray) => {
		this.setState({ link: link, linkImagesArray: imagesArray });
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
						if (this.refs.carousel) this.refs.carousel.findLink(event.target.value);
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
				{linkPreviewCanShow && (
					<Carousel
						id="linkCarousel"
						ref="carousel"
						linkPreviewCanEdit={linkPreviewCanEdit && canEditPost}
						updateParentState={this.linkPreviewSetState}
						linkImagesArray={linkImagesArray}
						linkImage={linkImage}
					/>
				)}
				<DatePicker clickedCalendarDate={date} callback={this.handleChange} canEdit={canEditPost} />
				<TimePicker timeForPost={time} callback={this.handleChange} canEdit={canEditPost} />
				{canEditPost && (
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
				)}
			</div>
		);
	}
}

export default PostingOptions;
