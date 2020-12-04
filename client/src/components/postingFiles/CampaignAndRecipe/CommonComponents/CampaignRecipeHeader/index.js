import React, { Component } from "react";
import moment from "moment-timezone";
import Textarea from "react-textarea-autosize";

import GIContainer from "../../../../containers/GIContainer";
import GIText from "../../../../views/GIText";

import DateTimePicker from "../../../../DateTimePicker";

import { createColorDivs } from "./util";

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
      }
    };
  }

  render() {
    const { colors } = this.state;
    const { campaign } = this.props; // variables
    const { handleChange, tryChangingDates } = this.props; // functions

    const colorDivs = createColorDivs(campaign, colors, handleChange);

    return (
      <GIContainer className="pt32">
        <GIContainer className="flex-fill column px32">
          <input
            className="campaign-title bg-transparent pa8"
            onChange={event => handleChange(event.target.value, "name")}
            placeholder="Click here to give me a title!"
            readOnly={false}
            value={campaign.name}
          />
          <Textarea
            className="campaign-description bg-transparent"
            onChange={event => handleChange(event.target.value, "description")}
            placeholder="Click here to give me a description!"
            readOnly={false}
            value={campaign.description}
          />
        </GIContainer>
        <GIContainer className="flex-fill">
          <GIContainer className="column">
            <GIText className="mb8" text="Start Date:" type="p" />
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
          </GIContainer>
          <GIContainer className="column ml16">
            <GIText className="mb8" text="End Date:" type="p" />

            <DateTimePicker
              date={new moment(campaign.endDate)}
              dateFormat="MMMM Do YYYY hh:mm A"
              handleChange={(date, setDisplayAndMessage) => {
                tryChangingDates(date, "endDate", setDisplayAndMessage);
              }}
              dateLowerBound={new moment()}
            />
          </GIContainer>
        </GIContainer>
      </GIContainer>
    );
  }
}

/*
<div>
  {userList && userList.length > 0 && (
    <div className="absolute left">
      <SocketUserList userList={userList} />
    </div>
  )}
</div>*/

export default CampaignRecipeHeader;
