import React, { Component } from "react";

import { connect } from "react-redux";

import DatePicker from "../Divs/DatePicker.js";
import TimePicker from "../Divs/TimePicker.js";
import SelectAccountDiv from "../Divs/SelectAccountDiv/";
import Carousel from "../Divs/Carousel";
import ImagesDiv from "../Divs/ImagesDiv/";
import { savePost, postChecks, convertDateAndTimeToUtcTme, carouselOptions } from "../../../functions/CommonFunctions";

class PostingOptions extends Component {
	state = {
		postingToAccountId: "",
		link: "",
		postImages: [],
		accountType: "",
		contentValue: "",
		time: new Date(),
		date: this.props.clickedCalendarDate
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

	savePostCallback = () => {
		this.setState({
			linkImagesArray: [],
			link: "",
			postImages: []
		});
	};
	updatePostingAccount = account => {
		this.setState({
			postingToAccountId: account._id,
			socialType: account.socialType,
			accountType: account.accountType
		});
	};
	render() {
		const { contentValue, link, time, postImages, postingToAccountId, accountType, date } = this.state;
		const { postFinishedSavingCallback, setSaving, accounts, socialType, user } = this.props;
		const returnOfCarouselOptions = carouselOptions(socialType);

		const linkPreviewCanShow = returnOfCarouselOptions[0];
		const linkPreviewCanEdit = returnOfCarouselOptions[1];

		return (
			<div>
				<textarea
					className="posting-textarea"
					rows={5}
					placeholder="Success doesn't write itself!"
					onChange={event => {
						this.refs.carousel.findLink(event.target.value);
						this.handleChange("contentValue", event.target.value);
					}}
					value={contentValue}
				/>
				<ImagesDiv postImages={postImages} setPostImages={this.setPostImages} imageLimit={4} canDeleteImage={true} />

				<SelectAccountDiv
					callback={this.updatePostingAccount}
					activePageAccountsArray={accounts}
					activeAccount={postingToAccountId}
					setActiveAccount={this.handleChange}
				/>
				{linkPreviewCanShow && (
					<Carousel
						linkPreviewCanEdit={linkPreviewCanEdit}
						linkPreviewCanShow={linkPreviewCanShow}
						ref="carousel"
						updateParentState={this.linkPreviewSetState}
						id="linkCarousel"
					/>
				)}
				<DatePicker clickedCalendarDate={date} callback={this.handleChange} />
				<TimePicker timeForPost={time} callback={this.handleChange} />
				<button
					onClick={() => {
						let dateToPostInUtcTime = convertDateAndTimeToUtcTme(date, time, user.timezone);

						if (!postChecks(postingToAccountId, dateToPostInUtcTime, link, postImages, contentValue)) {
							return;
						}
						setSaving();
						savePost(
							contentValue,
							dateToPostInUtcTime,
							link,
							postImages,
							postingToAccountId,
							socialType,
							accountType,
							postFinishedSavingCallback
						);
					}}
				>
					Save Post
				</button>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		accounts: state.accounts
	};
}
export default connect(mapStateToProps)(PostingOptions);
