import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import faFacebookF from "@fortawesome/fontawesome-free-brands/faFacebookF";
import faLinkedinIn from "@fortawesome/fontawesome-free-brands/faLinkedinIn";
import faTwitterNormal from "@fortawesome/fontawesome-free-brands/faTwitter";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getPostIcon, getPostColor } from "../../componentFunctions";

import FileUpload from "../views/FileUpload/";
import Filter from "../Filter";
import CalendarPicker from "../CalendarPicker/";
import SocketUserList from "../SocketUserList/";

import "./style.css";

class Calendar extends Component {
  state = {
    queueActive: false
  };

  createDayHeaders = () => {
    let dayHeadingsArray = [];
    for (let index = 0; index < 7; index++) {
      dayHeadingsArray.push(
        <div className="calendar-day-heading" key={index + "dayheading"}>
          {moment()
            .day(index)
            .format("dddd")}
        </div>
      );
    }
    return dayHeadingsArray;
  };
  createCalendarWeeks = calendarDate => {
    const { calendarEvents, onSelectDay } = this.props;

    let calendarCampaignsArray = this.addCalendarEvents(
      calendarEvents,
      calendarDate
    );
    let calendarWeekArray = [];

    calendarDate.date(1);

    // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
    let firstDayOfMonth = calendarDate.day();

    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    let weekEndMonth =
      firstDayOfMonth + calendarDate.daysInMonth() > 35 && weekStartMonth !== -1
        ? 6
        : 5;

    let loopDay = 1;

    // Week for loop
    // To determine if 5 or 6 weeks are needed in the calendar
    for (
      let weekIndex = weekStartMonth;
      weekIndex < weekEndMonth;
      weekIndex++
    ) {
      let calendarDays = [];

      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        let calendarDay = new moment(calendarDate);

        // Subtract the start date of current month
        calendarDay.subtract(firstDayOfMonth, "days");
        // Add our index
        calendarDay.add(weekIndex * 7 + dayIndex, "days");

        let pastDate = calendarDay.diff(new moment(), "days") < 0;
        let currentDate = calendarDay.isSame(new moment(), "day");

        let calendarClass = "calendar-day";

        if (currentDate) calendarClass = "calendar-day present-calendar-day";
        else if (pastDate) calendarClass = "calendar-day past-calendar-day";

        calendarDays.push(
          <div
            className={calendarClass}
            onClick={() => onSelectDay(calendarDay)}
            key={weekIndex + "week" + dayIndex + "day"}
          >
            <div className="date-plus-container">
              <div className="calendar-day-date">{calendarDay.date()}</div>
              {!pastDate && (
                <FontAwesomeIcon
                  icon={faPlus}
                  className="calendar-day-plus common-transition ma4"
                />
              )}
            </div>
            {calendarCampaignsArray[loopDay]}
          </div>
        );
        loopDay++;
      }
      calendarWeekArray.push(
        <div className="calendar-week" key={weekIndex}>
          {calendarDays}
        </div>
      );
    }

