import React, { Component } from "react";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faSignOut } from "@fortawesome/pro-solid-svg-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser, setAccounts } from "../../redux/actions/";

import Page from "../../components/containers/Page";
import Loader from "../../components/notifications/Loader/";
import FileUpload from "../../components/views/FileUpload/";
import GIText from "../../components/views/GIText/";
import GIButton from "../../components/views/GIButton/";
import GIContainer from "../../components/containers/GIContainer/";

import Consumer from "../../context";

import { logout, saveUser } from "./util";

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
      newPassword2: "",
      currentPassword: "",
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
      newPassword2,
      currentPassword,
      website
    } = userFields;

    const { setAccounts, setUser, user } = this.props;

    return (
      <Consumer>
        {context => (
          <Page className="bg-light-grey" title="Profile">
            <GIContainer className="column x-fill align-center">
              <GIContainer className="full-center border-bottom x-fill py16">
                <GIText className="muli" text="Profile" type="h2" />
                <Link to="/sign-in">
                  <GIButton
                    className="five-blue bg-white shadow-2 absolute top-0 right-0 px16 py8 br16"
                    onClick={() =>
                      logout(() => {
                        context.handleChange({ user: null });
                        setUser(null);
                        setAccounts([]);
                        window.location.reload();
                      })
                    }
                  >
                    <FontAwesomeIcon className="mr8" icon={faSignOut} />
                    Logout
                  </GIButton>
                </Link>
                {((user && user.role === "client") ||
                  user.role === "admin") && (
                  <Link
                    className="bg-white shadow-2 absolute top-0 left-0 px16 py8 br16"
                    to="/subscription"
                  >
                    <GIButton className="five-blue" text="Billing History" />
                  </Link>
                )}
              </GIContainer>
              <GIContainer className="bg-white column common-border x-70 br8 my64">
                <GIContainer className="column x-fill border-bottom-dashed pa32">
                  <GIContainer className="x-fill align-center">
                    <GIContainer className="column x-50 pr4">
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
                          className="xy-128px round x-fill full-center"
                          currentFiles={image ? [image] : []}
                          fileLimit={1}
                          filesToDelete={[]}
                          handleParentChange={parentStateChangeObject => {
                            if (parentStateChangeObject.files)
                              this.handleChange(
                                "image",
                                parentStateChangeObject.files[0]
                              );
                            else this.handleChange("image", undefined);
                          }}
                          id="hjqgf"
                          imageClassName="flex x-128px"
                          imageContainerClassName="xy-128px ov-hidden align-start round"
                          imageOnly={true}
                        />
                      </GIContainer>
                    </GIContainer>
                  </GIContainer>
                  <GIContainer className="x-fill pt32">
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
                      <GIText
                        className="label mx8 mb4"
                        text="Website"
                        type="p"
                      />
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
                </GIContainer>

                <GIContainer className="x-fill px32 pb16 mt32">
                  <GIText text="Change Password" type="h4" />
                </GIContainer>

                <GIContainer className="x-fill px32 pb16">
                  <GIContainer className="column x-50 pr4">
                    <GIText
                      className="label mx8 mb4"
                      text="Current Password"
                      type="p"
                    />

                    <input
                      type="password"
                      className="regular-input x-fill pa8 mb16 round"
                      placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                      onChange={event =>
                        this.handleChange("currentPassword", event.target.value)
                      }
                      value={currentPassword}
                    />
                  </GIContainer>
                </GIContainer>
                <GIContainer className="x-fill px32 pb16">
                  <GIContainer className="column fill-flex">
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
                  <GIContainer className="column fill-flex ml8">
                    <GIText
                      className="label mx8 mb4"
                      text="New Password Confirm"
                      type="p"
                    />

                    <input
                      type="password"
                      className="regular-input x-fill pa8 mb16 round"
                      placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                      onChange={event =>
                        this.handleChange("newPassword2", event.target.value)
                      }
                      value={newPassword2}
                    />
                  </GIContainer>
                </GIContainer>
                <GIContainer className="full-center pb32">
                  <GIButton
                    className="blue-fade white full-center"
                    onClick={event => {
                      const { userFields } = this.state;
                      const { history, user } = this.props; // Variables
                      const { setUser } = this.props; // Functions
                      if (userFields.newPassword || userFields.newPassword2) {
                        if (userFields.newPassword !== userFields.newPassword2)
                          return alert("New passwords do not match!");
                        else if (
                          userFields.newPassword === userFields.newPassword2 &&
                          !userFields.currentPassword
                        )
                          return alert(
                            "You must enter your current password to change passwords."
                          );
                      }
                      this.setState({ saving: true });
                      saveUser(
                        userFields,
                        user._id,
                        updatedUser => {
                          setUser(updatedUser);
                          context.handleChange({ user: updatedUser });
                          this.setState({
                            userFields: this.setUserToState(updatedUser),
                            saving: false
                          });
                        },
                        history
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
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccounts, setUser }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
