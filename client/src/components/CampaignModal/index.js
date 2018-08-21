import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faArrowDown from "@fortawesome/fontawesome-free-solid/faArrowDown";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";

import moment from "moment-timezone";
import io from "socket.io-client";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getPostColor, getSocialCharacters } from "../../extra/functions/CommonFunctions";

import DateTimePicker from "../DateTimePicker";
import Post from "../Post";
import CustomTask from "../CustomTask";
import Loader from "../Notifications/Loader";
import ConfirmAlert from "../Notifications/ConfirmAlert";

import "./styles/";

class CampaignModal extends Component {
	constructor(props) {
		super(props);
		let campaign = props.campaign // only defined if user clicked on an existing campaign to edit
			? props.campaign
			: {
					startDate:
						// maybe better to set new moment() to a var then use that instead so it's not called 4 times in a row
						// not sure if that's possible / actually better in this scope though
						new moment() > new moment(props.clickedCalendarDate) ? new moment() : new moment(props.clickedCalendarDate),
					endDate:
						new moment() > new moment(props.clickedCalendarDate)
							? new moment().add(15, "minutes")
							: new moment(props.clickedCalendarDate).add(15, "minutes"),
					name: "",
					userID: props.user.signedInAsUser
						? props.user.signedInAsUser.id
							? props.user.signedInAsUser.id
							: props.user._id
						: props.user._id,
					color: "var(--campaign-color1)",
					recipeID: undefined
			  };

		if (props.campaign) {
			// if we are opening an existing campaign, that means the data was retrieved from the DB
			// this means that the date objects will just be strings so we need to convert them to moment objects
			campaign.startDate = new moment(campaign.startDate);
			campaign.endDate = new moment(campaign.endDate);
		}

		let stateVariable = {
			campaign,
			posts: [],
			listOfPostChanges: {},
			activePostKey: undefined,

			colors: {
				color1: { className: "color1", border: "color1-border", color: "var(--campaign-color1)" },
				color2: { className: "color2", border: "color2-border", color: "var(--campaign-color2)" },
				color3: { className: "color3", border: "color3-border", color: "var(--campaign-color3)" },
				color4: { className: "color4", border: "color4-border", color: "var(--campaign-color4)" }
			},
			saving: true,
			postAccountPicker: false,
			somethingChanged: props.campaign ? false : true,
			confirmDelete: false,
			firstPostChosen: false, // when first creating a new campagin, prompt user to choose how they'd like to start the campaign
			newPostPromptActive: false // when user clicks + for a new post to their campaign, show post type options for them to select
		};

		this.state = stateVariable;
	}
	componentDidMount() {
		let { campaign } = this.props;
		if (campaign) {
			if (campaign.posts) {
				if (campaign.posts.length > 0) {
					this.fillPosts(campaign.posts);
					// maybe shouldn't hardcode but because setState is asychnronous, this will do for now
					this.setState({ firstPostChosen: true, activePostKey: 0 });
				}
			}
		}

		this.initSocket();
	}

	componentWillUnmount() {
		let { campaign, somethingChanged, socket } = this.state;

		if (somethingChanged && campaign && socket) {
			socket.emit("campaign_editted", campaign);
			socket.on("campaign_saved", emitObject => {
				socket.emit("close", campaign);

				this.props.updateCampaigns();
			});
		}
	}

	initSocket = () => {
		let { campaign, somethingChanged } = this.state;
		let { recipe } = this.props;
		let socket;

		if (process.env.NODE_ENV === "development") socket = io("http://localhost:5000");
		else socket = io();

		if (!this.props.campaign) {
			if (recipe) {
				campaign.name = recipe.name;
				campaign.color = recipe.color;
				campaign.startDate = recipe.startDate.set("hour", recipe.hour).set("minute", recipe.minute);
				campaign.endDate = new moment(recipe.startDate).add(recipe.length, "millisecond");
				campaign.recipeID = recipe._id;

				this.setState({ campaign });
			}
			socket.emit("new_campaign", campaign);

			socket.on("new_campaign_saved", campaignID => {
				campaign._id = campaignID;

				this.setState({ campaign, saving: false });

				if (recipe) {
					for (let index in recipe.posts) {
						recipe.posts[index].campaignID = campaignID;
						this.newPost(recipe.posts[index].socialType, recipe.posts[index]);
					}

					this.setState({ campaign });
				}
			});
		} else this.setState({ saving: false });

		this.setState({ socket });
	};

