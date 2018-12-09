import React, { Component } from "react";
import moment from "moment-timezone";
import "./style.css";

class InstagramPosting extends Component {
	state = {
		id: this.props.post ? this.props.post._id : undefined,
		postingToAccountId: this.props.post ? this.props.post.accountID : "",
		socialType: this.props.post ? this.props.post.socialType : this.props.socialType,
		time: this.props.post ? convertTimeAndDate(new Date(this.props.post.postingDate), this.props.timezone) : new Date(),
		date: this.props.post
			? convertTimeAndDate(new Date(this.props.post.postingDate), this.props.timezone)
			: this.props.clickedCalendarDate,
		deleteImagesArray: [],
		timezone: "America/Vancouver",
		contentValue: this.props.post ? this.props.post.content : "",
		postImages: this.props.post ? this.props.post.images : []
	};
	componentWillReceiveProps(nextProps) {
		this.setState({
			id: nextProps.post ? nextProps.post._id : undefined,
			postingToAccountId: nextProps.post ? nextProps.post.accountID : "",
			socialType: nextProps.post ? nextProps.post.socialType : nextProps.socialType,
			time: nextProps.post ? convertTimeAndDate(new Date(this.props.post.postingDate), nextProps.timezone) : new Date(),
			date: nextProps.post
				? convertTimeAndDate(new Date(nextProps.post.postingDate), nextProps.timezone)
				: nextProps.clickedCalendarDate,
			deleteImagesArray: [],
			timezone: "America/Vancouver",
			contentValue: nextProps.post ? nextProps.post.content : "",
			postImages: nextProps.post ? nextProps.post.images : []
		});
	}

	setPostImages = imagesArray => {
		this.setState({ postImages: imagesArray });
	};
	updatePostingAccount = account => {
		this.setState({
			postingToAccountId: account._id,
			accountType: account.accountType
		});
	};

	handleChange = (index, value) => {
		this.setState({
			[index]: value
		});
	};
	pushToImageDeleteArray = image => {
		let temp = this.state.deleteImagesArray;
		temp.push(image);
		this.setState({ deleteImagesArray: temp });
	};
	render() {
		/*	const {
			id,
			contentValue,
			time,
			date,
			postImages,
			postingToAccountId,
			socialType,
			deleteImagesArray,
			timezone
		} = this.state;
		const { postFinishedSavingCallback, setSaving, accounts, canEditPost } = this.props;*/

		return (
			<div>
				<div className="connect-accounts-button center">Coming Soon!!!</div>
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

export default InstagramPosting;
