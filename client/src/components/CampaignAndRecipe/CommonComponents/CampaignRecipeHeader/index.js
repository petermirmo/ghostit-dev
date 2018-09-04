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

    let display;
    let paddingBottom;
    if (!showMore) display = "none";
    else paddingBottom = "40px";

    return (
      <div
        className="campaign-information-container"
        style={{ borderColor: campaign.color, paddingBottom }}
      >
        <FontAwesomeIcon
          icon={faTimes}
          size="2x"
          className="close"
          onClick={() => this.props.close()}
        />
        <div
          className="back-button-top"
          onClick={() => {
            this.props.handleChange(false, "campaignModal");
            this.props.handleChange(true, "recipeModal");
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="back-button-arrow" />{" "}
          Back to Recipes
        </div>
        <div className="row-container" style={{ display }}>
          <div className="header-section-container">
            <div className="label">Name:</div>
            <Textarea
              onChange={event => handleChange(event.target.value, "name")}
              value={campaign.name}
              className="campaign-textarea"
              placeholder="My Awesome Product Launch!"
              readOnly={false}
            />
          </div>
          <div className="header-section-container">
            <div className="label">Color:</div>
            <div className="colors">{colorDivs}</div>
          </div>
        </div>
        <div className="row-container" style={{ display }}>
          <div className="header-section-container" style={{ display }}>
            <div className="label">Description: </div>

            <Textarea
              className="campaign-textarea"
              placeholder="Describe this campaign!"
              onChange={event =>
                this.handleChange(event.target.value, "description")
              }
              value={campaign.description}
              readOnly={false}
            />
          </div>
          <div className="header-section-container">
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
        </div>
        <div className="row-container" style={{ display }}>
          <div className="header-section-container" />
          <div className="header-section-container">
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
        {!showMore && (
          <div
            className="show-more-container"
            onClick={() => this.setState({ showMore: true })}
          >
            <div className="show-more">
              Show
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ paddingLeft: "4px" }}
              />
            </div>
          </div>
        )}
        {showMore && (
          <div
            className="show-more-container"
            onClick={() => this.setState({ showMore: false })}
          >
            <div className="show-more">
              Hide
              <FontAwesomeIcon
                icon={faAngleUp}
                style={{ paddingLeft: "4px" }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CampaignRecipeHeader;
