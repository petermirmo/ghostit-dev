import React, { Component } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faUsers } from "@fortawesome/pro-light-svg-icons";
import {
  faBars,
  faCalendar,
  faEllipsisV,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";

import Loader from "../../../components/notifications/Loader";
import ConfirmAlert from "../../../components/notifications/ConfirmAlert";

import CollapsibleMenu from "../../../components/views/CollapsibleMenu";
import GIButton from "../../../components/views/GIButton";
import GIInput from "../../../components/views/GIInput";
import GIText from "../../../components/views/GIText";
import GIContainer from "../../../components/containers/GIContainer";

import Consumer from "../../../context";

import {
  capitolizeFirstChar,
  capitolizeWordsInString,
  getPostIcon,
  getPostColor,
  getPostIconRound
} from "../../../componentFunctions";

import {
  createNewCalendar,
  didUserConnectAccount,
  deleteCalendar,
  deleteCalendarClicked,
  inviteUser,
  leaveCalendar,
  promoteUser,
  removeUserFromCalendar,
  saveCalendarName,
  setDefaultCalendar,
  unlinkSocialAccount
} from "./util";

import {
  getCalendarAccounts,
  getCalendarUsers,
  isUserAdminOfCalendar
} from "../util";

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
      inviteEmail: "",
      leaveCalendarPrompt: false,
      open: true,
      removeUserPrompt: false,
      promoteUserPrompt: false,
      saving: false,
      unlinkAccountPrompt: false,
      unsavedChange: false
    };
  }
  componentDidMount() {
    const { activeCalendarIndex, calendars, handleCalendarChange } = this.props;
    this._ismounted = true;

    getCalendarAccounts(calendars, handleCalendarChange, activeCalendarIndex);
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
      inviteEmail,
      leaveCalendarPrompt,
      open,
      promoteUserObj,
      promoteUserPrompt,
      removeUserObj,
      removeUserPrompt,
      saving,
      unLinkAccountID,
      unlinkAccountPrompt,
      unsavedChange
    } = this.state;

    const {
      activeCalendarIndex,
      calendars,
      calendarUsers,
      defaultCalendarID,
      handleParentChange,
      updateActiveCalendar
    } = this.props;

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
          <GIContainer className="column shadow-7" style={{ width: "20%" }}>
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
                  <GIText
                    className="x-fill flex full-center clickable orange px16 py8"
                    onClick={() =>
                      createNewCalendar(
                        context,
                        handleParentChange,
                        calendars.length,
                        "Calendar " + calendars.length,
                        updateActiveCalendar
                      )
                    }
                    text="Make a New Calendar"
                    type="p"
                  />
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
                    handleParentChange,
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
                  getAccountOptions(calendar.accounts[index], this.handleChange)
                }
                showOptionFunction={index =>
                  isUserAdminOfCalendar(calendar, context.user) ||
                  didUserConnectAccount(calendar.accounts[index], context.user)
                }
                title="Social Accounts"
                titleIcon={faPlus}
              />
            )}
            {calendarUsers && (
              <CollapsibleMenu
                list={calendarUsers.map((obj, index) => (
                  <GIContainer className="x-85 align-center">
                    <GIContainer className="x-fill column mr16">
                      <GIContainer className="x-fill x-wrap">
                        <GIText className="ellipsis" type="h6">
                          {obj.fullName}{" "}
                        </GIText>
                        {isUserAdminOfCalendar(calendar, obj) && (
                          <GIText
                            className="green fw-normal"
                            text="(Admin)"
                            type="span"
                          />
                        )}
                      </GIContainer>
                      <GIText className="grey" text={obj.email} type="p" />
                    </GIContainer>
                  </GIContainer>
                ))}
                options={index =>
                  getUserOptions(
                    activeCalendarIndex,
                    calendar,
                    context,
                    this.handleChange,
                    isUserAdminOfCalendar,
                    calendarUsers[index]
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
                      handleParentChange,
                      activeCalendarIndex,
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
                      handleParentChange,
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
                      context,
                      handleParentChange
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
                      calendarUsers,
                      context,
                      getCalendarUsers,
                      handleParentChange,
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
                      this.handleChange,
                      promoteUserObj.userIndex
                    );
                }}
                type="delete-calendar"
              />
            )}
            {saving && <Loader />}
          </GIContainer>
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
export default connect(mapStateToProps)(CalendarSideBar);
