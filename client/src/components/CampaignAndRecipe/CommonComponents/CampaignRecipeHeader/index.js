import React, { Component } from "react";

import moment from "moment-timezone";

import DateTimePicker from "../../../DateTimePicker";

import "./styles/";

class CampaignRecipeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: {
        color1: {
          className: "color1",
          border: "color1-border",
          color: "var(--campaign-color1)"
        },
        color2: {
          className: "color2",
          border: "color2-border",
          color: "var(--campaign-color2)"
        },
        color3: {
          className: "color3",
          border: "color3-border",
          color: "var(--campaign-color3)"
        },
        color4: {
          className: "color4",
          border: "color4-border",
          color: "var(--campaign-color4)"
        }
      }
    };
  }
  render() {
    const { colors } = this.state;
    const { campaign, datePickerMessage } = this.props; // variables
    const { handleChange, tryChangingDates } = this.props; // functions

    let colorDivs = [];
    for (let index in colors) {
      let className = colors[index].border;
      if (colors[index].color == campaign.color) className += " active";
      colorDivs.push(
        <div
          className={className}
          onClick={() => {
            handleChange(colors[index].color, "color");
          }}
          key={index}
        >
          <div className={colors[index].className} />
        </div>
      );
    }

    return (
      <div
        className="campaign-information-container"
        style={{ borderColor: campaign.color }}
      >
        <div className="name-color-container">
          <div className="name-container">
            <div className="label">Name:</div>
            <input
              onChange={event => handleChange(event.target.value, "name")}
              value={campaign.name}
              className="name-input"
              placeholder="My Awesome Product Launch!"
            />
          </div>
          <div className="color-picker-container">
            <div className="label">Color:</div>
            <div className="colors">{colorDivs}</div>
          </div>
        </div>
        <div className="dates-container">
          <div className="date-and-label-container">
            <div className="label">Start Date: </div>
            <DateTimePicker
              date={new moment(campaign.startDate)}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={(date, setDisplayAndMessage) => {
                tryChangingDates(date, "startDate", setDisplayAndMessage);
              }}
              dateLowerBound={new moment()}
            />
          </div>
          <div className="date-and-label-container">
            <div className="label">End Date: </div>
            <DateTimePicker
              date={new moment(campaign.endDate)}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={(date, setDisplayAndMessage) => {
                tryChangingDates(date, "endDate", setDisplayAndMessage);
              }}
              dateLowerBound={new moment()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignRecipeHeader;
