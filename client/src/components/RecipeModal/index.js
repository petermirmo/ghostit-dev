import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import LoaderSimpleCircle from "../Notifications/LoaderSimpleCircle";
import DateTimePicker from "../DateTimePicker";

import { getPostColor } from "../../extra/functions/CommonFunctions";

import "./styles/";

class RecipeModal extends Component {
	state = {
		usersRecipes: [],
		allRecipes: [],
		activeRecipes: [],
		loading: true,

		clientX: 0,
		clientY: 0,

		startDate: new moment(this.props.clickedCalendarDate),

		chooseRecipeDate: false,

		previewRecipeLocation: undefined,
		activePost: undefined
	};
	componentDidMount() {
		axios.get("/api/recipes").then(res => {
			let { usersRecipes, allRecipes } = res.data;

			if (!usersRecipes) usersRecipes = [];
			if (!allRecipes) allRecipes = [];

			this.setState({ usersRecipes, allRecipes, activeRecipes: allRecipes, loading: false });
		});
	}

	createRecipeList = activeRecipes => {
		const { previewRecipeLocation, activePost, chooseRecipeDate, startDate } = this.state;
		let recipeArray = [];

		let recipeIndex = 0;

		for (let recipeRow = 0; recipeRow <= activeRecipes.length / 4; recipeRow++) {
			let rowArray = [];

			for (let recipeColumn = 0; recipeColumn <= 3; recipeColumn++) {
				let recipeIndex2 = recipeIndex;
				let recipe = activeRecipes[recipeIndex2];

				// Preview when a recipe is clicked
				if (previewRecipeLocation === recipeIndex2) {
					recipeArray[recipeArray.length + 1] = (
						<div
							className="preview-recipe"
							key={recipeRow + "preview_recipe" + recipeColumn}
							style={{ backgroundColor: recipe.color }}
						>
							<div className="title">{recipe.name ? recipe.name : "This recipe does not have a title."}</div>
							<div className="recipe-navigation-and-post-preview-container">
								<div className="preview-navigation-container">
									<div className="list-container">
										{recipe.posts.map((post_obj, index) => {
											return (
												<div className="list-entry-with-delete" key={index + "list-div"}>
													<div
														className="list-entry"
														key={index + "list-entry"}
														onClick={e => this.setState({ activePost: post_obj })}
														style={{
															borderColor: getPostColor(post_obj.socialType),
															backgroundColor: getPostColor(post_obj.socialType)
														}}
													>
														{post_obj.socialType.charAt(0).toUpperCase() + post_obj.socialType.slice(1) + " Post"}
													</div>
												</div>
											);
										})}
									</div>
								</div>
								<div className="recipe-post-and-use-container">
									{activePost && (
										<div className="post-preview">
											<div className="label">Post Instructions : </div>
											{activePost.instructions ? activePost.instructions : "This post has no instructions."}
										</div>
									)}
									<div className="use-recipe-date-container">
										{!chooseRecipeDate && (
											<div className="use-this-recipe" onClick={() => this.setState({ chooseRecipeDate: true })}>
												Use This Recipe
											</div>
										)}
										{chooseRecipeDate && <div className="label">Choose Start Date: </div>}
										{chooseRecipeDate && (
											<DateTimePicker
												date={new moment()}
												dateFormat="MMMM Do YYYY"
												handleChange={date => {
													recipe.startDate = date;
													this.props.handleChange(undefined, "clickedEvent");
													this.props.handleChange(recipe, "recipe");
													this.props.handleChange(false, "recipeModal");
													this.props.handleChange(true, "campaignModal");
												}}
												dateLowerBound={new moment()}
												disableTime={true}
												style={{
													bottom: "-80px"
												}}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					);
				}

				// Put in blank divs to account for empty slots in final row
				if (!recipe) recipe = { _id: recipeIndex2 + "recipe", name: "", color: "transparent", cursor: "default" };
				rowArray.push(
					<div
						className="recipe-container"
						key={recipeIndex2 + "recipe"}
						onClick={e => {
							if (!activeRecipes[recipeIndex2]) return;
							e.stopPropagation();
							this.setState({ previewRecipeLocation: recipeIndex2, activePost: recipe.posts[0] });
						}}
						style={{ backgroundColor: recipe.color, cursor: recipe.cursor }}
					>
						<div className="recipe-name">{recipe.name}</div>
					</div>
				);
				recipeIndex++;
			}
			if (recipeArray[recipeArray.length - 2] || recipeArray.length === 0 || recipeArray.length === 1) {
				recipeArray.push(
					<div className="recipes-container" key={recipeRow + "each_row"}>
						{rowArray}
					</div>
				);
			} else {
				recipeArray[recipeArray.length - 2] = (
					<div className="recipes-container" key={recipeRow + "each_row"}>
						{rowArray}
					</div>
				);
			}
		}

		return recipeArray;
	};
	render() {
		let { activeRecipes, loading, recipe, clientX, clientY, startDate } = this.state;

		let recipeArray = this.createRecipeList(activeRecipes);

		return (
			<div className="modal" onClick={() => this.props.handleChange(false, "recipeModal")}>
				<div className="large-modal" onClick={e => e.stopPropagation()}>
					<FontAwesomeIcon
						icon={faTimes}
						size="2x"
						className="close"
						onClick={() => this.props.close(false, "recipeModal")}
					/>
					<div
						className="custom-campaign-button"
						onClick={e => {
							this.props.handleChange(undefined, "recipe");
							this.props.handleChange(true, "campaignModal");
							this.props.handleChange(false, "recipeModal");
						}}
					>
						Create Custom Campaign
					</div>
					<div className="recipe-navigation-container">
						<div
							className={
								activeRecipes === this.state.allRecipes ? "recipe-navigation-option active" : "recipe-navigation-option"
							}
							onClick={() => {
								this.setState({ activeRecipes: this.state.allRecipes });
							}}
						>
							All Recipes
						</div>
						<div
							className={
								activeRecipes === this.state.usersRecipes
									? "recipe-navigation-option active"
									: "recipe-navigation-option"
							}
							onClick={() => {
								this.setState({ activeRecipes: this.state.usersRecipes });
							}}
						>
							Your Recipes
						</div>
					</div>
					<div className="recipes-container-container">{recipeArray}</div>
					{loading && <LoaderSimpleCircle />}
				</div>
			</div>
		);
	}
}

export default RecipeModal;
