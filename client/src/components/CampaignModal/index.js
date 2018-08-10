import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faArrowDown from "@fortawesome/fontawesome-free-solid/faArrowDown";

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
		campaign: this.props.campaign // only defined if user clicked on an existing campaign to edit
			? this.props.campaign
			: {
					startDate:
						// maybe better to set new moment() to a var then use that instead so it's not called 4 times in a row
						// not sure if that's possible / actually better in this scope though
						new moment() > new moment(this.props.clickedCalendarDate)
							? new moment()
							: new moment(this.props.clickedCalendarDate),
					endDate:
						new moment() > new moment(this.props.clickedCalendarDate)
							? new moment()
							: new moment(this.props.clickedCalendarDate),
					name: "",
					userID: this.props.user.signedInAsUser
						? this.props.user.signedInAsUser.id
							? this.props.user.signedInAsUser.id
							: this.props.user._id
						: this.props.user._id,
					color: "var(--campaign-color1)"
			  },
		posts: [],
		activePostKey: undefined,
		nextPostKey: 0, // incrementing key so each post has a unique id regardless of posts being deleted
		colors: {
			color1: { className: "color1", border: "color1-border", color: "var(--campaign-color1)" },
			color2: { className: "color2", border: "color2-border", color: "var(--campaign-color2)" },
			color3: { className: "color3", border: "color3-border", color: "var(--campaign-color3)" },
			color4: { className: "color4", border: "color4-border", color: "var(--campaign-color4)" }
		},
		saving: true,
		postAccountPicker: false,
		somethingChanged: false,
		confirmDelete: false,
		firstPostChosen: false, // when first creating a new campagin, prompt user to choose how they'd like to start the campaign
		newPostPromptActive: false // when user clicks + for a new post to their campaign, show post type options for them to select
	};
	componentDidMount() {
		this.initSocket();

		let { campaign, changeCampaignDateLowerBound, changeCampaignDateUpperBound } = this.props;
		if (campaign) {
			if (campaign.posts) {
				if (campaign.posts.length > 0) {
					this.fillPosts(campaign.posts);
					let next_post_key = "" + campaign.posts.length + "post";
					this.setState({ firstPostChosen: true, activePostKey: "0post", nextPostKey: next_post_key }); // maybe shouldn't hardcode but because setState is asychnronous, this will do for now
				}
			}
		}

		changeCampaignDateLowerBound(this.state.campaign.startDate);
		changeCampaignDateUpperBound(this.state.campaign.endDate);
	}

	fillPosts = campaign_posts => {
		const { campaign } = this.state;
		const { accounts, timezone, clickedCalendarDate } = this.props;

		const posts = [];
		// function called when a user clicks on an existing campaign to edit.
		for (let i = 0; i < campaign_posts.length; i++) {
			const current_post = campaign_posts[i];
			let key = i + "post";
			let maxCharacters = undefined;
			if (current_post.socialType === "twitter") maxCharacters = 280;
			else if (current_post.socialType === "linkedin") maxCharacters = 700;

			let new_post = {
				key,
				accounts,
				clickedCalendarDate,
				socialType: current_post.socialType,
				maxCharacters,
				canEditPost: true,
				timezone,
				campaignID: campaign._id,
				post: current_post
			};

			posts.push(new_post);
		}

		this.setState({ posts });
	};

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
			// does socket need to be available in this function?
			let { campaign, socket } = this.state;
			campaign[index] = value;

			this.setState({ campaign, somethingChanged: true });
		}
	};

	updatePost = (key, updatedPost) => {
		const { posts } = this.state;
		for (let index = 0; index < posts.length; index++) {
			if (posts[index].key === key) {
				let new_post = JSON.parse(JSON.stringify(posts[index]));
				new_post.post = updatedPost;
				this.setState({
					posts: [...posts.slice(0, index), new_post, ...posts.slice(index + 1)]
				});
				return;
			}
		}
	};

	newPost = (socialType, maxCharacters, post) => {
		const { posts, socket, campaign, activePostKey, nextPostKey } = this.state;
		const { accounts, timezone, clickedCalendarDate } = this.props;
		const { startDate, endDate } = campaign;

		let key = nextPostKey + "post";

		let new_post = {
			key,
			accounts,
			clickedCalendarDate,
			socialType,
			maxCharacters,
			canEditPost: true,
			timezone,
			campaignID: campaign._id,
			post: undefined
		};
		this.setState({
			posts: [...this.state.posts, new_post],
			postAccountPicker: false,
			activePostKey: key,
			nextPostKey: nextPostKey + 1
		});
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

	firstPost = post_type => {
		// function called when selecting type of first post so that the page knows to render the post list
		// need to add Custom post_type
		this.setState({ firstPostChosen: true });
		if (post_type === "twitter") {
			this.newPost("twitter", 280);
		} else if (post_type === "facebook") {
			this.newPost("facebook");
		} else if (post_type === "linkedin") {
			this.newPost("linkedin", 700);
		}
	};

	addPost = post_type => {
		// need to add Custom post_type
		this.setState({ newPostPromptActive: false });
		if (post_type === "twitter") {
			this.newPost("twitter", 280);
		} else if (post_type === "facebook") {
			this.newPost("facebook");
		} else if (post_type === "linkedin") {
			this.newPost("linkedin", 700);
		}
	};

	selectPost = (e, post_key) => {
		e.preventDefault();
		this.setState({ activePostKey: post_key });
	};

	newPostPrompt = e => {
		e.preventDefault();
		this.setState({ newPostPromptActive: true });
	};

	getActivePost = () => {
		const { activePostKey, posts, socket, campaign } = this.state;
		for (let index in posts) {
			if (posts[index].key === activePostKey) {
				const post = posts[index];

				return (
					<Post
						newActivePost={true}
						accounts={post.accounts}
						clickedCalendarDate={post.clickedCalendarDate}
						postFinishedSavingCallback={savedPost => {
							socket.emit("new_post", { campaign, post: savedPost });
							this.updatePost(post.key, savedPost);
							socket.on("post_added", emitObject => {
								campaign.posts = emitObject.campaignPosts;
								this.setState({ campaign, saving: false });
							});
						}}
						setSaving={() => {
							this.setState({ saving: true });
						}}
						socialType={post.socialType}
						maxCharacters={post.maxCharacters}
						canEditPost={post.canEditPost}
						timezone={post.timezone}
						campaignID={post.campaignID}
						post={post.post}
					/>
				);
			}
		}
		return <div />;
	};

	render() {
		const {
			colors,
			posts,
			saving,
			postAccountPicker,
			confirmDelete,
			campaign,
			firstPostChosen,
			activePostKey,
			newPostPromptActive
		} = this.state;
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
					<div className="post-navigation-and-post-container">
						{!firstPostChosen && (
							<div className="campaign-start-container">
								<div className="new-campaign-post-selection-write-up">How do you want to start off your campaign?</div>

								<div className="new-post-prompt">
									<div className="account-option" onClick={() => this.firstPost("facebook")}>
										Facebook<br />Post
									</div>
									<div className="account-option" onClick={() => this.firstPost("twitter")}>
										Twitter<br />Post
									</div>
									<div className="account-option" onClick={() => this.firstPost("linkedin")}>
										LinkedIn<br />Post
									</div>
								</div>
							</div>
						)}

						{firstPostChosen && (
							<div className="post-navigation-container">
								<div className="post-list-container">
									{posts.map(post_obj => {
										return (
											<div
												className="post-list-entry"
												key={post_obj.key + "list-entry"}
												onClick={e => this.selectPost(e, post_obj.key)}
											>
												{post_obj.socialType.charAt(0).toUpperCase() + post_obj.socialType.slice(1) + " Post"}
											</div>
										);
									})}
									{!newPostPromptActive && (
										<FontAwesomeIcon
											onClick={e => this.newPostPrompt(e)}
											className="new-post-button"
											icon={faPlus}
											size="2x"
											key="new_post_button"
										/>
									)}
									{newPostPromptActive && <FontAwesomeIcon icon={faArrowDown} size="2x" key="new_post_button" />}
								</div>

								{newPostPromptActive && (
									<div className="new-post-prompt">
										<div className="account-option" onClick={() => this.addPost("facebook")}>
											Facebook<br />Post
										</div>
										<div className="account-option" onClick={() => this.addPost("twitter")}>
											Twitter<br />Post
										</div>
										<div className="account-option" onClick={() => this.addPost("linkedin")}>
											LinkedIn<br />Post
										</div>
									</div>
								)}
							</div>
						)}

						{activePostKey !== undefined && <div className="post-container">{this.getActivePost()}</div>}

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
					</div>

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
