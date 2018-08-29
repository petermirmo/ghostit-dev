import React, { Component } from "react";

import moment from "moment-timezone";

import DateTimePicker from "../../../DateTimePicker";

import "./styles/";

class CampaignRecipeHeader extends Component {
  render() {
    const { campaign, datePickerMessage, colors } = this.props; // variables
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
              handleChange={date => {
                tryChangingDates(date, "startDate");
              }}
              dateLowerBound={new moment()}
              message={datePickerMessage}
            />
          </div>
          <div className="date-and-label-container">
            <div className="label">End Date: </div>
            <DateTimePicker
              date={new moment(campaign.endDate)}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={date => {
                tryChangingDates(date, "endDate");
              }}
              dateLowerBound={new moment()}
              message={datePickerMessage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignRecipeHeader;
