import React, { Component } from "react";
import moment from "moment-timezone";

import Post from "../../../components/Post";

class Section3 extends Component {
  render() {
    return (
      <div className="section flex hc vc px32">
        <div className="platform-component-showcase fill common-shadow">
          <Post
            post={undefined}
            postFinishedSavingCallback={() => {}}
            setSaving={() => {}}
            calendarID="1234"
            socialType="facebook"
            canEditPost={true}
            listOfChanges={undefined}
            backupChanges={() => {}}
            campaignStartDate={new moment()}
            campaignEndDate={new moment().add(7, "day")}
            modifyCampaignDates={() => {}}
            recipeEditing={false}
            savePostChanges={() => {}}
            notify={() => {}}
          />
        </div>
        <div className="third flex column vc hc">
          <div className="description-box flex column hc">
            <h4 className="title silly-font pb8">Post Instructions</h4>
            <p className="body">
              Add custom steps for your marketing campaign or follow existing
              ones with a pre-built template.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Section3;
