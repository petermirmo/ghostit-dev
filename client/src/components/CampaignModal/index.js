import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import moment from "moment-timezone";
import io from "socket.io-client";

import DateTimePicker from "../DateTimePicker";
import Post from "../Post";
import "./styles/";

class CampaignModal extends Component {
	state = {
		campaign: {
			startDate: new moment(),
			endDate: new moment(),
			name: ""
		},
		posts: [],
		postIndex: undefined,
		colors: {
			color1: { className: "color1", border: "color1-border", active: false },
			color2: { className: "color2", border: "color2-border", active: false },
			color3: { className: "color3", border: "color3-border", active: false },
			color4: { className: "color4", border: "color4-border", active: false }
		}
	};
	componentDidMount() {
		this.initSocket();
	}

	initSocket = () => {
		const { campaign } = this.state;
		let socket;

		if (process.env.NODE_ENV === "development") socket = io("http://localhost:5000");
		else socket = io();

		socket.emit("new_campaign", campaign);

		socket.on("campaign_saved", function(savedCampaign) {
			console.log(savedCampaign);
		});

		this.setState({ socket });
	};

	handleChange = (value, index, index2) => {
		if (index2) {
			let object = this.state[index];
			object[index2] = value;

			this.setState({ [index]: object });
		} else this.setState({ [index]: value });
	};
	newPost = () => {
		const { posts, socket } = this.state;
		const { startDate, endDate } = this.state.campaign;

		posts.push(
			<div className="post-container" key={posts.length + "post"}>
				<Post
					accounts={[]}
					clickedCalendarDate={new moment()}
					postFinishedSavingCallback={() => {}}
					setSaving={() => {}}
					socialType={"facebook"}
					maxCharacters={undefined}
					canEditPost={true}
					timezone={"America/Vancouver"}
					dateLowerBound={startDate}
					dateUpperBound={endDate}
				/>
				<div className="dots-plus-container">
					<div className="dot1" />
					<div className="dot2" />
					<div className="dot3" />
				</div>
			</div>
		);

		socket.emit("new_post", post => {});

		this.setState({ posts });
	};

	render() {
		const { colors, posts } = this.state;
		const { startDate, endDate, name } = this.state.campaign;

		let colorDivs = [];
		for (let index in colors) {
			let color = colors[index];
			colorDivs.push(
				<div
					className={color.border}
					onClick={() => {
						for (let index2 in colors) {
							colors[index2].active = false;
							colors[index2].border = colors[index2].border.replace(" active", "");
						}
						colors[index].active = true;
						colors[index].border += " active";
						this.setState({ colors });
					}}
					key={index}
				>
					<div className={color.className} />
				</div>
			);
		}

		return (
			<div className="modal" onClick={event => this.props.handleChange(false, "campaignModal")}>
				<div className="campaign-modal" onClick={event => event.stopPropagation()}>
					<div className="campaign-information-container">
						<div className="name-color-container">
							<div className="name-container">
								<div>Campaign Name:</div>
								<input
									onChange={event => this.handleChange(event.target.value, "campaign", "name")}
									value={name}
									className="name-input"
									placeholder="Name"
								/>
							</div>
							<div className="color-picker-container">
								<div>Campaign Color:</div>
								<div className="colors">{colorDivs}</div>
							</div>
						</div>
						<div className="dates-container">
							<div className="date-and-label-container">
								<div>Campaign Start Date:</div>
								<DateTimePicker
									date={startDate}
									dateFormat="MMMM Do YYYY hh:mm A"
									onChange={date => this.handleChange(date, "campaign", "startDate")}
								/>
							</div>
							<div className="date-and-label-container">
								<div>Campaign End Date:</div>
								<DateTimePicker
									date={endDate}
									dateFormat="MMMM Do YYYY hh:mm A"
									onChange={date => this.handleChange(date, "campaign", "endDate")}
								/>
							</div>
						</div>
					</div>

					<div className="posts-container">{posts}</div>

					<FontAwesomeIcon icon={faPlus} className="plus-icon" onClick={this.newPost} />
				</div>
			</div>
		);
	}
}
export default CampaignModal;
