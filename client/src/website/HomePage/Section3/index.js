import React, { Component } from "react";
import moment from "moment-timezone";

import Post from "../../../components/Post";

class Section3 extends Component {
  render() {
    return (
      <div className="section px32">
        <div className="third common-container-center">
          <div className="small-box">
            <h4 className="h1-like pt8">Post Instructions</h4>
            <p>
              Add custom steps for your marketing campaign or follow existing
              ones with a pre-built template.
            </p>
          </div>
        </div>
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
            accountsHomePage={[
              {
                socialType: "facebook",
                accountType: "page",
                username: "Facebook Page",
                _id: "1234"
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

export default Section3;
