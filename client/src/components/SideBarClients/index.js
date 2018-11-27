import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setUser,
  updateAccounts,
  openClientSideBar
} from "../../redux/actions/";

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
        if (loggedIn === false) this.props.history.push("/sign-in");
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
      <div className="navbar pa16">
        <SearchColumn
          objectList={this.state.untouchedClients}
          indexSearch="fullName"
          indexSearch2="email"
          handleClickedObject={this.userClicked}
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
      setUser,
      updateAccounts,
      openClientSideBar
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientSideBar);
