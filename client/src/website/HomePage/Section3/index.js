import React, { Component } from "react";
import moment from "moment-timezone";

import Post from "../../../components/Post";

class Section3 extends Component {
  render() {
    return (
      <div className="section px32 my64 py64">
        <div className="flex1 common-container-center mb32">
          <div className="container-box small">
            <h4 className="h1-like pt8">Post Instructions</h4>
            <p>
              Add custom steps for your marketing campaign or follow existing
              ones with a pre-built template.
            </p>
          </div>
        </div>
        <div className="common-shadow mx16 flex1" id="home-page-post-container">
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
