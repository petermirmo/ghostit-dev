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
import { changeCampaignDateLowerBound, changeCampaignDateUpperBound } from "../../redux/actions/";
import { getPostColor, getSocialCharacters } from "../../extra/functions/CommonFunctions";

import DateTimePicker from "../DateTimePicker";
import Post from "../Post";
import Loader from "../Notifications/Loader";
import ConfirmAlert from "../Notifications/ConfirmAlert";

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
							? new moment().add(15, "minutes")
							: new moment(this.props.clickedCalendarDate).add(15, "minutes"),
					name: "",
					userID: this.props.user.signedInAsUser
						? this.props.user.signedInAsUser.id
							? this.props.user.signedInAsUser.id
							: this.props.user._id
						: this.props.user._id,
					color: "var(--campaign-color1)",
					recipeID: undefined
			  },
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
		somethingChanged: this.props.campaign ? false : true,
		confirmDelete: false,
		firstPostChosen: false, // when first creating a new campagin, prompt user to choose how they'd like to start the campaign
		newPostPromptActive: false // when user clicks + for a new post to their campaign, show post type options for them to select
	};
	componentDidMount() {
		this.initSocket();

		let { campaign, changeCampaignDateLowerBound, changeCampaignDateUpperBound, recipe } = this.props;
		if (campaign) {
			if (campaign.posts) {
				if (campaign.posts.length > 0) {
					this.fillPosts(campaign.posts);
					// maybe shouldn't hardcode but because setState is asychnronous, this will do for now
					this.setState({ firstPostChosen: true, activePostKey: 0 });
				}
			}
		}

		changeCampaignDateLowerBound(this.state.campaign.startDate);
		changeCampaignDateUpperBound(this.state.campaign.endDate);
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

	fillPosts = campaign_posts => {
		const { campaign } = this.state;
		const { timezone, clickedCalendarDate } = this.props;

		const posts = [];
		// function called when a user clicks on an existing campaign to edit.
		for (let i = 0; i < campaign_posts.length; i++) {
			const current_post = campaign_posts[i];

			let new_post = {
				key: i,
				timezone,
				post: current_post
			};

			posts.push(new_post);
		}

		this.setState({ posts });
	};

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
					posts: [...posts.slice(0, index), new_post, ...posts.slice(index + 1)],
					listOfPostChanges: {},
					somethingChanged: true
				});
				return;
			}
		}
	};

	newPost = (socialType, recipePost) => {
		const { posts, socket, campaign } = this.state;
		const { timezone, clickedCalendarDate } = this.props;
		const { startDate, _id } = campaign;

		let postingDate = clickedCalendarDate;
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
					timezone,
					key: posts.length
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

	deletePost = (e, post_key) => {
		e.preventDefault();
		const { posts, socket, campaign } = this.state;
		const index = posts.findIndex(post_obj => {
			return post_obj.key === post_key;
		});
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

	selectPost = (e, post_key) => {
		e.preventDefault();
		this.setState({ activePostKey: post_key, listOfPostChanges: {} });
	};

	newPostPrompt = e => {
		e.preventDefault();
		this.setState({ newPostPromptActive: true });
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

	getActivePost = () => {
		const { activePostKey, posts, socket, campaign, listOfPostChanges } = this.state;
		const post = posts[activePostKey];

		return (
			<Post
				post={post.post}
				newActivePost={true}
				clickedCalendarDate={post.post.date}
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
				socialType={post.post.socialType}
				maxCharacters={getSocialCharacters(post.socialType)}
				canEditPost={true}
				timezone={post.timezone}
				listOfChanges={Object.keys(listOfPostChanges).length > 0 ? listOfPostChanges : undefined}
				backupChanges={this.backupPostChanges}
			/>
		);
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
		const { startDate, endDate, name, color } = campaign;

		console.log(activePostKey);

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
								<div className="label">End Date: </div>
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
							</div>
						</div>
					)}

					{firstPostChosen && (
						<div className="post-navigation-and-post-container">
							<div className="post-navigation-container" style={{ borderColor: color }}>
								<div className="post-list-container">
									{posts.map(post_obj => {
										let postDate = post_obj.post ? post_obj.post.postingDate : post_obj.clickedCalendarDate;
										if (post_obj.recipePost) postDate = post_obj.recipePost.postingDate;

										return (
											<div className="post-list-entry-with-delete" key={post_obj.key + "list-div"}>
												<div
													className="post-list-entry"
													key={post_obj.key + "list-entry"}
													onClick={e => this.selectPost(e, post_obj.key)}
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
													key={post_obj.key + "delete"}
													onClick={e => this.deletePost(e, post_obj.key)}
													icon={faTrash}
												>
													X
												</FontAwesomeIcon>
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
											style={{ backgroundColor: color }}
										/>
									)}
									{newPostPromptActive && (
										<FontAwesomeIcon icon={faArrowDown} size="2x" key="new_post_button" className="arrow-down" />
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
										</div>
									)}
									{!campaign.recipeID && (
										<div className="publish-as-recipe" style={{ backgroundColor: color }} onClick={this.createRecipe}>
											Publish as recipe
										</div>
									)}
								</div>
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
		user: state.user
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CampaignModal);
