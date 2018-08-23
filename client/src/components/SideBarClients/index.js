import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser, updateAccounts, changePage, openClientSideBar } from "../../redux/actions/";

import SearchColumn from "../SearchColumn/";
import "./styles/";

class ClientSideBar extends Component {
	state = {
		untouchedClients: []
	};
	constructor(props) {
		super(props);

		this.getMyClients();
	}
	closeClientSideBar = () => {
		this.props.openClientSideBar(false);
	};
	getMyClients = () => {
		axios.get("/api/clients").then(res => {
			let { users, loggedIn, success } = res.data;

			if (success) {
				if (Array.isArray(users)) {
					users.sort(compare);
					this.setState({ untouchedClients: users });
				}
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};
	userClicked = user => {
		// ID of clicked event is the index of in activeUsers of the clicked user
		this.setState({ clickedUser: user });
		axios.post("/api/signInAsUser", user).then(res => {
			window.location.reload();
		});
	};
	render() {
		return (
			<div className="side-bar">
				<FontAwesomeIcon icon={faTimes} size="2x" className="close" onClick={this.closeClientSideBar} />

				<SearchColumn
					objectList={this.state.untouchedClients}
					indexSearch="fullName"
					indexSearch2="email"
					handleClickedObject={this.userClicked}
					styleOverride={{ width: "90%", marginTop: "70px", position: "absolute" }}
				/>
			</div>
		);
	}
}
function compare(a, b) {
	if (a.fullName < b.fullName) return -1;
	if (a.fullName > b.fullName) return 1;
	return 0;
}

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setUser: setUser,
			updateAccounts: updateAccounts,
			changePage: changePage,
			openClientSideBar: openClientSideBar
		},
		dispatch
	);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ClientSideBar);
