import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import Loader from "../../components/Loader/";

import "./style.css";

class Content extends Component {
	state = {
		user: {
			fullName: "",
			email: "",
			website: "",
			password: ""
		},
		saving: false
	};
	constructor(props) {
		super(props);
		this.initialize = this.initialize.bind(this);
		this.initialize();
	}
	initialize() {
		// Get current user and fill in form data
		axios.get("/api/user").then(function(res) {
			const { fullName, email, website } = res.data;
			this.setState({ fullName: fullName, email: email, website: website, password: "" });
		});
	}
	handleChange = (index, value) => {
		this.setState({ [index]: value });
	};
	saveUser = event => {
		event.preventDefault();
	};
	render() {
		return (
			<div id="wrapper" style={{ backgroundColor: "var(--light-blue-theme-color)" }}>
				<Header activePage="profile" />
				<ConnectAccountsSideBar />

				<div id="main">
					<div className="container center">
						<form action="/api/user/id" method="post">
							<input
								type="text"
								name="fullName"
								className="profile-input center"
								placeholder="Full Name"
								style={{ marginTop: "7%" }}
								onChange={event => this.handleChange("fullName", event.target.value)}
								value={this.state.fullName}
								required
							/>
							<input
								type="text"
								name="email"
								className="profile-input center"
								placeholder="Email"
								onChange={event => this.handleChange("email", event.target.value)}
								value={this.state.email}
								required
							/>

							<input
								type="text"
								name="website"
								className="profile-input center"
								placeholder="Website"
								onChange={event => this.handleChange("website", event.target.value)}
								value={this.state.website}
								required
							/>

							<input
								type="password"
								name="password"
								className="profile-input center"
								placeholder="Password"
								onChange={event => this.handleChange("password", event.target.value)}
								value={this.state.password}
								required
							/>

							<input
								className="center submit-colorful"
								type="submit"
								value="Save Changes"
								style={{ marginBottom: "5px" }}
								onClick={event => {
									this.saveUser(event);
								}}
							/>
						</form>
					</div>
				</div>
				{this.state.saving && <Loader />}
			</div>
		);
	}
}

export default Content;
