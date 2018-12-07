import React, { Component } from "react";
import moment from "moment-timezone";

import Calendar from "../../../components/Calendar";
const calendarEvents = [
  {
    calendarID: "5be4d099cf96d86288fcd388",
    color: "var(--campaign-color3)",
    createdAt: "2018-11-09T22:15:31.507Z",
    description: "test",
    endDate: new moment().add(7, "day"),
    name: "test",
    posts: [
      {
        calendarID: "5be4d099cf96d86288fcd388",
        campaignID: "5be60703a70e6a4efc73e632",
        color: "var(--seven-purple-color)",
        createdAt: "2018-11-09T22:15:38.082Z",
        images: [],
        instructions: "test",
        linkImage: "",
        name: "test",
        postingDate: new moment().add(1, "day"),
        socialType: "custom",
        updatedAt: "2018-11-09T22:15:38.082Z",
        userID: "5af9f5ebf7bdf40f7802a1c6",
        __v: 0,
        _id: "5be6070aa70e6a4efc73e633"
      },
      {
        accountID: "164038044391135",
        accountType: "page",
        calendarID: "5be4d099cf96d86288fcd388",
        campaignID: "5be60703a70e6a4efc73e632",
        color: "#4267b2",
        content: "test",
        createdAt: "2018-11-09T22:15:42.677Z",
        images: [],
        instructions: "",
        link: "",
        linkImage: "",
        name: "Facebook Post",
        postingDate: new moment().add(2, "day"),
        socialType: "facebook",
        status: "pending",
        updatedAt: "2018-11-09T22:15:42.677Z",
        userID: "5af9f5ebf7bdf40f7802a1c6",
        __v: 0,
        _id: "5be6070ea70e6a4efc73e635"
      }
    ],
    startDate: new moment(),
    updatedAt: "2018-11-09T22:15:59.912Z",
    userID: "5af9f5ebf7bdf40f7802a1c6",
    __v: 2,
    _id: "5be60703a70e6a4efc73e632"
  },
  {
    calendarID: "5be4d099cf96d86288fcd388",
    color: "var(--campaign-color4)",
    createdAt: "2018-11-09T22:15:31.507Z",
    description: "",
    endDate: new moment().add(14, "day"),
    name: "",
    posts: [
      {
        calendarID: "5be4d099cf96d86288fcd388",
        campaignID: "5be60703a70e6a4efc73e632",
        color: "var(--seven-purple-color)",
        createdAt: "2018-11-09T22:15:38.082Z",
        images: [],
        instructions: "",
        linkImage: "",
        name: "Send Flyers",
        postingDate: new moment().add(8, "day"),
        socialType: "custom",
        updatedAt: "2018-11-09T22:15:38.082Z",
        userID: "5af9f5ebf7bdf40f7802a1c6",
        __v: 0,
        _id: "5be6070aa70e6a4efc73e633"
      },
      {
        accountID: "164038044391135",
        accountType: "page",
        calendarID: "5be4d099cf96d86288fcd388",
        campaignID: "5be60703a70e6a4efc73e632",
        color: "#4267b2",
        content: "Email campaign",
        createdAt: "2018-11-09T22:15:42.677Z",
        images: [],
        instructions: "",
        link: "",
        linkImage: "",
        name: "Facebook Post",
        postingDate: new moment().add(13, "day"),
        socialType: "facebook",
        status: "pending",
        updatedAt: "2018-11-09T22:15:42.677Z",
        userID: "5af9f5ebf7bdf40f7802a1c6",
        __v: 0,
        _id: "5be6070ea70e6a4efc73e635"
      }
    ],
    startDate: new moment().add(2, "day"),
    updatedAt: "2018-11-09T22:15:59.912Z",
    userID: "5af9f5ebf7bdf40f7802a1c6",
    __v: 2,
    _id: "5be60703a70e6a4efc73e632"
  }
];

class Section2 extends Component {
  state = {
    calendarDate: new moment()
  };
  render() {
    const { calendarDate } = this.state;
    return (
      <div className="section flex hc vc wrap width100 border-box px32">
        <div className="third flex vc hc">
          <div className="description-box flex column hc">
            <h4 className="title silly-font pb8 tac">Custom Workflows</h4>
            <p>
              Map your marketing campaign from scratch or use pre-built
              templates.
            </p>
          </div>
        </div>
        <div className="platform-component-showcase two-third flex vc hc">
          <Calendar
            calendarEvents={calendarEvents}
            calendarDate={new moment()}
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
            calendars={[]}
            onDateChange={date => this.setState({ calendarDate: date })}
            userList={[]}
          />
        </div>
      </div>
    );
  }
}

export default Section2;
