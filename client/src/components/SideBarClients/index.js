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
		clients: [],
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
					this.setState({ clients: users, untouchedClients: users });
				}
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};
	searchUsers = event => {
		let value = event.target.value;
		if (value === "") {
			this.setState({ activeUsers: this.state.untouchedClients });
			return;
		}
		let stringArray = value.split(" ");

		let users = [];
		// Loop through all users
		for (let index in this.state.untouchedClients) {
			let matchFound = false;
			// Loop through all words in the entered value
			for (let j in stringArray) {
				// Make sure we are not checking an empty string
				if (stringArray[j] !== "") {
					// Check to see if a part of the string matches user's fullName or email
					if (
						this.state.untouchedClients[index].fullName.includes(stringArray[j]) ||
						this.state.untouchedClients[index].email.includes(stringArray[j])
					) {
						matchFound = true;
					}
				}
			}
			if (matchFound) {
				users.push(this.state.untouchedClients[index]);
			}
		}
		this.setState({ clients: users });
	};
	userClicked = event => {
		// ID of clicked event is the index of in activeUsers of the clicked user
		const temp = this.state.clients[event.target.id];
		this.setState({ clickedUser: temp });
		axios.post("/api/signInAsUser", temp).then(res => {
			window.location.reload();
		});
	};
	render() {
		return (
			<div className="side-bar">
				<FontAwesomeIcon icon={faTimes} size="2x" className="close" onClick={this.closeClientSideBar} />

				<SearchColumn
					objectList={this.state.clients}
					searchObjects={this.searchUsers}
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
