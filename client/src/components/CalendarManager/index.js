import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../redux/actions/";

import Loader from "../Notifications/Loader";
import CalendarPicker from "../CalendarPicker"

import "./styles/";

class CalendarManager extends Component {
  constructor(props) {
    super(props);
    this.state = { saving: false, calendars: props.calendars, activeCalendarIndex: props.activeCalendarIndex };
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
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

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
            updateActiveCalendar={index => { this.setState({ activeCalendarIndex: index })}}
          />
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
