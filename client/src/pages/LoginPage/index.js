import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { changePage, setUser } from "../../actions/";
import logo from "./logo.png";
import Notification from "../../components/Notification/";
import "./style.css";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class Login extends Component {
	state = {
		login: false,
		fullName: "",
		email: "",
		website: "",
		timezone: timezone ? timezone : "America/Vancouver",
		password: "",
		notification: {
			on: false,
			title: "Something went wrong!",
			message: "",
			notificationType: "danger"
		}
	};

	handleChange = (index, value) => {
		this.setState({ [index]: value });
	};
	notify = message => {
		let { notification } = this.state;
		notification.on = !notification.on;
		if (message) notification.message = message;
		this.setState({ notification: notification });

		if (notification.on) {
			setTimeout(() => {
				let { notification } = this.state;
				notification.on = false;
				this.setState({ notification: notification });
			}, 5000);
		}
	};
	login = event => {
		event.preventDefault();
		const { email, password } = this.state;
		let { notification } = this.state;

		if (email && password) {
			axios.post("/api/login", { email: email, password: password }).then(res => {
				const { success, user, message } = res.data;

				if (success) {
					this.props.setUser(user);
					this.props.changePage("content");
				} else {
					this.notify(message);
				}
			});
		}
	};
	register = event => {
		event.preventDefault();
		const { fullName, email, website, timezone, password } = this.state;
		let { notification } = this.state;

		if (fullName && email && website && timezone && password) {
			axios
				.post("/api/register", {
					fullName: fullName,
					email: email,
					website: website,
					timezone: timezone,
					password: password
				})
				.then(res => {
					const { success, user, message } = res.data;

					if (success) {
						this.props.setUser(user);
						this.props.changePage("content");
					} else {
						this.notify(message);
					}
				});
		}
	};
	render() {
		const { login, fullName, email, website, password, notification } = this.state;

		return (
			<div className="login-background">
				{notification.on && (
					<Notification
						title={notification.title}
						message={notification.message}
						notificationType={notification.notificationType}
						callback={this.notify}
					/>
				)}
				<img src={logo} alt="logo" />

				<div className="login-box">
					{login && (
						<div>
							<form className="form-box" action="/api/auth/login" method="post">
								<input
									className="login-input"
									value={email}
									onChange={event => this.handleChange("email", event.target.value)}
									type="text"
									name="email"
									placeholder="Email"
									required
								/>
								<input
									className="login-input password"
									value={password}
									onChange={event => this.handleChange("password", event.target.value)}
									name="password"
									placeholder="Password"
									required
								/>
								<button className="submit-colorful" onClick={this.login} type="submit">
									Sign In
								</button>
							</form>

							<br />
							<div className="login-switch center" href="#" onClick={event => this.handleChange("login", !login)}>
								New to Ghostit? <h4 className="login-switch-highlight"> Sign Up</h4>
							</div>
						</div>
					)}
					{!login && (
						<div>
							<form className="form-box" action="api/user" method="post">
								<input
									className="login-input"
									value={fullName}
									onChange={event => this.handleChange("fullName", event.target.value)}
									type="text"
									name="fullName"
									placeholder="Full Name"
									required
								/>

								<input
									className="login-input"
									value={email}
									onChange={event => this.handleChange("email", event.target.value)}
									type="text"
									name="email"
									placeholder="Email"
									required
								/>

								<input
									className="login-input"
									value={website}
									onChange={event => this.handleChange("website", event.target.value)}
									type="text"
									name="website"
									placeholder="Website"
									required
								/>

								<input
									className="login-input password"
									value={password}
									onChange={event => this.handleChange("password", event.target.value)}
									name="password"
									placeholder="Password"
									required
								/>

								<button className="submit-colorful" onClick={this.register} type="submit">
									Register
								</button>
							</form>

							<br />
							<div className="login-switch center" href="#" onClick={event => this.handleChange("login", !login)}>
								Have an account? <h4 className="login-switch-highlight"> Sign In</h4>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { activePage: state.activePage };
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ changePage: changePage, setUser: setUser }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
