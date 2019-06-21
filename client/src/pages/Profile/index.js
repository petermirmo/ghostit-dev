import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../redux/actions/";

import Page from "../../components/containers/Page";
import Loader from "../../components/notifications/Loader/";
import FileUpload from "../../components/views/FileUpload/";
import GIText from "../../components/views/GIText/";
import GIButton from "../../components/views/GIButton/";
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
        <GIContainer className="column bg-light-grey x-fill align-center">
          <GIContainer className="bg-white column common-border x-70 br8 pa32 my64">
            <GIContainer className="x-fill align-center border-bottom-dashed mb8">
              <GIContainer className="column x-50">
                <GIText
                  className="label mx8 mb4"
                  text="Company Name"
                  type="p"
                />
                <input
                  type="text"
                  className="regular-input x-fill pa8 mb16 round"
                  placeholder="Company Name"
                  onChange={event =>
                    this.handleChange("fullName", event.target.value)
                  }
                  value={fullName}
                />
              </GIContainer>
              <GIContainer className="justify-end x-50">
                <GIContainer>
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
                </GIContainer>
              </GIContainer>
            </GIContainer>

            <GIContainer className="x-fill mt32">
              <GIContainer className="column fill-flex">
                <GIText className="label mx8 mb4" text="Email" type="p" />
                <input
                  type="text"
                  className="regular-input x-fill pa8 mb16 round"
                  placeholder="Email"
                  onChange={event =>
                    this.handleChange("email", event.target.value)
                  }
                  value={email}
                />
              </GIContainer>
              <GIContainer className="column fill-flex ml8">
                <GIText className="label mx8 mb4" text="Website" type="p" />
                <input
                  type="text"
                  className="regular-input x-fill pa8 mb16 round"
                  placeholder="Website"
                  onChange={event =>
                    this.handleChange("website", event.target.value)
                  }
                  value={website}
                />
              </GIContainer>
            </GIContainer>

            <GIContainer className="x-fill mt16">
              <GIContainer className="column fill-flex">
                <GIText className="label mx8 mb4" text="Password" type="p" />

                <input
                  type="password"
                  className="regular-input x-fill pa8 mb16 round"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  value={password}
                />
              </GIContainer>
              <GIContainer className="column fill-flex ml8">
                <GIText
                  className="label mx8 mb4"
                  text="New Password"
                  type="p"
                />
                <input
                  type="password"
                  className="regular-input x-fill pa8 mb16 round"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                  onChange={event =>
                    this.handleChange("newPassword", event.target.value)
                  }
                  value={newPassword}
                />
              </GIContainer>
            </GIContainer>
            <GIContainer className="full-center mt16">
              <GIButton
                className="blue-fade full-center"
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
                <FontAwesomeIcon className="mr8" icon={faCheck} />
                Save Changes
              </GIButton>
            </GIContainer>
          </GIContainer>
        </GIContainer>
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
