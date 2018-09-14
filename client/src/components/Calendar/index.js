import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import faFacebookF from "@fortawesome/fontawesome-free-brands/faFacebookF";
import faLinkedinIn from "@fortawesome/fontawesome-free-brands/faLinkedinIn";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitter";

import Filter from "../Filter";

import "./styles/";

class Calendar extends Component {
  state = {
    calendarDate: this.props.calendarDate,
    timezone: this.props.timezone
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
    for (let index = 1; index < 8; index++) {
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

      for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
        let calendarDay = new moment(calendarDate);
        calendarDay = calendarDay.date(1);

        // Subtract the start date of current month
        calendarDay.subtract(firstDayOfMonth, "days");
        // Add our index
        calendarDay.add(weekIndex * 7 + dayIndex, "days");

        let pastDate = calendarDay.diff(new moment(), "days") < 0;
        let currentDate = calendarDay.isSame(new moment(), "day");

        let calendarClass = "calendar-day";
        if (calendarDay.format("MM") !== calendarDate.format("MM"))
          calendarClass = "calendar-day faded-calendar-days";
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
                <FontAwesomeIcon icon={faPlus} className="calendar-day-plus" />
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
    if (calendarEvents) calendarEvents.sort(compareCampaigns);

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

      // Checks to make sure that the campaign is within this month
      if (
        new moment(calendarEvent.endDate) > calendarStartDate ||
        new moment(calendarEvent.startDate) < calendarEndDate
      ) {
        let dateIndexOfEvent = new moment(calendarEvent.startDate);

        let firstLoop = true;

        if (calendarEvent.posts) calendarEvent.posts.sort(compareCampaignPosts);

        while (dateIndexOfEvent <= calendarStartDate) {
          dateIndexOfEvent.add(1, "days");
        }

        let indexToLoopCampaignPosts = 0;

        while (
          dateIndexOfEvent <= new moment(calendarEvent.endDate) &&
          dateIndexOfEvent <= calendarEndDate &&
          dateIndexOfEvent >= calendarStartDate
        ) {
          // Current day array
          let currentCalendarDayOfEvents =
            calendarEventsArray[
              Math.abs(calendarStartDate.diff(dateIndexOfEvent, "days")) + 1
            ];

          let campaignClassName = "campaign";

          // If first loop of while loop
          if (firstLoop) {
            calendarEvent.row = currentCalendarDayOfEvents.length;
            campaignClassName += " first-index-campaign";
          }
          // If last index of campaign
          if (
            dateIndexOfEvent.diff(new moment(calendarEvent.endDate), "days") ===
              0 ||
            dateIndexOfEvent.diff(calendarEndDate, "days") === 0
          ) {
            campaignClassName += " last-index-campaign";
          }

          let campaignCalendarPosts = [];

          // Get each post for this day of the campaign to display in calendar
          if (calendarEvent.posts) {
            if (calendarEvent.posts[indexToLoopCampaignPosts]) {
              while (
                new moment(
                  calendarEvent.posts[indexToLoopCampaignPosts].postingDate
                ).format("YYYY-MM-DD") === dateIndexOfEvent.format("YYYY-MM-DD")
              ) {
                campaignCalendarPosts.push(
                  this.createPostCalendarDiv(
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
            ] = this.createPostCalendarDiv(
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
                  className="campaign"
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

  createPostCalendarDiv = (post, index, openEvent, needsCampaignCover) => {
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
    let color = "var(--blue-theme-color)";
    if (post.color) color = post.color;
    if (post.color) color = post.color;

    let icon;
    if (post.socialType === "facebook") icon = faFacebookF;
    if (post.socialType === "twitter") icon = faTwitter;
    if (post.socialType === "linkedin") icon = faLinkedinIn;
    if (needsCampaignCover) {
      return (
        <div
          className="campaign"
          style={{ backgroundColor: "transparent" }}
          key={index + "post3"}
        >
          <div
            className="calendar-post"
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
          className="calendar-post"
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
    this.setState({ calendarDate: calendarDate });
  };

  subtractMonth = () => {
    let { calendarDate } = this.state;
    calendarDate.subtract(1, "months");
    this.setState({ calendarDate: calendarDate });
  };

  render() {
    let { calendarDate } = this.state;

    let calendarWeekArray = this.createCalendarWeeks(calendarDate);
    let dayHeadingsArray = this.createDayHeaders(moment.weekdays());
    return (
      <div className="calendar-container">
        <div className="calendar-header-container">
          <div className="something">
            <FontAwesomeIcon
              icon={faAngleLeft}
              size="4x"
              className="calendar-switch-month-button"
              onClick={this.subtractMonth}
            />
            <h1 className="calendar-month">{calendarDate.format("MMMM")}</h1>
            <FontAwesomeIcon
              icon={faAngleRight}
              size="4x"
              className="calendar-switch-month-button"
              onClick={this.addMonth}
            />
          </div>
          <div className="calendar-filter-container">
            <Filter
              updateActiveCategory={this.props.updateActiveCategory}
              categories={this.props.categories}
            />
            <div className="box-button left">Queue Preview</div>
          </div>
        </div>

        <div className="calendar-table">
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
  if (a.startDate < b.startDate) return -1;
  if (a.startDate > b.startDate) return 1;
  return 0;
}
function compareCampaignPosts(a, b) {
  if (a.postingDate < b.postingDate) return -1;
  if (a.postingDate > b.postingDate) return 1;
  return 0;
}

export default Calendar;
