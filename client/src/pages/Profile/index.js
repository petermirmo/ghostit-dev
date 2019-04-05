import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../redux/actions/";

import Page from "../../components/containers/Page";
import Loader from "../../components/notifications/Loader/";
import "./style.css";

class Profile extends Component {
  state = {
    fullName: "",
    email: "",
    website: "",
    password: "",
    newPassword: "",
    saving: false
  };
  constructor(props) {
    super(props);
    const { user } = props;

    if (props.user) {
      const { fullName, email, website } = user;

      this.state = {
        fullName,
        email,
        website,
        password: "",
        newPassword: "",
        saving: false
      };
    } else {
      //window.location.reload();
    }
  }
  componentDidMount() {}

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
        if (loggedIn === false) this.props.history.push("/sign-in");

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
      <Page title="Profile">
        <div className="profile-background flex vc hc">
          <div className="profile-container flex column br8 pa32">
            <p className="label mx8 mb4">Company Name</p>
            <input
              type="text"
              className="regular-input width100 border-box pa8 mb16 round"
              placeholder="Company Name"
              onChange={event =>
                this.handleChange("fullName", event.target.value)
              }
              value={fullName}
            />
            <p className="label mx8 mb4">Email</p>
            <input
              type="text"
              className="regular-input width100 border-box pa8 mb16 round"
              placeholder="Email"
              onChange={event => this.handleChange("email", event.target.value)}
              value={email}
            />
            <p className="label mx8 mb4">Website</p>
            <input
              type="text"
              className="regular-input width100 border-box pa8 mb16 round"
              placeholder="Website"
              onChange={event =>
                this.handleChange("website", event.target.value)
              }
              value={website}
            />
            <p className="label mx8 mb4">Password</p>
            <input
              type="password"
              className="regular-input width100 border-box pa8 mb16 round"
              placeholder="Password"
              onChange={event =>
                this.handleChange("password", event.target.value)
              }
              value={password}
            />
            <p className="label mx8 mb4">New Password</p>
            <input
              type="password"
              className="regular-input width100 border-box pa8 mb16 round"
              placeholder="New Password"
              onChange={event =>
                this.handleChange("newPassword", event.target.value)
              }
              value={newPassword}
            />
            <button
              className="regular-button margin-hc"
              onClick={event => {
                this.saveUser(event);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
        {saving && <Loader />}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setUser }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
