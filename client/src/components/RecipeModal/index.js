import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import LoaderSimpleCircle from "../Notifications/LoaderSimpleCircle";
import PickDateModal from "../PickDateModal";

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

		pickDateModal: false
	};
	componentDidMount() {
		axios.get("/api/recipes").then(res => {
			let { usersRecipes, allRecipes } = res.data;

			if (!usersRecipes) usersRecipes = [];
			if (!allRecipes) allRecipes = [];

			this.setState({ usersRecipes, allRecipes, activeRecipes: allRecipes, loading: false });
		});
	}
	render() {
		let { activeRecipes, loading, recipe, pickDateModal, clientX, clientY, startDate } = this.state;

		return (
			<div className="modal" onClick={() => this.props.handleChange(false, "recipeModal")}>
				<div
					className="large-modal"
					onClick={e => {
						e.stopPropagation();
						this.setState({ pickDateModal: false });
					}}
				>
					<FontAwesomeIcon
						icon={faTimes}
						size="2x"
						className="close"
						onClick={() => this.props.close(false, "recipeModal")}
					/>
					<div
						className="custom-campaign"
						onClick={e => {
							e.stopPropagation();
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
					<div className="recipes-container">
						{activeRecipes.map(recipe => {
							return (
								<div
									className="recipe-container"
									key={recipe._id}
									onClick={e => {
										e.stopPropagation();
										this.setState({ pickDateModal: true, recipe, clientX: e.clientX, clientY: e.clientY });
									}}
									style={{ backgroundColor: recipe.color }}
								>
									<div className="recipe-name">{recipe.name}</div>
								</div>
							);
						})}
					</div>
					{loading && <LoaderSimpleCircle />}
					{pickDateModal && (
						<PickDateModal
							callback={date => {
								recipe.startDate = date;
								this.props.handleChange(undefined, "clickedEvent");
								this.props.handleChange(recipe, "recipe");
								this.props.handleChange(false, "recipeModal");
								this.props.handleChange(true, "campaignModal");
							}}
							close={() => {
								this.setState({ pickDateModal: false });
							}}
							clientX={clientX}
							clientY={clientY}
							startDate={startDate}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default RecipeModal;
