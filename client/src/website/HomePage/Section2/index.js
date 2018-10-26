import React, { Component } from "react";
import moment from "moment-timezone";

import Calendar from "../../../components/Calendar";

class Section2 extends Component {
  render() {
    return (
      <div className="section flex hc vc px32">
        <div className="third flex column vc hc">
          <div className="description-box flex column hc">
            <h4 className="title silly-font pb8">Organization.</h4>
            <p className="body">
              Work with your entire team in real time for all of your marketing
              campaigns in Ghostit's kickass calendar
            </p>
          </div>
        </div>
        <div className="platform-component-showcase fill flex vc hc">
          <Calendar
            calendarEvents={[]}
            calendarDate={new moment().add(1, "month")}
            onSelectDay={() => {}}
            onSelectPost={() => {}}
            onSelectCampaign={() => {}}
            timezone={"America/Vancouver"}
            categories={{
              All: true,
              Facebook: false,
              Twitter: false,
              Linkedin: false,
              Blog: false,
              Campaigns: false
            }}
            updateActiveCategory={() => {}}
          />
        </div>
      </div>
    );
  }
}

export default Section2;
