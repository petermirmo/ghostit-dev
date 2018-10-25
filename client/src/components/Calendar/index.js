import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import faFacebookF from "@fortawesome/fontawesome-free-brands/faFacebookF";
import faLinkedinIn from "@fortawesome/fontawesome-free-brands/faLinkedinIn";
import faTwitterNormal from "@fortawesome/fontawesome-free-brands/faTwitter";

import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {} from "../../redux/actions/";

import {
  getPostIcon,
  getPostColor
} from "../../extra/functions/CommonFunctions";

import ImagesDiv from "../ImagesDiv/";
import Filter from "../Filter";
import Tutorial from "../Tutorial/";
import CalendarPicker from "../CalendarPicker/";

import "./styles/";

class Calendar extends Component {
  state = {
    calendarDate: this.props.calendarDate,
    timezone: this.props.timezone,
    queueActive: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.timezone !== this.state.timezone)
      this.setState({
        calendarDate: nextProps.calendarDate,
        timezone: nextProps.timezone
      });
  }
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
    const { calendarEvents, onSelectDay, onSelectPost } = this.props;

    let calendarCampaignsArray = this.addCalendarEvents(
      calendarEvents,
      calendarDate
    );
    let calendarWeekArray = [];

    // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
    let firstDayOfMonth = Number(
      moment(calendarDate.format("M"), "MM")
        .startOf("month")
        .format("d")
    );

    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    let loopDay = 1;

    // Week for loop
    // To determine if 5 or 6 weeks are needed in the calendar
    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      let calendarDays = [];

      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        let calendarDay = new moment(calendarDate);
        calendarDay = calendarDay.date(1);

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

    // Get first day of month, if it is Sunday we need 42 days in the calendar not 35
    let firstDayOfMonth = Number(
      moment(calendarDate.format("M"), "MM")
        .startOf("month")
        .format("d")
    );

    // Initialize date to first day of the month
    calendarDate.date(1);

    // Get calendar starting date
    let calendarStartDate = new moment(calendarDate)
      .subtract(firstDayOfMonth, "days")
      .add(firstDayOfMonth === 0 ? -6 : 1, "days");
    // Get calendar ending date
    let calendarEndDate = new moment(calendarDate)
      .subtract(firstDayOfMonth, "days")
      .add(35, "days");

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
          dateIndexIsInMonth(dateIndexOfEvent, calendarStartDate, calendarEvent)
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
    let color = "var(--five-primary-color)";
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
    let { calendarDate } = this.state;
    calendarDate.add(1, "months");
    this.setState({ calendarDate });
  };

  subtractMonth = () => {
    let { calendarDate } = this.state;
    calendarDate.subtract(1, "months");
    this.setState({ calendarDate: calendarDate });
  };
  createQueuePostDiv = (post, key) => {
    let content = post.content;
    if (post.socialType === "custom") content = post.instructions;
    if (post.socialType === "newsletter") content = post.notes;
    if (post.socialType === "blog") content = post.title;

    return (
      <div
        key={key}
        className="queue-post-container"
        onClick={() => this.props.onSelectPost(post)}
      >
        <div className="queue-post-attribute">
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
          <ImagesDiv
            postImages={post.images ? post.images : []}
            hideUploadButton={true}
          />
        </div>
      </div>
    );
  };
  calendarHeader = (calendarDate, queueActive) => {
    return (
      <div className="calendar-header-two-rows">
        <div className="calendar-header-container px8 pt8">
          <div className="flex vt hc">
            <div className="calendar-view-change button common-transition br4">
              <Filter
                updateActiveCategory={this.props.updateActiveCategory}
                categories={this.props.categories}
              />
            </div>
          </div>
          <div className="center-header-container px32">
            <FontAwesomeIcon
              icon={faAngleLeft}
              size="3x"
              className="calendar-switch-month button common-transition"
              onClick={this.subtractMonth}
            />
            <div className="calendar-month">
              {calendarDate.format("MMMM YYYY")}
            </div>
            <FontAwesomeIcon
              icon={faAngleRight}
              size="3x"
              className="calendar-switch-month button common-transition"
              onClick={this.addMonth}
            />
          </div>
          <div className="flex vt hc">
            <div
              className="calendar-view-change button common-transition py8 px16 br4"
              onClick={() => this.setState({ queueActive: !queueActive })}
            >
              {queueActive ? "Calendar" : "Queue Preview"}
            </div>
          </div>
        </div>
        <CalendarPicker
          calendars={this.props.calendars}
          activeCalendarIndex={this.props.activeCalendarIndex}
          updateActiveCalendar={this.props.updateActiveCalendar}
          createNewCalendar={this.props.createNewCalendar}
        />
      </div>
    );
  };

  render() {
    let { calendarDate, queueActive } = this.state;
    if (queueActive) {
      let { calendarEvents, onSelectDay, onSelectPost } = this.props;
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
        <div className="queue-container">
          {this.calendarHeader(calendarDate, queueActive)}
          {queuePostDivs}
        </div>
      );
    }

    let calendarWeekArray = this.createCalendarWeeks(calendarDate);
    let dayHeadingsArray = this.createDayHeaders(moment.weekdays());
    const { tutorial } = this.props;

    return (
      <div className="calendar-container">
        {this.calendarHeader(calendarDate, queueActive)}

        <div className="calendar-table">
          <div className="calendar-day-titles-container">
            {dayHeadingsArray}
          </div>
          {calendarWeekArray}

          {tutorial.on &&
            tutorial.value === 4 && (
              <Tutorial
                title="Tutorial"
                message="Click on any day in the calendar to create your first post!"
                position="center"
              />
            )}
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
  return {
    tutorial: state.tutorial
  };
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
  calendarEvent
) {
  return (
    dateIndexOfEvent <= new moment(calendarEvent.endDate) &&
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
