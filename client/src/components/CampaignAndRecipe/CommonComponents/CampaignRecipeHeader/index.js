import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";
import faAngleUp from "@fortawesome/fontawesome-free-solid/faAngleUp";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

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
      },
      showMore: true
    };
  }

  render() {
    const { colors, showMore } = this.state;
    const { campaign, datePickerMessage, anchorDates } = this.props; // variables
    const { handleChange, tryChangingDates, toggleAnchorDates } = this.props; // functions

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

    let display;
    if (!showMore) display = "none";

    return (
      <div
        className="campaign-information-container"
        style={{ borderColor: campaign.color }}
      >
        <div
          className="close-container"
          hoverinstructions={
            "Campaigns are automatically saved when window is closed.\nTemplates are not."
          }
        >
          <FontAwesomeIcon
            className="close-special"
            icon={faTimes}
            size="2x"
            onClick={() => this.props.close()}
          />
        </div>
        <div className="campaign-grid-header" style={{ display }}>
          <div className="label">Name:</div>
          <div className="grid-textarea-container">
            <Textarea
              onChange={event => handleChange(event.target.value, "name")}
              value={campaign.name}
              className="campaign-textarea"
              placeholder="My Awesome Product Launch!"
              readOnly={false}
            />
          </div>
          <div className="label">Start Date: </div>
          <div className="grid-date-container">
            <DateTimePicker
              date={new moment(campaign.startDate)}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={(date, setDisplayAndMessage) => {
                tryChangingDates(date, "startDate", setDisplayAndMessage);
              }}
              dateLowerBound={new moment()}
            />
          </div>
          <div className="label">Description: </div>
          <div className="grid-textarea-container">
            <Textarea
              className="campaign-textarea small"
              placeholder="Describe this campaign!"
              onChange={event =>
                handleChange(event.target.value, "description")
              }
              value={campaign.description}
              readOnly={false}
            />
          </div>

          <div className="label">End Date: </div>
          <div className="grid-date-container">
            <DateTimePicker
              date={new moment(campaign.endDate)}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={(date, setDisplayAndMessage) => {
                tryChangingDates(date, "endDate", setDisplayAndMessage);
              }}
              dateLowerBound={new moment()}
            />
          </div>
          <div className="label">Color:</div>
          <div className="colors">{colorDivs}</div>
          <div className="grid-checkbox-container">
            <div onClick={toggleAnchorDates}>
              {anchorDates ? "Anchored" : "Not Anchored"}
            </div>
          </div>
        </div>
        {!showMore && (
          <div
            className="show-more-container"
            onClick={() => this.setState({ showMore: true })}
          >
            <div className="show-more">
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>
        )}
        {showMore && (
          <div
            className="show-more-container"
            onClick={() => this.setState({ showMore: false })}
          >
            <div className="show-more">
              <FontAwesomeIcon icon={faAngleUp} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CampaignRecipeHeader;
