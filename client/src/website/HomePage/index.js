import React, { Component } from "react";

import Page from "../../components/containers/Page";

import HomeMainSVG from "../../svgs/HomeMainSVG";
import HomeAISVG from "../../svgs/HomeAISVG";
import HomeInstructionsSVG from "../../svgs/HomeInstructionsSVG";
import HomeScheduleSVG from "../../svgs/HomeScheduleSVG";
import HomeWorkflowSVG from "../../svgs/HomeWorkflowSVG";

import PictureTextDescription from "../../components/PictureTextDescription";

import "./style.css";

class HomePage extends Component {
  state = {
    purpleBackground: true
  };
  changeState = newText => {
    this.setState({ buttonText: newText });
  };
  render() {
    return (
      <Page
        title="All-In-One Marketing Solution"
        description="Organize your marketing process with an all-in-one solution for unified content promotion."
        keywords="content, ghostit, marketing"
      >
        <HomeMainSVG />
        <PictureTextDescription
          svg={<HomeAISVG />}
          title="Machine Learning"
          description="Use the power of artificial intelligence to target the right marketing channels."
          size="large"
          direction="left"
        />
        <PictureTextDescription
          svg={<HomeWorkflowSVG />}
          title="Custom Workflows"
          description="Map your marketing campaign from scratch or use pre-built templates."
          size="large"
        />
        <PictureTextDescription
          svg={<HomeInstructionsSVG />}
          title="Post Instructions"
          description="Add custom steps for your marketing campaign or follow existing ones with a pre-built template."
          size="large"
          direction="left"
        />
        <PictureTextDescription
          svg={<HomeScheduleSVG />}
          title="Social Scheduling"
          description="Sync all your social sharing accounts and post directly from our platform."
          size="large"
        />
      </Page>
    );
  }
}

export default HomePage;
