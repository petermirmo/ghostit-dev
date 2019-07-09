import React from "react";
import Filter from "../Filter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";
import GIButton from "../views/GIButton";

import CalendarPicker from "../CalendarPicker/";
import SocketUserList from "../SocketUserList/";

export const calendarHeader = (calendarDate, props, queueActive) => {
  const {
    activeCalendarIndex,
    calendarInvites,
    calendars,
    categories,
    userList
  } = props; // Variables
  const {
    inviteResponse,
    enableCalendarManager,
    updateActiveCalendar,
    updateActiveCategory
  } = props; // Functions

  let calendarInviteDivs = [];
  if (calendarInvites && calendarInvites.length > 0) {
    calendarInviteDivs = calendarInvites.map((calendar, index) => {
      return (
        <GIContainer className="" key={`invite ${index}`}>
          {`You have been invited to ${calendar.calendarName}.`}
          <GIButton
            className="calendar-invite-accept"
            onClick={e => {
              e.preventDefault();
              inviteResponse(index, true);
            }}
            text="Accept"
          />
          <GIButton
            className="calendar-invite-reject"
            onClick={e => {
              e.preventDefault();
              inviteResponse(index, false);
            }}
            text="Reject"
          />
        </GIContainer>
      );
    });
  }

  return (
    <GIContainer className="column vc x-fill">
      <GIContainer className="x-fill px32 pt8">
        <GIContainer className="full-center">
          <Filter
            updateActiveCategory={updateActiveCategory}
            categories={categories}
          />
        </GIContainer>
        <GIContainer className="full-center fill-flex px32">
          <FontAwesomeIcon
            icon={faAngleLeft}
            size="3x"
            className="icon-regular-button common-transition"
            onClick={() => subtractMonth(props)}
          />
          <GIText
            className="tac fill-flex"
            text={calendarDate.format("MMMM YYYY")}
            type="h6"
          />
          <FontAwesomeIcon
            icon={faAngleRight}
            size="3x"
            className="icon-regular-button common-transition"
            onClick={() => addMonth(props)}
          />
        </GIContainer>
        <GIContainer className="full-center">
          <GIButton
            className="regular-button no-text-wrap large common-transition"
            onClick={() => this.setState({ queueActive: !queueActive })}
            text={queueActive ? "Calendar" : "Queue Preview"}
          />
        </GIContainer>
      </GIContainer>
      {calendarInviteDivs}
      <GIContainer className="flex hc x-fill relative">
        <CalendarPicker
          calendars={calendars}
          activeCalendarIndex={activeCalendarIndex}
          updateActiveCalendar={updateActiveCalendar}
          enableCalendarManager={enableCalendarManager}
        />
        <GIContainer className="absolute right">
          <SocketUserList
            userList={userList}
            style={{ right: 0, left: "auto" }}
          />
        </GIContainer>
      </GIContainer>
    </GIContainer>
  );
};

export const compareCampaigns = (a, b) => {
  if (new moment(a.startDate) < new moment(b.startDate)) return -1;
  else if (new moment(a.startDate) > new moment(b.startDate)) return 1;
  else return 0;
};
export const compareCampaignPosts = (a, b) => {
  if (a.postingDate < b.postingDate) return -1;
  else if (a.postingDate > b.postingDate) return 1;
  else return 0;
};
export const compareCampaignPostsReverse = (a, b) => {
  if (a.postingDate < b.postingDate) return 1;
  else if (a.postingDate > b.postingDate) return -1;
  else return 0;
};

export const dateIndexIsInMonth = (
  dateIndexOfEvent,
  calendarStartDate,
  calendarEvent,
  calendarEndDate
) => {
  return (
    dateIndexOfEvent <= new moment(calendarEvent.endDate) &&
    dateIndexOfEvent <= calendarEndDate &&
    dateIndexOfEvent >= calendarStartDate
  );
};

export const getCurrentDay = (calendarStartDate, dateIndexOfEvent) => {
  return Math.abs(calendarStartDate.diff(dateIndexOfEvent, "days")) + 1;
};

export const isInMonth = (
  calendarEvent,
  calendarStartDate,
  calendarEndDate
) => {
  return !(
    new moment(calendarEvent.endDate) < calendarStartDate ||
    new moment(calendarEvent.startDate) > calendarEndDate
  );
};

export const lastIndexOfCampaign = (
  dateIndexOfEvent,
  calendarEvent,
  calendarEndDate
) => {
  return (
    dateIndexOfEvent.diff(new moment(calendarEvent.endDate), "days") === 0 ||
    dateIndexOfEvent.diff(calendarEndDate, "days") === 0
  );
};

const addMonth = props => {
  let { calendarDate } = props;
  const { onDateChange } = props;

  calendarDate.add(1, "months");
  onDateChange(calendarDate);
};

const subtractMonth = props => {
  let { calendarDate } = props;
  const { onDateChange } = props;

  calendarDate.subtract(1, "months");
  onDateChange(calendarDate);
};
