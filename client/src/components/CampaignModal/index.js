import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import moment from "moment-timezone";
import io from "socket.io-client";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeCampaignDateLowerBound, changeCampaignDateUpperBound } from "../../redux/actions/";

import DateTimePicker from "../DateTimePicker";
import Post from "../Post";
import Loader from "../Notifications/Loader";
import ConfirmAlert from "../Notifications/ConfirmAlert/";

import "./styles/";

class CampaignModal extends Component {
	state = {
		campaign: this.props.campaign
			? this.props.campaign
			: {
					startDate:
						new moment() > new moment(this.props.clickedCalendarDate)
							? new moment()
							: new moment(this.props.clickedCalendarDate),
					endDate:
						new moment() > new moment(this.props.clickedCalendarDate)
							? new moment()
							: new moment(this.props.clickedCalendarDate),
					name: "",
					userID: this.props.user._id,
					color: "var(--campaign-color1)"
			  },
		posts: [],
		postIndex: undefined,
		colors: {
			color1: { className: "color1", border: "color1-border", color: "var(--campaign-color1" },
			color2: { className: "color2", border: "color2-border", color: "var(--campaign-color2" },
			color3: { className: "color3", border: "color3-border", color: "var(--campaign-color3" },
			color4: { className: "color4", border: "color4-border", color: "var(--campaign-color4" }
		},
		saving: true,
		postAccountPicker: false,
		somethingChanged: false,
		confirmDelete: false
	};
	componentDidMount() {
		this.initSocket();

		let { campaign, changeCampaignDateLowerBound, changeCampaignDateUpperBound } = this.props;
		if (campaign) {
			if (campaign.posts) {
				for (let index in campaign.posts) {
					let post = campaign.posts[index];
					if (post.socialType === "facebook") this.newPost("facebook", undefined, post);
					else if (post.socialType === "linkedin") this.newPost("linkedin", 700, post);
					else if (post.socialType === "twitter") this.newPost("twitter", 280, post);
				}
			}
		}

		changeCampaignDateLowerBound(this.state.campaign.startDate);
		changeCampaignDateUpperBound(this.state.campaign.endDate);
	}

	initSocket = () => {
		let { campaign, somethingChanged } = this.state;
		let socket;

		if (process.env.NODE_ENV === "development") socket = io("http://localhost:5000");
		else socket = io();

		if (!this.props.campaign) {
			socket.emit("new_campaign", campaign);

			socket.on("new_campaign_saved", campaignID => {
				campaign._id = campaignID;

				this.setState({ campaign, saving: false });
			});
		} else this.setState({ saving: false });

		setInterval(() => {
			let { campaign, somethingChanged, socket } = this.state;

			if (somethingChanged && campaign && socket) {
				socket.emit("campaign_editted", campaign);
				socket.on("campaign_saved", emitObject => {});
			}
		}, 1000);
		this.setState({ socket });
	};

	handleChange = (value, index, index2) => {
		if (index2) {
			let object = this.state[index];
			object[index2] = value;

			this.setState({ [index]: object });
		} else {
			this.setState({ [index]: value });
		}
	};

	handleCampaignChange = (value, index) => {
		if (index) {
			let { campaign, socket } = this.state;
			campaign[index] = value;

			this.setState({ campaign, somethingChanged: true });
		}
	};
	newPost = (socialType, maxCharacters, post) => {
		const { posts, socket, campaign } = this.state;
		const { accounts, timezone, clickedCalendarDate } = this.props;
		const { startDate, endDate } = campaign;

		posts.push(
			<div className="post-container" key={posts.length + "post"}>
				<Post
					accounts={accounts}
					clickedCalendarDate={clickedCalendarDate}
					postFinishedSavingCallback={savedPost => {
						socket.emit("new_post", { campaign, post: savedPost });
						socket.on("post_added", emitObject => {
							campaign.posts = emitObject.campaignPosts;
							this.setState({ campaign, saving: false });
						});
					}}
					setSaving={() => {
						this.setState({ saving: true });
					}}
					socialType={socialType}
					maxCharacters={maxCharacters}
					canEditPost={true}
					timezone={timezone}
					campaignID={campaign._id}
					post={post ? post : undefined}
				/>
			</div>
		);
		this.setState({ posts, postAccountPicker: false });
	};
	closeCampaign = () => {
		this.props.close(false, "campaignModal");

		let { socket, campaign } = this.state;
		socket.emit("close", campaign);

		this.props.updateCampaigns();
	};

