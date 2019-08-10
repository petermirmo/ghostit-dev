import React, { Component } from "react";
import moment from "moment-timezone";

import GIContainer from "../containers/GIContainer";

import { createQueuePostDiv } from "./util";

class QueuePreview extends Component {
  render() {
    const { calendarDate, calendarEvents, onSelectPost } = this.props;

    const quePostsToDisplay = [];
    const queuePostDivs = [];

    for (let index in calendarEvents) {
      const calendarEvent = calendarEvents[index];

      if (calendarEvent.posts) {
        for (let index2 in calendarEvent.posts) {
          quePostsToDisplay.push(calendarEvent.posts[index2]);
        }
      } else quePostsToDisplay.push(calendarEvents[index]);
    }

    quePostsToDisplay.sort(compareCampaignPostsReverse);

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
        createQueuePostDiv(index, onSelectPost, quePostToDisplay)
      );
    }

    return (
      <div className="queue-container flex column px8">{queuePostDivs}</div>
    );
  }
}

function compareCampaignPostsReverse(a, b) {
  if (a.postingDate < b.postingDate) return 1;
  else if (a.postingDate > b.postingDate) return -1;
  else return 0;
}

export default QueuePreview;
