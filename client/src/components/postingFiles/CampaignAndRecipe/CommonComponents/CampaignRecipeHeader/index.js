import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleUp from "@fortawesome/fontawesome-free-solid/faAngleUp";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

import DateTimePicker from "../../../../DateTimePicker";
import SocketUserList from "../../../../SocketUserList";

import "./style.css";

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
      showMore: true
    };
  }

  render() {
    const { colors, showMore } = this.state;
    const { campaign } = this.props; // variables
    const { handleChange, tryChangingDates } = this.props; // functions

    let colorDivs = [];
    for (let index in colors) {
      let isActive;
      if (colors[index].color === campaign.color) isActive = "active";
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

    return (
      <div className="simple-column-box border-bottom pb32">
        {showMore && (
          <input
            onChange={event => handleChange(event.target.value, "name")}
            value={campaign.name}
            className="campaign-title pa8"
            placeholder="Click here to give me a title!"
            readOnly={false}
          />
        )}
        {showMore && (
          <Textarea
            className="campaign-description"
            placeholder="Click here to give me a description!"
            onChange={event => handleChange(event.target.value, "description")}
            value={campaign.description}
            readOnly={false}
          />
        )}
        {showMore && (
          <div className="wrapping-container-full-center">
            <div className="label mr8">Start Date: </div>
            <div>
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

            <div className="label ml16 mr8">End Date: </div>
            <div className="mr16">
              <DateTimePicker
                date={new moment(campaign.endDate)}
                dateFormat="MMMM Do YYYY hh:mm A"
                handleChange={(date, setDisplayAndMessage) => {
                  tryChangingDates(date, "endDate", setDisplayAndMessage);
                }}
                dateLowerBound={new moment()}
              />
            </div>
            {colorDivs}
          </div>
        )}
        <div>
          {this.props.userList && this.props.userList.length > 0 && (
            <div className="absolute left">
              <SocketUserList userList={this.props.userList} />
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
