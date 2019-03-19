import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";
import Section5 from "./Section5";

import PictureTextDescription from "../../components/PictureTextDescription";

import { mobileAndTabletcheck } from "../../componentFunctions";

class HomePage extends Component {
  state = {
    blendHeaderWithHomePage: !mobileAndTabletcheck()
  };
  componentDidMount() {
    this._ismounted = true;

    // This is for header to blend with background when at top of home page
    window.onscroll = e => {
      if (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      )
        this.changeState("blendHeaderWithHomePage", false);
      else {
        if (!mobileAndTabletcheck())
          this.changeState("blendHeaderWithHomePage", true);
      }
    };
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  changeState = (index, value) => {
    if (this._ismounted) this.setState({ [index]: value });
  };

  render() {
    const { blendHeaderWithHomePage } = this.state;
    return (
      <Page
        title="All-In-One Marketing Solution"
        description="Organize your marketing process with an all-in-one solution for unified content promotion."
        keywords="content, ghostit, marketing"
        blendWithHomePage={blendHeaderWithHomePage}
        className="column"
      >
        <GIContainer className="column full-screen full-center">
          <img
            src="src/svgs/home-main-background.svg"
            style={{
              position: "absolute",
              top: "0",
              height: "98%",
              width: "100%",
              zIndex: "-1"
            }}
          />
          <GIText
            text="Create. Customize. Convert."
            type="h2"
            style={{ color: "var(--white-theme-color)" }}
            className="mt32 mb8 tac"
          />
          <GIText
            text="Organize your marketing process with an all-in-one solution for unified content promotion."
            type="h6"
            style={{ color: "var(--white-theme-color)" }}
            className="mb32 tac"
          />
          <img
            src="src/svgs/home-main.svg"
            className="fill-parent"
            style={{ width: "60%", minWidth: "250px", height: "auto" }}
          />
        </GIContainer>
        <GIContainer className="column floating-box">
          <GIText
            text="Improve Your Traffic and Conversions"
            type="h1"
            className="tac"
          />
          <GIText
            text="Ghostit lets you map out marketing campaigns, assign instructions, and schedule your content directly from the platform so you can get more done in less time."
            type="h6"
            className="tac"
          />
        </GIContainer>
        <PictureTextDescription
          svg="home-ai"
          title="Machine Learning"
          description="Use the power of artificial intelligence to target the right marketing channels."
          size="large"
          direction="left"
        />
        <PictureTextDescription
          svg="home-workflow"
          title="Custom Workflows"
          description="Map your marketing campaign from scratch or use pre-built templates."
          size="large"
        />
        <PictureTextDescription
          svg="home-instructions"
          title="Post Instructions"
          description="Add custom steps for your marketing campaign or follow existing ones with a pre-built template."
          size="large"
          direction="left"
        />
        <PictureTextDescription
          svg="home-schedule"
          title="Social Scheduling"
          description="Sync all your social sharing accounts and post directly from our platform."
          size="large"
        />
        <Section5 />
      </Page>
    );
  }
}

export default HomePage;