    return calendarWeekArray;
  };
  addCalendarEvents = (calendarEvents, calendarDate) => {
    if (calendarEvents) calendarEvents = calendarEvents.sort(compareCampaigns);

    // Initialize date to first day of the month
    calendarDate.date(1);

    // Get first day of month, if it is Sunday we need 42 days in the calendar not 35
    let firstDayOfMonth = calendarDate.day();
    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    // Get calendar starting date
    let calendarStartDate = new moment(calendarDate)
      .subtract(firstDayOfMonth, "days")
      .add(firstDayOfMonth === 0 ? -7 : 0, "days");

    let weekEndMonth =
      firstDayOfMonth + calendarDate.daysInMonth() > 35 && weekStartMonth !== -1
        ? 42
        : 35;

    // Get calendar ending date
    let calendarEndDate = new moment(calendarDate)
      .subtract(firstDayOfMonth, "days")
      .add(weekEndMonth, "days");

    calendarStartDate.set("hour", 0);
    calendarStartDate.set("minute", 0);

    calendarEndDate.set("hour", 23);
    calendarEndDate.set("minute", 59);

    let numberOfDaysInCalendar =
      calendarEndDate.diff(calendarStartDate, "days") + 1;

    let calendarEventsArray = [numberOfDaysInCalendar];

    // Initialize every day of calendar to be an empty array
    for (let i = 1; i <= numberOfDaysInCalendar; i++) {
      calendarEventsArray[i] = [];
    }

    for (let index in calendarEvents) {
      let calendarEvent = calendarEvents[index];

      if (isInMonth(calendarEvent, calendarStartDate, calendarEndDate)) {
        // init variables to loop campaign
        let dateIndexOfEvent = new moment(calendarEvent.startDate);
        let firstLoop = true;
        let indexToLoopCampaignPosts = 0;

        // Make sure posts in a campaign are sorted
        if (calendarEvent.posts) calendarEvent.posts.sort(compareCampaignPosts);

        while (
          dateIndexIsInMonth(
            dateIndexOfEvent,
            calendarStartDate,
            calendarEvent,
            calendarEndDate
          )
        ) {
          // Current day array
          let currentCalendarDayOfEvents =
            calendarEventsArray[
              getCurrentDay(calendarStartDate, dateIndexOfEvent)
            ];

          let campaignClassName = "campaign button";

          // If first loop of while loop
          if (firstLoop) {
            calendarEvent.row = currentCalendarDayOfEvents.length;
            campaignClassName += " first-index-campaign";
          }

          if (
            lastIndexOfCampaign(
              dateIndexOfEvent,
              calendarEvent,
              calendarEndDate
            )
          ) {
            campaignClassName += " last-index-campaign";
          }

          let campaignCalendarPosts = [];

          // Get each post for this day of the campaign to display in calendar
          if (calendarEvent.posts) {
            if (calendarEvent.posts[indexToLoopCampaignPosts]) {
              // Loop through posts in a campaign
              while (
                new moment(
                  calendarEvent.posts[indexToLoopCampaignPosts].postingDate
                ).format("YYYY-MM-DD") === dateIndexOfEvent.format("YYYY-MM-DD")
              ) {
                campaignCalendarPosts.push(
                  this.createCalendarPostDiv(
                    calendarEvent.posts[indexToLoopCampaignPosts],
                    indexToLoopCampaignPosts,
                    () => this.props.onSelectCampaign(calendarEvent),
                    false
                  )
                );
                indexToLoopCampaignPosts++;
                if (indexToLoopCampaignPosts >= calendarEvent.posts.length)
                  break;
              }
              if (calendarEvent.posts[indexToLoopCampaignPosts]) {
                while (
                  new moment(
                    calendarEvent.posts[indexToLoopCampaignPosts].postingDate
                  ).format("YYYY-MM-DD") < dateIndexOfEvent.format("YYYY-MM-DD")
                ) {
                  indexToLoopCampaignPosts++;
                  if (indexToLoopCampaignPosts >= calendarEvent.posts.length)
                    break;
                }
              }
            }
          }
          if (calendarEvent.posts) {
            currentCalendarDayOfEvents[calendarEvent.row] = (
              <div
                className={campaignClassName}
                style={{ backgroundColor: calendarEvent.color }}
                key={index + "day2"}
                onClick={event => {
                  event.stopPropagation();
                  this.props.onSelectCampaign(calendarEvent);
                }}
              >
                {campaignCalendarPosts}
              </div>
            );
          } else {
            currentCalendarDayOfEvents[
              calendarEvent.row
            ] = this.createCalendarPostDiv(
              calendarEvent,
              index,
              () => this.props.onSelectPost(calendarEvent),
              true
            );
          }

          // Make sure that campaign appears on the correct row by putting in blanks before
          for (let i = 0; i < calendarEvent.row; i++) {
            if (!currentCalendarDayOfEvents[i]) {
              currentCalendarDayOfEvents[i] = (
                <div
                  className="campaign button"
                  style={{ backgroundColor: "transparent" }}
                  key={index + i + "day2"}
                />
              );
            }
          }

          dateIndexOfEvent.add(1, "days");
          firstLoop = false;
        }
      }
    }

    return calendarEventsArray;
  };

  createCalendarPostDiv = (post, index, openEvent, needsCampaignCover) => {
    let content = "";
    if (post.notes) content = post.notes;
    if (post.content) content = post.content;
    if (post.title) content = post.title;
    if (
      ((post.name !== "Facebook Post" &&
        post.name !== "Twitter Post" &&
        post.name !== "LinkedIn Post" &&
        post.name !== "Instagram Post" &&
        post.name !== "Custom Task") ||
        !content) &&
      post.name
    )
      content = post.name;
    let color = "var(--five-blue-color)";
    if (post.color) color = post.color;
    if (post.color) color = post.color;

    let icon;
    if (post.socialType === "facebook") icon = faFacebookF;
    if (post.socialType === "twitter") icon = faTwitterNormal;
    if (post.socialType === "linkedin") icon = faLinkedinIn;
    if (needsCampaignCover) {
      return (
        <div
          className="campaign button"
          style={{ backgroundColor: "transparent" }}
          key={index + "post3"}
        >
          <div
            className="calendar-post common-transition button"
            style={{ backgroundColor: color }}
            onClick={event => {
              event.stopPropagation();
              openEvent();
            }}
          >
            {icon && <FontAwesomeIcon icon={icon} />}{" "}
            {new moment(post.postingDate).format("h:mm")} {content}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="calendar-post common-transition button"
          key={index + "post3"}
          style={{ backgroundColor: color }}
          onClick={event => {
            event.stopPropagation();
            openEvent();
          }}
        >
          {icon && <FontAwesomeIcon icon={icon} />}{" "}
          {new moment(post.postingDate).format("h:mm")} {content}
        </div>
      );
    }
  };

  addMonth = () => {
    let { calendarDate, onDateChange } = this.props;
    calendarDate.add(1, "months");
    onDateChange(calendarDate);
  };

  subtractMonth = () => {
    let { calendarDate, onDateChange } = this.props;
    calendarDate.subtract(1, "months");
    onDateChange(calendarDate);
  };
  createQueuePostDiv = (post, key) => {
    let content = post.content;
    if (post.socialType === "custom") content = post.instructions;
    if (post.socialType === "newsletter") content = post.notes;
    if (post.socialType === "blog") content = post.title;

    return (
      <div
        key={key}
        className="queue-post-container flex py8 button"
        onClick={() => this.props.onSelectPost(post)}
      >
        <div className="queue-post-attribute flex">
          {getPostIcon(post.socialType) && (
            <FontAwesomeIcon
              icon={getPostIcon(post.socialType)}
              style={{ color: getPostColor(post.socialType) }}
              size="2x"
            />
          )}
          {!getPostIcon(post.socialType) && <div>{post.socialType}</div>}
        </div>

        <div className="queue-post-attribute">
          {new moment(post.postingDate).format("LLL")}
        </div>
        <div className="queue-post-attribute important">{content}</div>
        <div className="queue-post-attribute">
          <FileUpload
            currentFiles={post.files ? post.files : []}
            hideUploadButton={true}
            id="xyz"
            imageClassName="flex image tiny"
          />
        </div>
      </div>
    );
  };
  calendarHeader = (calendarDate, queueActive) => {
    const {
      activeCalendarIndex,
      calendarInvites,
      calendars,
      categories,
      userList
    } = this.props; // Variables
    const {
      inviteResponse,
      enableCalendarManager,
      updateActiveCalendar,
      updateActiveCategory
    } = this.props; // Functions

    let calendarInviteDivs = [];
    if (calendarInvites && calendarInvites.length > 0) {
      calendarInviteDivs = calendarInvites.map((calendar, index) => {
        return (
          <div className="calendar-invite-prompt" key={`invite ${index}`}>
            {`You have been invited to ${calendar.calendarName}.`}
            <button
              className="calendar-invite-accept"
              onClick={e => {
                e.preventDefault();
                inviteResponse(index, true);
              }}
            >
              Accept
            </button>
            <button
              className="calendar-invite-reject"
              onClick={e => {
                e.preventDefault();
                inviteResponse(index, false);
              }}
            >
              Reject
            </button>
          </div>
        );
      });
    }

    return (
      <div className="flex column vc width100">
        <div className="calendar-header-container px32 pt8 width100 border-box">
          <div className="flex hc vc">
            <Filter
              updateActiveCategory={updateActiveCategory}
              categories={categories}
            />
          </div>
          <div className="flex hc vc px32 fill-flex">
            <FontAwesomeIcon
              icon={faAngleLeft}
              size="3x"
              className="icon-regular-button common-transition"
              onClick={this.subtractMonth}
            />
            <h1 className="tac fill-flex">
              {calendarDate.format("MMMM YYYY")}
            </h1>
            <FontAwesomeIcon
              icon={faAngleRight}
              size="3x"
              className="icon-regular-button common-transition"
              onClick={this.addMonth}
            />
          </div>
          <div className="flex hc vc">
            <button
              className="regular-button no-text-wrap large common-transition"
              onClick={() => this.setState({ queueActive: !queueActive })}
            >
              {queueActive ? "Calendar" : "Queue Preview"}
            </button>
          </div>
        </div>
        {calendarInviteDivs}
        <div className="flex hc width100 relative">
          <CalendarPicker
            calendars={calendars}
            activeCalendarIndex={activeCalendarIndex}
            updateActiveCalendar={updateActiveCalendar}
            enableCalendarManager={enableCalendarManager}
          />
          <div className="absolute right">
            <SocketUserList
              userList={userList}
              style={{ right: 0, left: "auto" }}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { queueActive } = this.state;
    let { calendarEvents, calendarDate } = this.props;

    if (queueActive) {
      let quePostsToDisplay = [];
      for (let index in calendarEvents) {
        let calendarEvent = calendarEvents[index];
        if (calendarEvent.posts) {
          for (let index2 in calendarEvent.posts) {
            quePostsToDisplay.push(calendarEvent.posts[index2]);
          }
        } else quePostsToDisplay.push(calendarEvents[index]);
      }
      quePostsToDisplay.sort(compareCampaignPostsReverse);
      let queuePostDivs = [];
      for (let index in quePostsToDisplay) {
        let quePostToDisplay = quePostsToDisplay[index];

        if (
          !new moment(quePostToDisplay.postingDate).isSame(
            new moment(calendarDate),
            "month"
          )
        )
          continue;

        queuePostDivs.push(
          this.createQueuePostDiv(quePostToDisplay, index + "post")
        );
      }
      return (
        <div className="queue-container flex column px8">
          {this.calendarHeader(calendarDate, queueActive)}
          {queuePostDivs}
        </div>
      );
    }

    let calendarWeekArray = this.createCalendarWeeks(calendarDate);
    let dayHeadingsArray = this.createDayHeaders(moment.weekdays());

    return (
      <div className="calendar-container">
        {this.calendarHeader(calendarDate, queueActive)}

        <div className="flex column">
          <div className="calendar-day-titles-container">
            {dayHeadingsArray}
          </div>
          {calendarWeekArray}
        </div>
      </div>
    );
  }
}