	fillPosts = campaign_posts => {
		const { campaign } = this.state;
		const { timezone, clickedCalendarDate } = this.props;

		const posts = [];
		// function called when a user clicks on an existing campaign to edit.
		for (let i = 0; i < campaign_posts.length; i++) {
			const current_post = campaign_posts[i];

			let new_post = {
				timezone,
				post: current_post
			};

			posts.push(new_post);
		}

		this.setState({ posts });
	};

	newPost = (socialType, recipePost) => {
		const { posts, socket, campaign } = this.state;
		const { timezone, clickedCalendarDate } = this.props;
		const { startDate, _id } = campaign;

		let postingDate = clickedCalendarDate;
		if (clickedCalendarDate < campaign.startDate) postingDate = campaign.startDate;
		let instructions;

		if (recipePost) {
			postingDate = new moment(startDate).add(recipePost.postingDate, "millisecond");
			instructions = recipePost.instructions;
		}

		this.setState({
			posts: [
				...this.state.posts,
				{
					post: {
						postingDate,
						socialType,
						campaignID: _id,
						instructions
					},
					canEditPost: true,
					timezone
				}
			],
			postAccountPicker: false,
			activePostKey: posts.length,
			listOfPostChanges: {},

			newPostPromptActive: false,
			firstPostChosen: true
		});
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

	updatePost = updatedPost => {
		const { posts, activePostKey } = this.state;

		let new_post = posts[activePostKey];
		new_post.post = updatedPost;

		this.setState({
			posts: [...posts.slice(0, activePostKey), new_post, ...posts.slice(activePostKey + 1)],
			listOfPostChanges: {},
			somethingChanged: true
		});
		return;
	};

	deletePost = (e, index) => {
		e.preventDefault();
		const { posts, socket, campaign } = this.state;

		if (index === -1) {
			console.log("couldn't find post to delete.");
			return;
		} else if (!posts[index].post._id) {
			// post hasn't been scheduled yet so don't need to delete it from DB

			this.setState(prevState => {
				return {
					posts: [...prevState.posts.slice(0, index), ...prevState.posts.slice(index + 1)],
					somethingChanged: true,
					activePostKey: index - 1 < 0 ? 0 : index - 1,
					firstPostChosen: prevState.posts.length <= 1 ? false : true
				};
			});
		} else {
			socket.emit("delete-post", { post: posts[index], campaign });
			socket.on("post-deleted", emitObject => {
				socket.off("post-deleted");
				const { removedPost, removedFromCampaign, newCampaign } = emitObject;
				if (!removedPost) {
					console.log("failed to remove post from db");
				}
				if (!removedFromCampaign) {
					console.log("failed to remove post from campaign in db");
				}
				if (removedPost && removedFromCampaign) {
					if (!newCampaign) {
						console.log("post removed from db and in campaign in db but no newCampaign object???");
					} else {
						this.setState(prevState => {
							return {
								posts: [...prevState.posts.slice(0, index), ...prevState.posts.slice(index + 1)],
								campaign: newCampaign,
								somethingChanged: true,
								activePostKey: index - 1 < 0 ? 0 : index - 1,
								firstPostChosen: prevState.posts.length <= 1 ? false : true
							};
						});
					}
				}
			});
		}
	};

	selectPost = (e, arrayIndex) => {
		e.preventDefault();
		this.setState({ activePostKey: arrayIndex, listOfPostChanges: {} });
	};

	backupPostChanges = (value, index) => {
		// function that gets called by <Post/> function to store all the changes that have happened
		// if the changes are saved, this list gets set back to empty
		// if this component's (campaignModal) state changes which causes a re-render,
		// we send this list of changes into the <Post/> component so it can re-execute those changes
		// otherwise the <Post/> component would lose all unsaved changes everytime a campaign attribute changed
		// say that when typing, this function would receive a series of calls such as:
		// backupPostChanges("t", "content"), backupPostChanges("tw", "content"), backupPostChanges("twi", "content"),
		// backupPostChanges("twit", "content"), etc..
		// we should probably only store one copy of each index ("content") since only the most recent matters
		const { listOfPostChanges } = this.state;
		listOfPostChanges[index] = value;
		this.setState({ listOfPostChanges });
	};

	modifyCampaignDates = postingDate => {
		// function that gets passed to <Post/> as a prop
		// <Post/> will use this function to push the campaign start/end dates in order to fit its posting date
		const { campaign, socket } = this.state;
		if (campaign.startDate > postingDate) {
			campaign.startDate = new moment(postingDate);
		} else if (campaign.endDate < postingDate) {
			campaign.endDate = new moment(postingDate);
		} else {
			console.log("attempting to modify campaign date so post date fits, but posting date already fits?");
		}
		socket.emit("campaign_editted", campaign); // make sure this saves in the DB in case the page crashes or reloads
		this.setState({ campaign, somethingChanged: true });
	};

	tryChangingCampaignDates = (date, date_type) => {
		/*
		this.handleCampaignChange(date, "endDate");
		if (date <= new moment(startDate)) {
			this.handleCampaignChange(date, "startDate");
		} */
		// function that gets passed to <DateTimePicker/> which lets it modify <CampaignModal/>'s start and end dates
		// before accepting the modifications, we must check to make sure that the new date doesn't invalidate any posts
		// for example, if you had a campaign from Sept 1 -> Sept 4 and a post on Sept 3,
		// then you tried to change the campaign to Sept 1 -> Sept 2, the post on Sept 3 will no longer be within the campaign dates
		// so we'll want to disallow this modification and let the user know what happened
		// it will be up to the user to either delete that post, or modify its posting date to within the intended campaign scope
		const { campaign, posts } = this.state;
		campaign[date_type] = date;
		const { startDate, endDate } = campaign;
		console.log(startDate);
		console.log(endDate);

		let count_invalid = 0;

		for (let index in posts) {
			const postingDate = new moment(posts[index].post.postingDate);
			console.log(postingDate);
			if (postingDate < startDate || postingDate > endDate) {
				count_invalid++;
			}
		}

		if (count_invalid === 0) {
			if (date_type === "endDate") {
				this.handleCampaignChange(date, "endDate");
				if (date <= startDate) {
					this.handleCampaignChange(date, "startDate");
				}
			} else {
				this.handleCampaignChange(date, "startDate");
				if (date >= endDate) {
					this.handleCampaignChange(date, "endDate");
				}
			}
		} else {
			console.log(""+count_invalid+" posts would no longer fit within the campaign's start and end dates.");
		}
	}

	getActivePost = () => {
		const { activePostKey, posts, socket, campaign, listOfPostChanges } = this.state;
		const post_obj = posts[activePostKey];

		if (post_obj.post.socialType === "custom") {
			return (
				<CustomTask
					post={post_obj.post}
					clickedCalendarDate={post_obj.post.postingDate}
					postFinishedSavingCallback={savedPost => {
						socket.emit("new_post", { campaign, post: savedPost });
						this.updatePost(savedPost);
						socket.on("post_added", emitObject => {
							campaign.posts = emitObject.campaignPosts;
							this.setState({ campaign, saving: false });
						});
					}}
					setSaving={() => {
						this.setState({ saving: true });
					}}
					socialType={post_obj.post.socialType}
					canEditPost={true}
					timezone={post_obj.timezone}
					listOfChanges={Object.keys(listOfPostChanges).length > 0 ? listOfPostChanges : undefined}
					backupChanges={this.backupPostChanges}
					campaignStartDate={campaign.startDate}
					campaignEndDate={campaign.endDate}
					modifyCampaignDates={this.modifyCampaignDates}
				/>
			);
		} else {
			return (
				<Post
					post={post_obj.post}
					newActivePost={true}
					clickedCalendarDate={post_obj.post.postingDate}
					postFinishedSavingCallback={savedPost => {
						socket.emit("new_post", { campaign, post: savedPost });
						this.updatePost(savedPost);
						socket.on("post_added", emitObject => {
							campaign.posts = emitObject.campaignPosts;
							this.setState({ campaign, saving: false });
						});
					}}
					setSaving={() => {
						this.setState({ saving: true });
					}}
					socialType={post_obj.post.socialType}
					maxCharacters={getSocialCharacters(post_obj.post.socialType)}
					canEditPost={true}
					timezone={post_obj.timezone}
					listOfChanges={Object.keys(listOfPostChanges).length > 0 ? listOfPostChanges : undefined}
					backupChanges={this.backupPostChanges}
					campaignStartDate={campaign.startDate}
					campaignEndDate={campaign.endDate}
					modifyCampaignDates={this.modifyCampaignDates}
				/>
			);
		}
	};
	createRecipe = () => {
		let { campaign, posts } = this.state;

		axios.post("/api/recipe", { campaign, posts }).then(res => {
			const { success } = res.data;

			if (res.data.campaign) {
				campaign.recipeID = res.data.campaign.recipeID;
				this.setState({ campaign });
			}
		});
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
			let { campaign } = this.state;
			campaign[index] = value;

			this.setState({ campaign, somethingChanged: true });
		}
	};

