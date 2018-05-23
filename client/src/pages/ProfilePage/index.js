import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../redux/actions/";

import Loader from "../../components/Notifications/Loader/";
import "./style.css";

class Content extends Component {
	state = {
		fullName: "",
		email: "",
		website: "",
		password: "",
		saving: false
	};
	componentDidMount() {
		const { user } = this.props;
		const { fullName, email, website } = user;
		if (this.props.user) {
			this.setState({ fullName: fullName, email: email, website: website });
		}
	}

	handleChange = (index, value) => {
		this.setState({ [index]: value });
	};
	saveUser = event => {
		this.setState({ saving: true });

		const { fullName, email, website, password } = this.state;
		axios.post("/api/user/id", { fullName: fullName, email: email, website: website, password: password }).then(res => {
			if (res.data.success) {
				let user = res.data.result;
				this.setState({
					saving: false,
					fullName: user.fullName,
					email: user.email,
					website: user.website,
					password: ""
				});
				this.props.setUser(user);
			} else {
				this.setState({ saving: false });
				alert("Something went wrong! Contact your local DevNinja");
			}
		});
	};
	render() {
		const { fullName, email, website, password, saving } = this.state;
		return (
			<div id="wrapper" style={{ backgroundColor: "var(--light-blue-theme-color)" }}>
				<div>
					<div className="container center">
						<form>
							<input
								type="text"
								className="profile-input center"
								placeholder="Full Name"
								style={{ marginTop: "7%" }}
								onChange={event => this.handleChange("fullName", event.target.value)}
								value={fullName}
								required
							/>
							<input
								type="text"
								className="profile-input center"
								placeholder="Email"
								onChange={event => this.handleChange("email", event.target.value)}
								value={email}
								required
							/>

							<input
								type="text"
								className="profile-input center"
								placeholder="Website"
								onChange={event => this.handleChange("website", event.target.value)}
								value={website}
								required
							/>

							<input
								type="password"
								className="profile-input center"
								placeholder="Password"
								onChange={event => this.handleChange("password", event.target.value)}
								value={password}
								required
							/>
						</form>
						<button
							className="profile-save center"
							onClick={event => {
								this.saveUser(event);
							}}
						>
							Save Changes
						</button>
					</div>
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
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setUser: setUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
