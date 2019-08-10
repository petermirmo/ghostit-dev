import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser, setAccounts } from "../../redux/actions/";

import SearchColumn from "../SearchColumn/";
import "./style.css";

class ClientSideBar extends Component {
  state = {
    untouchedClients: []
  };
  constructor(props) {
    super(props);

    this.getMyClients();
  }
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  getMyClients = () => {
    axios.get("/api/clients").then(res => {
      let { users, loggedIn, success } = res.data;

      if (success) {
        if (Array.isArray(users)) {
          users.sort(compare);
          if (this._ismounted) this.setState({ untouchedClients: users });
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
    const { untouchedClients } = this.state;
    return (
      <div
        className="bg-white animate-from-left-100 pa16 ml16 br16"
        style={{ zIndex: "1" }}
      >
        <SearchColumn
          objectList={untouchedClients}
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
      setAccounts
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientSideBar);
