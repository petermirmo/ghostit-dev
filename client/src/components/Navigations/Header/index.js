import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faSignOutAlt from "@fortawesome/fontawesome-free-solid/faSignOutAlt";
import faUser from "@fortawesome/fontawesome-free-solid/faUser";
import faCalendar from "@fortawesome/fontawesome-free-solid/faCalendar";
import faDoorOpen from "@fortawesome/fontawesome-free-solid/faDoorOpen";
import faFileAlt from "@fortawesome/fontawesome-free-solid/faFileAlt";
import faCogs from "@fortawesome/fontawesome-free-solid/faCogs";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faStar from "@fortawesome/fontawesome-free-solid/faStar";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts, openClientSideBar, openHeaderSideBar } from "../../../redux/actions/";
import "./styles/";

class HeaderSideBar extends Component {
	closeHeaderSideBar = () => {
		this.props.openHeaderSideBar(false);
	};
	signOutOfUsersAccount = () => {
		axios.get("/api/signOutOfUserAccount").then(res => {
			let { success, loggedIn, user } = res.data;
			if (success) {
				this.props.setUser(user);
				window.location.reload();
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};
	isActive = page => {
		switch (this.props.activePage) {
			case page:
				return " header-active";
			default:
				return "";
		}
	};
	logout = () => {
		axios.get("/api/logout").then(res => {
			let { success, loggedIn } = res.data;
			if (success) {
				this.props.setUser(null);
				this.props.updateAccounts([]);
				this.props.changePage("");
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};
	render() {
		const { user, activePage } = this.props;
		const { changePage } = this.props;

		if (!user) {
			changePage("");
			return <div style={{ display: "none" }} />;
		}

		let isAdmin = user.role === "admin";
		let isManager = user.role === "manager";
		return (
			<div className="header-navbar">
				<div className="navbar">
					<FontAwesomeIcon icon={faTimes} size="2x" className="close" onClick={this.closeHeaderSideBar} />
					<div className="main-nav">
						{(user.role === "demo" || isAdmin) && (
							<a className={"header-button" + this.isActive("subscribe")} onClick={() => changePage("subscribe")}>
								<FontAwesomeIcon icon={faStar} /> Become Awesome
							</a>
						)}

						<a className={"header-button" + this.isActive("content")} onClick={() => changePage("content")}>
							<FontAwesomeIcon icon={faCalendar} /> Calendar
						</a>

						<a className={"header-button" + this.isActive("accounts")} onClick={() => changePage("accounts")}>
							<FontAwesomeIcon icon={faPlus} /> Social Profiles
						</a>

						{isAdmin && (
							<a className={"header-button " + this.isActive("manage")} onClick={() => changePage("manage")}>
								<FontAwesomeIcon icon={faCogs} /> Manage
							</a>
						)}

						<a
							className={"header-button dropdown-display-button " + this.isActive("profile")}
							onClick={() => changePage("profile")}
						>
							<FontAwesomeIcon icon={faUser} /> Profile
						</a>
						<a className="header-button" onClick={() => this.logout()}>
							<FontAwesomeIcon icon={faSignOutAlt} /> Logout
						</a>
						{(isAdmin || isManager) && (
							<a className={"header-button" + this.isActive("writersBrief")} onClick={() => changePage("writersBrief")}>
								<FontAwesomeIcon icon={faFileAlt} /> Monthly Strategy
							</a>
						)}
						{(isAdmin || isManager) && (
							<a className={"header-button" + this.isActive("strategy")} onClick={() => changePage("strategy")}>
								<FontAwesomeIcon icon={faFileAlt} /> Your Questionnaire
							</a>
						)}
						{isAdmin && (
							<a className={"header-button " + this.isActive("analytics")} onClick={() => changePage("analytics")}>
								New Feature
							</a>
						)}
					</div>
				</div>

				{(activePage === "content" ||
					activePage === "strategy" ||
					activePage === "newCalendar" ||
					activePage === "writersBrief" ||
					activePage === "subscribe" ||
					activePage === "accounts") &&
					user.signedInAsUser && (
						<div className="signed-in-as-header center">
							<p>Logged in as: {user.signedInAsUser.fullName}</p>
							<FontAwesomeIcon
								icon={faTimes}
								onClick={() => this.signOutOfUsersAccount()}
								className="sign-out-of-clients-account"
							/>
						</div>
					)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		activePage: state.activePage,
		user: state.user,
		clientSideBar: state.clientSideBar
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			changePage: changePage,
			setUser: setUser,
			openClientSideBar: openClientSideBar,
			openHeaderSideBar: openHeaderSideBar,
			updateAccounts: updateAccounts
		},
		dispatch
	);
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderSideBar);
