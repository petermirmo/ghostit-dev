import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../redux/actions/";

import Loader from "../Notifications/Loader";
import CalendarPicker from "../CalendarPicker";

import "./styles/";

class CalendarManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      calendars: props.calendars,
      activeCalendarIndex: props.activeCalendarIndex,
      unsavedChange: false
    };
  }
  componentDidMount() {
    this._ismounted = true;

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.close(); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);

    this.getCalendarUsersAndAccounts(this.state.activeCalendarIndex);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  getCalendarAccounts = index => {
    const { calendars } = this.state;

    axios
      .get("/api/calendar/accounts", { id: calendars[index]._id })
      .then(res => {
        const { success, err, message, accounts } = res.data;
        if (!success || err || !accounts) {
          console.log(
            "Retrieving calendar accounts from database was unsuccessful."
          );
          console.log(err);
          console.log(message);
        } else {
          this.handleCalendarChange("accounts", accounts, index);
        }
      });
  };

  getCalendarUsers = index => {
    const { calendars } = this.state;

    axios.get("/api/calendar/users", { id: calendars[index]._id }).then(res => {
      const { success, err, message, users } = res.data;
      if (!success || err || !users) {
        console.log(
          "Retrieving calendar users from database was unsuccessful."
        );
        console.log(err);
        console.log(message);
      } else {
        this.handleCalendarChange("users", users, index);
      }
    });
  };

  handleCalendarChange = (key, value, calendarIndex) => {
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

  presentActiveCalendar = () => {
    const { calendars, activeCalendarIndex, unsavedChange } = this.state;
    const calendar = calendars[activeCalendarIndex];

    return (
      <div className={"manage-calendar-container"}>
        <div className={"calendar-users-container pa16"}>users</div>
        <div className="calendar-info-and-accounts-container pa16">
          <div className={"calendar-info-container pa16"}>
            <div className="calendar-info-label mx8 mb4">Calendar Name</div>
            <input
              type="text"
              className="calendar-info-input pa8 mb16 round"
              placeholder="Calendar Name"
              onChange={event => {
                this.setState({ unsavedChange: true });
                this.handleCalendarChange(
                  "calendarName",
                  event.target.value,
                  activeCalendarIndex
                );
              }}
              value={calendar.calendarName}
            />
            {unsavedChange && (
              <button
                className="save-button pa8 round"
                onClick={e => {
                  e.preventDefault();
                }}
              >
                Save
              </button>
            )}
          </div>
          <div className="calendar-accounts-container pa16">accounts</div>
        </div>
      </div>
    );
  };

  render() {
    const { saving, calendars, activeCalendarIndex } = this.state;

    return (
      <div className="modal" onClick={() => this.props.close()}>
        <div
          className="large-modal common-transition"
          onClick={e => e.stopPropagation()}
        >
          <CalendarPicker
            calendars={calendars}
            activeCalendarIndex={activeCalendarIndex}
            calendarManager={true}
            updateActiveCalendar={index => {
              this.setState({ activeCalendarIndex: index });
            }}
          />
          {this.presentActiveCalendar()}
        </div>
        {saving && <Loader />}
      </div>
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
