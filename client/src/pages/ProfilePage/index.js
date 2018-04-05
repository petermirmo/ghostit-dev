import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";

class Content extends Component {
	state = {
		user: {
			fullName: "",
			email: "",
			website: "",
			password: "",
			timezone: ""
		}
	};
	constructor(props) {
		super(props);

		// Get current user and fill in form data
		axios.get("/api/user").then(function(res) {
			document.getElementById("fullNameProfileInput").value = res.data.fullName;
			document.getElementById("emailProfileInput").value = res.data.email;
			document.getElementById("websiteProfileInput").value = res.data.website;
			document.getElementById("timezoneProfileInput").value = res.data.timezone;
			document.getElementById("passwordProfileInput").value = null;
		});
	}
	render() {
		return (
			<div id="wrapper" style={{ backgroundColor: "var(--light-blue-theme-color)" }}>
				<Header activePage="profile" />
				<ConnectAccountsSideBar />

				<div id="main">
					<div className="container center">
						<form action="/api/user/id" method="post">
							<input
								id="fullNameProfileInput"
								type="text"
								name="fullName"
								className="profile-input center"
								placeholder="Full Name"
								style={{ marginTop: "7%" }}
								autoComplete="new-password"
								required
							/>
							<input
								id="emailProfileInput"
								type="text"
								name="email"
								className="profile-input center"
								placeholder="Email"
								autoComplete="new-password"
								required
							/>

							<input
								id="websiteProfileInput"
								type="text"
								name="website"
								className="profile-input center"
								placeholder="Website"
								autoComplete="new-password"
								required
							/>
							<input
								id="timezoneProfileInput"
								name="timezone"
								placeholder="Timezone"
								className="profile-input center"
								autoComplete="new-password"
							/>
							<input
								id="passwordProfileInput"
								type="password"
								name="password"
								className="profile-input center"
								placeholder="Password"
								autoComplete="new-password"
								required
							/>

							<input
								className="center submit-colorful"
								type="submit"
								value="Save Changes"
								style={{ marginBottom: "5px" }}
							/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Content;