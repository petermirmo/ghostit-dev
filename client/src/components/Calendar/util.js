import React from "react";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-light-svg-icons/faPlus";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons/faFacebookF";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons/faLinkedinIn";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";
import GIButton from "../views/GIButton";
import Dropdown from "../views/Dropdown";

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

export const createCalendarWeeks = (calendarDate, props) => {
  const { calendarEvents, onSelectDay } = props;

  let calendarCampaignsArray = addCalendarEvents(
    calendarEvents,
    calendarDate,
    props
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
  for (let weekIndex = weekStartMonth; weekIndex < weekEndMonth; weekIndex++) {
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
          key={weekIndex + dayIndex}
        >
          <div className="date-plus-container">
            <GIText
              className="calendar-day-date quicksand"
              text={calendarDay.date()}
              type="p"
            />
            {!pastDate && (
              <FontAwesomeIcon
                className="calendar-day-plus shadow-orange round round-icon-small small ma4 pa2"
                icon={faPlus}
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

export const createDayHeaders = daysInWeek => {
  let dayHeadingsArray = [];
  for (let index in daysInWeek) {
    dayHeadingsArray.push(
      <GIText
        className="tac x-fill white"
        key={index}
        text={daysInWeek[index].substring(0, 3)}
        type="h6"
      />
    );
  }
  return dayHeadingsArray;
};

const addCalendarEvents = (calendarEvents, calendarDate, props) => {
  const { onSelectCampaign, onSelectPost } = props;

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
          lastIndexOfCampaign(dateIndexOfEvent, calendarEvent, calendarEndDate)
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
                createCalendarPostDiv(
                  calendarEvent.posts[indexToLoopCampaignPosts],
                  indexToLoopCampaignPosts,
                  () => onSelectCampaign(calendarEvent),
                  false
                )
              );
              indexToLoopCampaignPosts++;
              if (indexToLoopCampaignPosts >= calendarEvent.posts.length) break;
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
                onSelectCampaign(calendarEvent);
              }}
            >
              {campaignCalendarPosts}
            </div>
          );
        } else {
          currentCalendarDayOfEvents[calendarEvent.row] = createCalendarPostDiv(
            calendarEvent,
            index,
            () => onSelectPost(calendarEvent),
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

const createCalendarPostDiv = (post, index, openEvent, needsCampaignCover) => {
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
  if (post.socialType === "twitter") icon = faTwitter;
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
          {new moment(post.postingDate).format("h:mm A")} {content}
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
        {new moment(post.postingDate).format("h:mm A")} {content}
      </div>
    );
  }
};

const dateIndexIsInMonth = (
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

const getCurrentDay = (calendarStartDate, dateIndexOfEvent) => {
  return Math.abs(calendarStartDate.diff(dateIndexOfEvent, "days")) + 1;
};

const isInMonth = (calendarEvent, calendarStartDate, calendarEndDate) => {
  return !(
    new moment(calendarEvent.endDate) < calendarStartDate ||
    new moment(calendarEvent.startDate) > calendarEndDate
  );
};

const lastIndexOfCampaign = (
  dateIndexOfEvent,
  calendarEvent,
  calendarEndDate
) => {
  return (
    dateIndexOfEvent.diff(new moment(calendarEvent.endDate), "days") === 0 ||
    dateIndexOfEvent.diff(calendarEndDate, "days") === 0
  );
};