	render() {
		console.log(this.state.posts);
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
		const { startDate, endDate, name, color } = campaign;

		let colorDivs = [];
		for (let index in colors) {
			let className = colors[index].border;
			if (colors[index].color == color) className += " active";
			colorDivs.push(
				<div
					className={className}
					onClick={() => {
						this.handleCampaignChange(colors[index].color, "color");
					}}
					key={index}
				>
					<div className={colors[index].className} />
				</div>
			);
		}

		return (
			<div className="modal" onClick={() => this.props.close()}>
				<div className="large-modal" onClick={e => e.stopPropagation()}>
					<FontAwesomeIcon icon={faTimes} size="2x" className="close" onClick={() => this.props.close()} />
					<div
						className="back-button"
						onClick={() => {
							this.props.handleChange(false, "campaignModal");
							this.props.handleChange(true, "recipeModal");
						}}
					>
						<FontAwesomeIcon icon={faArrowLeft} className="back-button-arrow" /> Back to Recipes
					</div>
					<div className="campaign-information-container" style={{ borderColor: color }}>
						<div className="name-color-container">
							<div className="name-container">
								<div className="label">Name:</div>
								<input
									onChange={event => this.handleCampaignChange(event.target.value, "name")}
									value={name}
									className="name-input"
									placeholder="My Awesome Product Launch!"
								/>
							</div>
							<div className="color-picker-container">
								<div className="label">Color:</div>
								<div className="colors">{colorDivs}</div>
							</div>
						</div>
						<div className="dates-container">
							<div className="date-and-label-container">
								<div className="label">Start Date: </div>
								<DateTimePicker
									date={new moment(startDate)}
									dateFormat="MMMM Do YYYY hh:mm A"
									handleChange={date => { this.tryChangingCampaignDates(date, "startDate"); }}
									dateLowerBound={new moment()}
								/>
							</div>
							<div className="date-and-label-container">
								<div className="label">End Date: </div>
								<DateTimePicker
									date={new moment(endDate)}
									dateFormat="MMMM Do YYYY hh:mm A"
									handleChange={date => { this.tryChangingCampaignDates(date, "endDate"); }}
									dateLowerBound={new moment()}
								/>
							</div>
						</div>
					</div>

					{!firstPostChosen && (
						<div className="campaign-start-container">
							<div className="new-campaign-post-selection-write-up">How do you want to start off your campaign?</div>

							<div className="new-post-prompt">
								<div className="account-option" onClick={() => this.newPost("facebook")}>
									Facebook<br />Post
								</div>
								<div className="account-option" onClick={() => this.newPost("twitter")}>
									Twitter<br />Post
								</div>
								<div className="account-option" onClick={() => this.newPost("linkedin")}>
									LinkedIn<br />Post
								</div>
								<div className="account-option" onClick={() => this.newPost("custom")}>
									Custom<br />Task
								</div>
							</div>
						</div>
					)}

					{firstPostChosen && (
						<div className="post-navigation-and-post-container">
							<div className="post-navigation-container" style={{ borderColor: color }}>
								<div className="list-container">
									{posts.map((post_obj, index) => {
										let postDate = post_obj.post ? post_obj.post.postingDate : post_obj.clickedCalendarDate;
										if (post_obj.recipePost) postDate = post_obj.recipePost.postingDate;

										return (
											<div className="list-entry-with-delete" key={index + "list-div"}>
												<div
													className="list-entry"
													key={index + "list-entry"}
													onClick={e => this.selectPost(e, index)}
													style={{
														borderColor: getPostColor(post_obj.post.socialType),
														backgroundColor: getPostColor(post_obj.post.socialType)
													}}
												>
													{post_obj.post.socialType.charAt(0).toUpperCase() +
														post_obj.post.socialType.slice(1) +
														" Post - " +
														new moment(post_obj.post ? post_obj.post.postingDate : post_obj.clickedCalendarDate).format(
															"lll"
														)}
												</div>
												<FontAwesomeIcon
													className="delete"
													key={index + "delete"}
													onClick={e => this.deletePost(e, index)}
													icon={faTrash}
												>
													X
												</FontAwesomeIcon>
											</div>
										);
									})}
									{!newPostPromptActive && (
										<FontAwesomeIcon
											onClick={e => this.handleChange(true, "newPostPromptActive")}
											className="new-post-button"
											icon={faPlus}
											size="2x"
											key="new_post_button"
											style={{ backgroundColor: color }}
										/>
									)}
									{newPostPromptActive && (
										<FontAwesomeIcon
											icon={faArrowDown}
											size="2x"
											key="new_post_button"
											className="arrow-down"
											style={{ color }}
										/>
									)}

									{newPostPromptActive && (
										<div className="new-post-prompt">
											<div className="account-option" onClick={() => this.newPost("facebook")}>
												Facebook<br />Post
											</div>
											<div className="account-option" onClick={() => this.newPost("twitter")}>
												Twitter<br />Post
											</div>
											<div className="account-option" onClick={() => this.newPost("linkedin")}>
												LinkedIn<br />Post
											</div>
											<div className="account-option" onClick={() => this.newPost("custom")}>
												Custom<br />Task
											</div>
										</div>
									)}
								</div>
								{!campaign.recipeID && (
									<div className="publish-as-recipe" style={{ backgroundColor: color }} onClick={this.createRecipe}>
										Publish as recipe
									</div>
								)}
							</div>

							{activePostKey !== undefined && (
								<div className="post-container" style={{ borderColor: color }}>
									{this.getActivePost()}
								</div>
							)}

							{postAccountPicker && (
								<div className="account-nav-bar-container">
									<div className="account-option" onClick={() => this.newPost("facebook")}>
										Facebook
									</div>
									<div className="account-option" onClick={() => this.newPost("twitter")}>
										Twitter
									</div>
									<div className="account-option" onClick={() => this.newPost("linkedin")}>
										LinkedIn
									</div>
								</div>
							)}
						</div>
					)}

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
							close={() => this.setState({ confirmDelete: false })}
							title="Delete Campaign"
							message="Are you sure you want to delete this campaign? Deleting this campaign will also delete all posts in it."
							callback={this.deleteCampaign}
							close={() => this.setState({ confirmDelete: false })}
						/>
					)}
				</div>

				{saving && <Loader />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	};
}
export default connect(mapStateToProps)(CampaignModal);
