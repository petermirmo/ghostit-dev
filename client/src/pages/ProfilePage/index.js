import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import Loader from "../../components/Loader/";

import "./style.css";

class Content extends Component {
	state = {
		fullName: "",
		email: "",
		website: "",
		password: "",
		saving: false
	};
	constructor(props) {
		super(props);
		this.initialize = this.initialize.bind(this);
		this.initialize();
	}
	initialize() {
		// Get current user and fill in form data
		axios.get("/api/user").then(res => {
			const { fullName, email, website } = res.data;
			this.setState({ fullName: fullName, email: email, website: website, password: "" });
		});
	}
	handleChange = (index, value) => {
		this.setState({ [index]: value });
	};
	saveUser = event => {
		this.setState({ saving: true });
		event.preventDefault();
		const { fullName, email, website, password } = this.state;
		axios.post("/api/user/id", { fullName: fullName, email: email, website: website, password: password }).then(res => {
			if (res.data) {
				this.setState({ saving: false });
			} else {
				this.setState({ saving: false });
				alert("Something went wrong! Contact your local DevNinja");
			}
		});
	};
	render() {
		return (
			<div id="wrapper" style={{ backgroundColor: "var(--light-blue-theme-color)" }}>
				<Header activePage="profile" />
				<ConnectAccountsSideBar />

				<div id="main">
					<div className="container center">
						<form>
							<input
								type="text"
								className="profile-input center"
								placeholder="Full Name"
								style={{ marginTop: "7%" }}
								onChange={event => this.handleChange("fullName", event.target.value)}
								value={this.state.fullName}
								required
							/>
							<input
								type="text"
								className="profile-input center"
								placeholder="Email"
								onChange={event => this.handleChange("email", event.target.value)}
								value={this.state.email}
								required
							/>

							<input
								type="text"
								className="profile-input center"
								placeholder="Website"
								onChange={event => this.handleChange("website", event.target.value)}
								value={this.state.website}
								required
							/>

							<input
								type="password"
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