function compareCampaigns(a, b) {
  if (new moment(a.startDate) < new moment(b.startDate)) return -1;
  else if (new moment(a.startDate) > new moment(b.startDate)) return 1;
  else return 0;
}
function compareCampaignPosts(a, b) {
  if (a.postingDate < b.postingDate) return -1;
  else if (a.postingDate > b.postingDate) return 1;
  else return 0;
}
function compareCampaignPostsReverse(a, b) {
  if (a.postingDate < b.postingDate) return 1;
  else if (a.postingDate > b.postingDate) return -1;
  else return 0;
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
function isInMonth(calendarEvent, calendarStartDate, calendarEndDate) {
  return !(
    new moment(calendarEvent.endDate) < calendarStartDate ||
    new moment(calendarEvent.startDate) > calendarEndDate
  );
}
function dateIndexIsInMonth(
  dateIndexOfEvent,
  calendarStartDate,
  calendarEvent,
  calendarEndDate
) {
  return (
    dateIndexOfEvent <= new moment(calendarEvent.endDate) &&
    dateIndexOfEvent <= calendarEndDate &&
    dateIndexOfEvent >= calendarStartDate
  );
}
function lastIndexOfCampaign(dateIndexOfEvent, calendarEvent, calendarEndDate) {
  return (
    dateIndexOfEvent.diff(new moment(calendarEvent.endDate), "days") === 0 ||
    dateIndexOfEvent.diff(calendarEndDate, "days") === 0
  );
}
function getCurrentDay(calendarStartDate, dateIndexOfEvent) {
  return Math.abs(calendarStartDate.diff(dateIndexOfEvent, "days")) + 1;
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);
