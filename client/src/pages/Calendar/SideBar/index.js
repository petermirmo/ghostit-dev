import React, { Component } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/pro-light-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import Loader from "../../../components/notifications/Loader";
import ConfirmAlert from "../../../components/notifications/ConfirmAlert";

import CollapsibleMenu from "../../../components/views/CollapsibleMenu";
import GIButton from "../../../components/views/GIButton";
import GIInput from "../../../components/views/GIInput";
import GIText from "../../../components/views/GIText";
import GIContainer from "../../../components/containers/GIContainer";

import Consumer from "../../../context";

import {
  getPostIcon,
  getPostColor,
  capitolizeFirstChar,
  capitolizeWordsInString
} from "../../../componentFunctions";

import {
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

import { getCalendarUsers, getCalendarAccounts } from "../util";

import "./style.css";

class CalendarManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendars: props.calendars.map(calObj => {
        return { ...calObj, tempName: calObj.calendarName };
      }),
      activeCalendarIndex: props.activeCalendarIndex,
      calendarUsers: [],
      confirmAlert: {},
      defaultCalendarID: props.defaultCalendarID,
      deleteCalendarPrompt: false,
      inviteEmail: "",
      leaveCalendarPrompt: false,
      removeUserPrompt: false,
      promoteUserPrompt: false,
      saving: false,
      unlinkAccountPrompt: false,
      unsavedChange: false
    };
  }
  componentDidMount() {
    const {
      calendars,
      close,
      getKeyListenerFunction,
      setKeyListenerFunction
    } = this.props;
    const { activeCalendarIndex } = this.state;
    this._ismounted = true;

    setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.close(); // escape button pushed
        }
      },
      getKeyListenerFunction[0]
    ]);

    getCalendarUsers(calendars, this.handleChange, activeCalendarIndex);
    getCalendarAccounts(
      calendars,
      this.handleCalendarChange,
      activeCalendarIndex
    );
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleCalendarChange = (key, value, calendarIndex) => {
    if (!this._ismounted) return;
    this.setState(prevState => {
      return {
        calendars: [
          ...prevState.calendars.slice(0, calendarIndex),
          { ...prevState.calendars[calendarIndex], [key]: value },
          ...prevState.calendars.slice(calendarIndex + 1)
        ]
      };
    });
  };

  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject);
    if (callback) callback();
  };

  updateActiveCalendar = index => {
    const { calendars } = this.state;
    this.setState({ activeCalendarIndex: index, unsavedChange: false }, () => {
      this.handleCalendarChange(
        "tempName",
        calendars[index].calendarName,
        index
      );
      getCalendarUsers(index);
      getCalendarAccounts(calendars, this.handleCalendarChange, index);
    });
  };

  render() {
    const {
      activeCalendarIndex,
      calendars,
      calendarUsers,
      defaultCalendarID,
      deleteCalendarPrompt,
      inviteEmail,
      leaveCalendarPrompt,
      promoteUserObj,
      promoteUserPrompt,
      removeUserObj,
      removeUserPrompt,
      saving,
      unLinkAccountID,
      unlinkAccountPrompt,
      unsavedChange
    } = this.state;
    let userID = this.props.user._id;
    if (this.props.user.signedInAsUser) {
      userID = this.props.user.signedInAsUser.id;
    }

    const calendar = calendars[activeCalendarIndex];
    const isDefaultCalendar =
      calendar._id.toString() === defaultCalendarID.toString();
    const isAdmin = calendars[activeCalendarIndex].adminID === userID;
    return (
      <Consumer>
        {context => (
          <GIContainer className="column shadow-7" style={{ width: "20%" }}>
            {calendars && (
              <CollapsibleMenu
                activeIcon={faCalendarCheck}
                activeIndex={activeCalendarIndex}
                list={calendars}
                listObjKey="calendarName"
                options={[
                  {
                    name: "Set as Default",
                    onClick: index =>
                      setDefaultCalendar(
                        calendars[index]._id,
                        context,
                        this.handleChange
                      )
                  },
                  {
                    className: "",
                    name: "Delete",
                    onClick: index =>
                      setDefaultCalendar(
                        calendars[index]._id,
                        context,
                        this.handleChange
                      )
                  }
                ]}
                title="Calendars"
                titleIcon={faCalendar}
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
                      this.handleChange,
                      activeCalendarIndex,
                      this.updateActiveCalendar
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
                      this.handleChange,
                      activeCalendarIndex,
                      this.updateActiveCalendar
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
                      this.handleChange
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction
    },
    dispatch
  );
}
function mapStateToProps(state) {
  return {
    user: state.user,
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarManager);
