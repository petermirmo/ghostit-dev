import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../redux/actions/";

import Page from "../../components/containers/Page";
import Loader from "../../components/notifications/Loader/";
import FileUpload from "../../components/views/FileUpload/";
import GIContainer from "../../components/containers/GIContainer/";

import { saveUser } from "./util";

import "./style.css";

class Profile extends Component {
  state = { saving: false };
  constructor(props) {
    super(props);
    const { user } = props;

    if (user) {
      this.state = { userFields: this.setUserToState(user) };
    } else {
      //window.location.reload();
      // Todo handle error
    }
  }
  setUserToState = user => {
    const { fullName = "", email = "", image, website = "" } = user;
    return {
      email,
      fullName,
      image,
      newPassword: "",
      password: "",
      website
    };
  };

  handleChange = (index, value) => {
    let { userFields } = this.state;
    userFields[index] = value;
    this.setState({ userFields });
  };

  render() {
    const { saving, userFields } = this.state;
    const {
      email,
      fullName,
      image,
      newPassword,
      password,
      website
    } = userFields;

    return (
      <Page title="Profile">
        <div className="profile-background flex vc hc">
          <div className="profile-container flex column br8 pa32">
            <GIContainer className="x-fill align-center mb8">
              <FileUpload
                canEdit={true}
                className="profile-image-container medium round"
                currentFiles={image ? [image] : []}
                handleParentChange={parentStateChangeObject => {
                  if (parentStateChangeObject.files)
                    this.handleChange(
                      "image",
                      parentStateChangeObject.files[0]
                    );
                  else this.handleChange("image", undefined);
                }}
                fileLimit={1}
                filesToDelete={[]}
                id="hjqgf"
                imageClassName="profile-image medium"
                imageContainerClassName="profile-image-container medium round"
                imageOnly={true}
              />
              <GIContainer className="column fill-flex ml8">
                <p className="label mx8 mb4">Company Name</p>
                <input
                  type="text"
                  className="regular-input width100 pa8 mb16 round"
                  placeholder="Company Name"
                  onChange={event =>
                    this.handleChange("fullName", event.target.value)
                  }
                  value={fullName}
                />
              </GIContainer>
            </GIContainer>

            <GIContainer className="x-fill">
              <GIContainer className="column fill-flex">
                <p className="label mx8 mb4">Email</p>
                <input
                  type="text"
                  className="regular-input width100 pa8 mb16 round"
                  placeholder="Email"
                  onChange={event =>
                    this.handleChange("email", event.target.value)
                  }
                  value={email}
                />
              </GIContainer>
              <GIContainer className="column fill-flex ml8">
                <p className="label mx8 mb4">Website</p>
                <input
                  type="text"
                  className="regular-input width100 pa8 mb16 round"
                  placeholder="Website"
                  onChange={event =>
                    this.handleChange("website", event.target.value)
                  }
                  value={website}
                />
              </GIContainer>
            </GIContainer>

            <GIContainer className="x-fill">
              <GIContainer className="column fill-flex">
                <p className="label mx8 mb4">Password</p>
                <input
                  type="password"
                  className="regular-input width100 pa8 mb16 round"
                  placeholder="Password"
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  value={password}
                />
              </GIContainer>
              <GIContainer className="column fill-flex ml8">
                <p className="label mx8 mb4">New Password</p>
                <input
                  type="password"
                  className="regular-input width100 pa8 mb16 round"
                  placeholder="New Password"
                  onChange={event =>
                    this.handleChange("newPassword", event.target.value)
                  }
                  value={newPassword}
                />
              </GIContainer>
            </GIContainer>
            <button
              className="regular-button margin-hc"
              onClick={event => {
                this.setState({ saving: true });
                const { userFields } = this.state;
                const { user } = this.props;

                saveUser(
                  userFields,
                  user._id,
                  updatedUser => {
                    this.props.setUser(updatedUser);
                    this.setState({
                      userFields: this.setUserToState(updatedUser),
                      saving: false
                    });
                  },
                  this.props
                );
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
