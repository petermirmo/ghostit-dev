import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../redux/actions/";

import Loader from "../../components/Notifications/Loader/";
import "./styles/";

class Profile extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    const { fullName, email, website } = user;
    if (props.user) {
      this.state = {
        fullName,
        email,
        website,
        password: "",
        newPassword: "",
        saving: false
      };
    } else {
      window.location.reload();
    }
  }
  handleChange = (index, value) => {
    this.setState({ [index]: value });
  };
  saveUser = event => {
    this.setState({ saving: true });

    const { fullName, email, website, password, newPassword } = this.state;
    const { user } = this.props;

    axios
      .post("/api/user/" + user._id, {
        fullName,
        email,
        website,
        password,
        newPassword
      })
      .then(res => {
        let { loggedIn, success, result, message } = res.data;
        if (loggedIn === false) window.location.reload();

        if (success) {
          let user = result;
          this.setState({
            saving: false,
            fullName: user.fullName,
            email: user.email,
            website: user.website,
            password: "",
            newPassword: ""
          });
          this.props.setUser(user);
        } else {
          this.setState({ saving: false });
          alert(message);
        }
      });
  };
  render() {
    const {
      fullName,
      email,
      website,
      password,
      newPassword,
      saving
    } = this.state;
    return (
      <div>
        <div className="profile-background flex vc hc">
          <div className="profile-container flex column br16 pa32">
            <div className="profile-label mx8 mb4">Company Name</div>
            <input
              type="text"
              className="profile-input pa8 mb16 round"
              placeholder="Full Name"
              onChange={event =>
                this.handleChange("fullName", event.target.value)
              }
              value={fullName}
            />
            <div className="profile-label mx8 mb4">Email</div>
            <input
              type="text"
              className="profile-input pa8 mb16 round"
              placeholder="Email"
              onChange={event => this.handleChange("email", event.target.value)}
              value={email}
            />
            <div className="profile-label mx8 mb4">Website</div>
            <input
              type="text"
              className="profile-input pa8 mb16 round"
              placeholder="Website"
              onChange={event =>
                this.handleChange("website", event.target.value)
              }
              value={website}
            />
            <div className="profile-label mx8 mb4">Password</div>
            <input
              type="password"
              className="profile-input pa8 mb16 round"
              placeholder="Password"
              onChange={event =>
                this.handleChange("password", event.target.value)
              }
              value={password}
            />
            <div className="profile-label mx8 mb4">New Password</div>
            <input
              type="password"
              className="profile-input pa8 mb16 round"
              placeholder="New Password"
              onChange={event =>
                this.handleChange("newPassword", event.target.value)
              }
              value={newPassword}
            />
            <button
              className="profile-save pa8 round"
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
