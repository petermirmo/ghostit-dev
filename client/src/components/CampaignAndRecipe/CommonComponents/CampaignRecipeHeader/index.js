import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";
import faAngleUp from "@fortawesome/fontawesome-free-solid/faAngleUp";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

import DateTimePicker from "../../../DateTimePicker";
import SocketUserList from "../../../SocketUserList";

import "./styles/";

class CampaignRecipeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: {
        color1: {
          color: "var(--campaign-color3)"
        },
        color2: {
          color: "var(--campaign-color2)"
        },
        color3: {
          color: "var(--campaign-color1)"
        },
        color4: {
          color: "var(--campaign-color4)"
        }
      },
      showMore: false
    };
  }

  render() {
    const { colors, showMore } = this.state;
    const { campaign, datePickerMessage } = this.props; // variables
    const { handleChange, tryChangingDates } = this.props; // functions

    let colorDivs = [];
    for (let index in colors) {
      let isActive;
      if (colors[index].color == campaign.color) isActive = "active";
      colorDivs.push(
        <div
          className={"color-border mx4 pa4 round button " + isActive}
          style={{
            borderColor: colors[index].color
          }}
          onClick={() => {
            handleChange(colors[index].color, "color");
          }}
          key={index}
        >
          <div
            className="color round"
            style={{
              backgroundColor: colors[index].color
            }}
          />
        </div>
      );
    }

    let display;
    if (!showMore) display = "none";

    return (
      <div className="campaign-information-container flex column pb32">
        <div
          className="close-container"
          title={
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
        <div style={{ display }}>
          <input
            onChange={event => handleChange(event.target.value, "name")}
            value={campaign.name}
            className="campaign-title pa8"
            placeholder="Click here to give me a title!"
            readOnly={false}
          />
          <Textarea
            className="campaign-description"
            placeholder="Click here to give me a description!"
            onChange={event => handleChange(event.target.value, "description")}
            value={campaign.description}
            readOnly={false}
          />
          <div className="grid-container px16">
            <div className="flex vc hc">
              <div className="label">Start Date: </div>
              <DateTimePicker
                date={new moment(campaign.startDate)}
                dateFormat="MMMM Do YYYY hh:mm A"
                handleChange={(date, setDisplayAndMessage, anchorDates) => {
                  tryChangingDates(
                    date,
                    "startDate",
                    setDisplayAndMessage,
                    anchorDates
                  );
                }}
                dateLowerBound={new moment()}
                anchorDatesOption={true}
              />
            </div>

            <div className="flex vc hc">
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
            <div className="colors-container flex vc">{colorDivs}</div>
          </div>
        </div>
        <div className="user-list-and-show-more">
          {this.props.userList && this.props.userList.length > 0 && (
            <div className="user-list-container">
              <SocketUserList userList={this.props.userList} left={true} />
            </div>
          )}
          <div
            className="show-more center-horizontally bottom"
            onClick={() => this.setState({ showMore: !this.state.showMore })}
          >
            <FontAwesomeIcon icon={showMore ? faAngleUp : faAngleDown} />
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignRecipeHeader;
