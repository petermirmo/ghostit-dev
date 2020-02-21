import React, { Component } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/pro-light-svg-icons/faCalendarCheck";
import { faUsers } from "@fortawesome/pro-light-svg-icons/faUsers";
import {faBars}  from "@fortawesome/free-solid-svg-icons/faBars";
import {faCalendar}  from "@fortawesome/free-solid-svg-icons/faCalendar";
import {faEllipsisV}  from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import {faPlus}  from "@fortawesome/free-solid-svg-icons/faPlus";

import { connect } from "react-redux";

import Loader from "../../../components/notifications/Loader";
import ConfirmAlert from "../../../components/notifications/ConfirmAlert";

import CollapsibleMenu from "../../../components/views/CollapsibleMenu";
import GIButton from "../../../components/views/GIButton";
import GIInput from "../../../components/views/GIInput";
import GIText from "../../../components/views/GIText";
import GIContainer from "../../../components/containers/GIContainer";

import Consumer, { ExtraContext } from "../../../context";

import {
  capitolizeFirstChar,
  capitolizeWordsInString,
  getPostIcon,
  getPostColor,
  getPostIconRound,
  validateEmail
} from "../../../componentFunctions";

import {
  createNewCalendar,
  didUserConnectAccount,
  deleteCalendar,
  deleteCalendarClicked,
  inviteUser,
  isUserOnline,
  leaveCalendar,
  promoteUser,
  removePendingEmail,
  removeUserFromCalendar,
  saveCalendarName,
  setDefaultCalendar,
  unlinkSocialAccount
} from "./util";

import { getCalendarUsers, isUserAdminOfCalendar } from "../util";

import {
  getAccountOptions,
  getCalendarOptions,
  getUserOptions
} from "./getSideBarOptionFunctions";

import { createName } from "../../../components/postingFiles/SelectAccountDiv/util";

import "./style.css";

class CalendarSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmAlert: {},
      deleteCalendarPrompt: false,
      editingCalendarIndex: 0,
      inviteEmailString: "",
      inviteUsersInputBoolean: false,
      leaveCalendarIndex: undefined,
      leaveCalendarPrompt: false,
      open: true,
      removeUserPrompt: false,
      renameCalendarString: "",
      renameCalendarBoolean: false,
      promoteUserPrompt: false,
      unlinkAccountPrompt: false,
      unsavedChange: false
    };
  }
  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject);
    if (callback) callback();
  };

  render() {
    const {
      deleteCalendarPrompt,
      editingCalendarIndex,
      inviteUsersInputBoolean,
      inviteEmailString,
      leaveCalendarIndex,
      leaveCalendarPrompt,
      open,
      promoteUserObj,
      promoteUserPrompt,
      removeUserObj,
      removeUserPrompt,
      renameCalendarBoolean,
      renameCalendarString,
      unLinkAccountID,
      unlinkAccountPrompt,
      unsavedChange
    } = this.state;
    const { handleParentChange, updateActiveCalendar, userList } = this.props;
    const { activeCalendarIndex, calendars, defaultCalendarID } = this.context;

    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    const calendar = calendars[activeCalendarIndex];
    const isDefaultCalendar =
      calendar._id.toString() === defaultCalendarID.toString();
    const isAdmin = calendars[activeCalendarIndex].adminID === userID;
    if (!open)
      return (
        <GIContainer
          className="absolute top-0 right-0 clickable shadow-7 five-blue px8 py8"
          onClick={() => this.handleChange({ open: true })}
        >
          <FontAwesomeIcon icon={faBars} />
        </GIContainer>
      );
    return (
      <Consumer>
        {context => (
          <GIContainer
            className="x-fill column shadow-7"
            style={{ width: "20%" }}
          >
            <GIContainer
              className="full-center x-fill clickable shadow-7 five-blue px8 py8"
              onClick={() => this.handleChange({ open: false })}
            >
              <FontAwesomeIcon icon={faBars} />
            </GIContainer>
            {calendars && (
              <CollapsibleMenu
                activeIcon={faCalendarCheck}
                activeIndex={activeCalendarIndex}
                firstButton={
                  <GIContainer className="x-fill column bg-queen-blue px16">
                    <GIText
                      className="x-fill flex full-center clickable orange bg-queen-blue px16 py8"
                      onClick={() =>
                        createNewCalendar(
                          context,
                          calendars.length,
                          "Calendar " + calendars.length,
                          updateActiveCalendar
                        )
                      }
                      text="Make a New Calendar"
                      type="p"
                    />
                    {renameCalendarBoolean && (
                      <GIContainer className="x-fill column">
                        <GIInput
                          className="x-fill mb8 br4"
                          onChange={e =>
                            this.handleChange({
                              renameCalendarString: e.target.value
                            })
                          }
                          placeholder="My Awesome Calendar"
                          value={renameCalendarString}
                        />
                        <GIButton
                          className="fs-14 white bg-blue-fade-2 px16 py8 mb16 br4"
                          onClick={index => {
                            saveCalendarName(
                              calendars,
                              context,
                              editingCalendarIndex,
                              renameCalendarString
                            );
                            this.handleChange({ renameCalendarBoolean: false });
                          }}
                          text="Save Name"
                        />
                      </GIContainer>
                    )}
                  </GIContainer>
                }
                list={calendars}
                listObjKey="calendarName"
                listOnClick={updateActiveCalendar}
                options={index =>
                  getCalendarOptions(
                    calendars[index],
                    calendars,
                    context,
                    deleteCalendarClicked,
                    this.handleChange,
                    isUserAdminOfCalendar,
                    setDefaultCalendar
                  )
                }
                title="Calendars"
                titleIcon={faCalendar}
              />
            )}
            {calendar.accounts && (
              <CollapsibleMenu
                list={calendar.accounts.map((account, index) => (
                  <GIContainer className="x-70 align-center">
                    <FontAwesomeIcon
                      className="full-center common-border font-color primary-font round round-icon pa8 mr8"
                      icon={getPostIconRound(account.socialType)}
                    />
                    <GIContainer className="x-85">
                      <GIText
                        className="ellipsis"
                        text={createName(account)}
                        type="p"
                      />
                    </GIContainer>
                  </GIContainer>
                ))}
                options={index =>
                  getAccountOptions(
                    calendar.accounts[index],
                    calendar,
                    context,
                    this.handleChange,
                    isUserAdminOfCalendar
                  )
                }
                title="Social Accounts"
                titleIcon={faPlus}
              />
            )}
            {calendar.users && (
              <CollapsibleMenu
                firstButton={
                  isUserAdminOfCalendar(calendar, context.getUser()) ? (
                    <GIContainer className="x-fill column bg-queen-blue px16">
                      <GIText
                        className={`x-fill flex full-center clickable orange mb8 ${
                          inviteUsersInputBoolean ? "mt16" : "mt8"
                        }`}
                        onClick={() =>
                          this.handleChange({ inviteUsersInputBoolean: true })
                        }
                        text="Invite New Users"
                        type="p"
                      />
                      {inviteUsersInputBoolean && (
                        <GIContainer className="x-fill column">
                          <GIInput
                            className="x-fill mb8 br4"
                            onChange={e =>
                              this.handleChange({
                                inviteEmailString: e.target.value
                              })
                            }
                            placeholder="brucewayne@ghostit.co"
                            value={inviteEmailString}
                          />
                          <GIButton
                            className="fs-14 white bg-blue-fade-2 px16 py8 mb16 br4"
                            onClick={() => {
                              if (validateEmail(inviteEmailString)) {
                                inviteUser(
                                  calendars,
                                  context,
                                  activeCalendarIndex,
                                  inviteEmailString
                                );
                                this.handleChange({
                                  inviteEmailString: "",
                                  inviteUsersInputBoolean: false
                                });
                              } else alert("Not a real email address!");
                            }}
                            text="Invite User"
                          />
                        </GIContainer>
                      )}
                    </GIContainer>
                  ) : (
                    ""
                  )
                }
                list={[
                  ...calendar.users.map((user, index) => (
                    <GIContainer className="x-85 align-center" key={index}>
                      <GIContainer className="x-fill column mr16">
                        <GIContainer className="x-fill wrap align-center">
                          <GIText className="ellipsis" type="h6">
                            {user.fullName}{" "}
                          </GIText>
                          {isUserAdminOfCalendar(calendar, user) && (
                            <GIText
                              className="green fw-normal"
                              text="(Admin)"
                              type="span"
                            />
                          )}
                          {isUserOnline(calendar, user, userList) && (
                            <GIContainer className="dot small bg-green ml4" />
                          )}
                        </GIContainer>
                        <GIText className="grey" text={user.email} type="p" />
                      </GIContainer>
                    </GIContainer>
                  )),
                  ...calendar.emailsInvited.map((email, index) => (
                    <GIContainer className="x-85 align-center" key={index}>
                      <GIContainer className="x-fill column mr16">
                        <GIContainer className="x-fill wrap">
                          <GIText className="ellipsis" text={email} type="h6" />
                        </GIContainer>
                      </GIContainer>
                    </GIContainer>
                  ))
                ]}
                options={index =>
                  getUserOptions(
                    activeCalendarIndex,
                    calendar,
                    context,
                    this.handleChange,
                    index,
                    isUserAdminOfCalendar,
                    removePendingEmail,
                    calendar.users[index]
                  )
                }
                title="Calendar Users"
                titleIcon={faUsers}
              />
            )}
            {leaveCalendarPrompt && (
              <ConfirmAlert
                close={() => this.setState({ leaveCalendarPrompt: false })}
                title="Leave Calendar"
                message="Are you sure you want to leave this calendar? Any accounts you linked or posts you scheduled WILL NOT be deleted."
                callback={response => {
                  this.setState({ leaveCalendarPrompt: false });
                  if (response)
                    leaveCalendar(
                      calendars,
                      context,
                      leaveCalendarIndex,
                      updateActiveCalendar
                    );
                }}
                firstButton="Leave"
                type="delete-calendar"
              />
            )}
            {deleteCalendarPrompt && (
              <ConfirmAlert
                close={() => this.setState({ deleteCalendarPrompt: false })}
                title="Delete Calendar"
                message="Are you sure you want to delete this Calendar? All posts within the calendar will be deleted as well."
                extraConfirmationMessage={`Type "DELETE" in the text box and click Delete.`}
                extraConfirmationKey={"DELETE"}
                callback={response => {
                  this.setState({ deleteCalendarPrompt: false });
                  if (response)
                    deleteCalendar(
                      calendars,
                      context,
                      activeCalendarIndex,
                      updateActiveCalendar
                    );
                }}
                type="delete-calendar"
              />
            )}
            {unlinkAccountPrompt && (
              <ConfirmAlert
                close={() =>
                  this.setState({
                    unlinkAccountPrompt: false,
                    unLinkAccountID: undefined
                  })
                }
                title="Unlink Account"
                message="Are you sure you want to remove this account from the calendar. Note: this does not delete any already scheduled posts."
                callback={response => {
                  this.setState({
                    unlinkAccountPrompt: false,
                    unLinkAccountID: undefined
                  });
                  if (response)
                    unlinkSocialAccount(
                      unLinkAccountID,
                      activeCalendarIndex,
                      calendars,
                      context
                    );
                }}
                type="delete-calendar"
                firstButton="Unlink"
              />
            )}
            {removeUserPrompt && (
              <ConfirmAlert
                close={() =>
                  this.setState({
                    removeUserPrompt: false,
                    removeUserObj: undefined
                  })
                }
                title="Remove User"
                message="Are you sure you want to remove this user from the calendar?"
                firstButton="Remove"
                callback={response => {
                  this.setState({
                    removeUserPrompt: false,
                    removeUserObj: undefined
                  });
                  if (response)
                    removeUserFromCalendar(
                      removeUserObj.calendarIndex,
                      calendars,
                      context,
                      getCalendarUsers,
                      context.handleCalendarChange,
                      removeUserObj.userIndex
                    );
                }}
                type="delete-calendar"
              />
            )}
            {promoteUserPrompt && (
              <ConfirmAlert
                close={() =>
                  this.setState({
                    promoteUserPrompt: false,
                    promoteUserObj: undefined
                  })
                }
                title="Promote User"
                message="Are you sure you want to promote this user to be the new calendar admin? (You will be demoted to a regular user)"
                firstButton="Promote"
                callback={response => {
                  this.setState({
                    promoteUserPrompt: false,
                    promoteUserObj: undefined
                  });
                  if (response)
                    promoteUser(
                      promoteUserObj.calendarIndex,
                      calendars,
                      context,
                      promoteUserObj.userIndex
                    );
                }}
                type="delete-calendar"
              />
            )}
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

CalendarSideBar.contextType = ExtraContext;

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(CalendarSideBar);