	deleteCampaign = response => {
		let { socket, campaign } = this.state;

		if (response) {
			socket.emit("delete", campaign);
			this.props.close(false, "campaignModal");
			this.props.updateCampaigns();
		}
		this.setState({ confirmDelete: false });
	};

	render() {
		const { colors, posts, saving, postAccountPicker, confirmDelete, campaign } = this.state;
		const { startDate, endDate, name } = campaign;

		let colorDivs = [];
		for (let index in colors) {
			let color = colors[index];

			let className = color.border;
			if (color.color == campaign.color) className += " active";
			colorDivs.push(
				<div
					className={className}
					onClick={() => {
						this.handleCampaignChange(colors[index].color, "color");
					}}
					key={index}
				>
					<div className={color.className} />
				</div>
			);
		}

		return (
			<div className="modal" onClick={this.closeCampaign}>
				<div className="campaign-modal" onClick={event => event.stopPropagation()}>
					<FontAwesomeIcon icon={faTimes} size="2x" className="close" onClick={this.closeCampaign} />
					<div className="campaign-information-container">
						<div className="name-color-container">
							<div className="name-container">
								<div>Name your campaign:</div>
								<input
									onChange={event => this.handleCampaignChange(event.target.value, "name")}
									value={name}
									className="name-input"
									placeholder="My Awesome Product Launch!"
								/>
							</div>
							<div className="color-picker-container">
								<div>Select a color for your campaign:</div>
								<div className="colors">{colorDivs}</div>
							</div>
						</div>
						<div className="dates-container">
							<div className="date-and-label-container">
								<div>When do you want your campaign to start?</div>
								<DateTimePicker
									date={new moment(startDate)}
									dateFormat="MMMM Do YYYY hh:mm A"
									handleChange={date => {
										this.handleCampaignChange(date, "startDate");
										this.props.changeCampaignDateLowerBound(date);
										if (date >= new moment(endDate)) {
											this.handleCampaignChange(date, "endDate");
											this.props.changeCampaignDateUpperBound(date);
										}
									}}
									dateLowerBound={new moment()}
								/>
							</div>
							<div className="date-and-label-container">
								<div>When do you want your campaign to end?</div>
								<DateTimePicker
									date={new moment(endDate)}
									dateFormat="MMMM Do YYYY hh:mm A"
									handleChange={date => {
										this.handleCampaignChange(date, "endDate");
										this.props.changeCampaignDateUpperBound(date);
										if (date <= new moment(startDate)) {
											this.handleCampaignChange(date, "startDate");
											this.props.changeCampaignDateLowerBound(date);
										}
									}}
									dateLowerBound={new moment()}
								/>
							</div>
						</div>
					</div>

					<div className="posts-container">{posts}</div>

					{postAccountPicker && (
						<div className="account-nav-bar-container">
							<div className="account-option" onClick={() => this.newPost("facebook")}>
								Facebook
							</div>
							<div className="account-option" onClick={() => this.newPost("twitter", 280)}>
								Twitter
							</div>
							<div className="account-option" onClick={() => this.newPost("linkedin", 700)}>
								LinkedIn
							</div>
						</div>
					)}
					{!postAccountPicker && <div className="test">here</div>}
					<div className="modal-footer">
						<FontAwesomeIcon
							onClick={() => this.handleChange(true, "confirmDelete")}
							className="delete"
							icon={faTrash}
							size="2x"
						/>
					</div>
					{confirmDelete && (
						<ConfirmAlert
							title="Delete Campaign"
							message="Are you sure you want to delete this campaign? Deleting this campaign will also delete all posts in it."
							callback={this.deleteCampaign}
						/>
					)}
				</div>

				{saving && <Loader />}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			changeCampaignDateLowerBound,
			changeCampaignDateUpperBound
		},
		dispatch
	);
}

function mapStateToProps(state) {
	return {
		accounts: state.accounts,
		user: state.user
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CampaignModal);
