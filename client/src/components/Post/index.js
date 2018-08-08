import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
		images: this.props.post ? this.props.post.images : [],
		accountType: this.props.post ? this.props.post.accountType : "",
		socialType: this.props.post ? this.props.post.socialType : this.props.socialType,
		contentValue: this.props.post ? this.props.post.content : "",
		date: this.props.post
			? new moment(this.props.post.postingDate)
			: new moment() > new moment(this.props.clickedCalendarDate)
				? new moment()
				: new moment(this.props.clickedCalendarDate),
		deleteImagesArray: [],
		linkImagesArray: [],
		timezone: this.props.timezone,
		somethingChanged: false
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.campaignID) {
			let { campaignDateLowerBound, campaignDateUpperBound } = nextProps;
			let { date } = this.state;
			if (campaignDateLowerBound) {
				if (new moment(campaignDateLowerBound) > new moment(date)) {
					this.setState({ date: new moment(campaignDateLowerBound) });
				}
			}
			if (campaignDateUpperBound) {
				if (new moment(campaignDateUpperBound) < new moment(date)) {
					this.setState({ date: new moment(campaignDateUpperBound) });
				}
			}
		}

		if (nextProps.post) {
			this.setState({ contentValue: nextProps.post.content });
		} else {
			this.setState({ contentValue: "" });
		}

		if (nextProps.socialType !== this.state.socialType) {
			this.setState({ socialType: nextProps.socialType });
		}
	}
	componentDidMount() {
		this._ismounted = true;
		this.findLink(this.state.contentValue);

		let { campaignID, campaignDateLowerBound, campaignDateUpperBound } = this.props;
		let { date } = this.state;

		if (campaignID) {
			if (date < new moment(campaignDateLowerBound) || date > new moment(campaignDateUpperBound)) {
				this.setState({ date: new moment(campaignDateLowerBound) });
			}
		}
	}
	componentWillUnmount() {
		this._ismounted = false;
	}

	handleChange = (value, index) => {
		if (this._ismounted)
			this.setState({
				[index]: value,
				somethingChanged: true
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
			images,
			socialType,
			postingToAccountId,
			accountType,
			deleteImagesArray,
			somethingChanged
		} = this.state;
		let { date } = this.state;

		const { postFinishedSavingCallback, setSaving, accounts, canEditPost, maxCharacters, campaignID } = this.props;
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
						this.handleChange(event.target.value, "contentValue");
					}}
					value={contentValue}
					readOnly={!canEditPost}
				/>
				<div className="post-images-and-carousel">
					<ImagesDiv
						postImages={images}
						handleChange={images => this.handleChange(images, "images")}
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
								handleChange={image => this.handleChange(image, "linkImage")}
							/>
						)}
				</div>
				{maxCharacters && <div className="max-characters">{maxCharacters - contentValue.length}</div>}

				<SelectAccountDiv
					activePageAccountsArray={activePageAccountsArray}
					activeAccount={postingToAccountId}
					handleChange={account => {
						this.handleChange(account._id, "postingToAccountId");
						this.handleChange(account.accountType, "accountType");
					}}
					canEdit={canEditPost}
				/>
				<div className="time-picker-and-save-post">
					<DateTimePicker
						date={date}
						dateFormat="MMMM Do YYYY hh:mm A"
						handleChange={date => this.handleChange(date, "date")}
						style={{
							bottom: "-80px"
						}}
						canEdit={canEditPost}
						dateLowerBound={campaignID ? new moment(this.props.campaignDateLowerBound) : undefined}
						dateUpperBound={campaignID ? new moment(this.props.campaignDateUpperBound) : undefined}
					/>
					{canEditPost &&
						somethingChanged && (
							<button
								className="schedule-post-button"
								onClick={() => {
									let newDate = new moment(date).utcOffset(0);
									if (!postChecks(postingToAccountId, newDate, link, images, contentValue, maxCharacters)) {
										return;
									}

									setSaving();

									savePost(
										id,
										contentValue,
										newDate,
										link,
										linkImage,
										images,
										postingToAccountId,
										socialType,
										accountType,
										postFinishedSavingCallback,
										deleteImagesArray,
										campaignID
									);
									this.setState({ somethingChanged: false });
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

function mapStateToProps(state) {
	return {
		campaignDateLowerBound: state.campaignDateLowerBound,
		campaignDateUpperBound: state.campaignDateUpperBound
	};
}
export default connect(mapStateToProps)(PostingOptions);
