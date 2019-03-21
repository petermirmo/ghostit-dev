import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";
import Section5 from "./Section5";

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
        <GIContainer className="x-fill full-center my64">
          <GIContainer className="container-box extra-large column">
            <GIText
              text="Improve Your Traffic and Conversions"
              type="h1"
              className="tac mb8"
            />
            <GIText
              text="Ghostit lets you map out marketing campaigns, assign instructions, and schedule your content directly from the platform so you can get more done in less time."
              type="h6"
              className="tac"
            />
          </GIContainer>
        </GIContainer>

        <GIContainer className="x-wrap full-center mt16 reverse">
          <GIContainer
            className="column full-center container-box large"
            style={{ flex: 1 }}
          >
            <GIContainer className="column container-box small mb8 mx16">
              <GIText
                text="Machine Learning"
                type="h1"
                className={`${mobileAndTabletcheck() ? "tac" : "tal"} mb8`}
              />
              <GIText
                className={`${mobileAndTabletcheck() ? "tac" : "tal"}`}
                text="Use the power of artificial intelligence to target the right marketing channels."
                type="h6"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer
            className="full-center container-box small mx16"
            style={{ flex: 0.8 }}
          >
            <img src="src/svgs/home-ai.svg" className="fill-parent" />
          </GIContainer>
        </GIContainer>

        <GIContainer className="x-wrap full-center mt16">
          <GIContainer
            className="column full-center container-box large"
            style={{ flex: 1 }}
          >
            <GIContainer className="column container-box small mb8 mx16">
              <GIText
                text="Custom Workflows"
                type="h1"
                className={`${mobileAndTabletcheck() ? "tac" : "tar"} mb8`}
              />
              <GIText
                className={`${mobileAndTabletcheck() ? "tac" : "tar"}`}
                text="Map your marketing campaign from scratch or use pre-built templates."
                type="h6"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer
            className="full-center container-box small mx16"
            style={{ flex: 0.8 }}
          >
            <img src="src/svgs/home-workflow.svg" className="fill-parent" />
          </GIContainer>
        </GIContainer>

        <GIContainer className="x-wrap full-center mt16 reverse">
          <GIContainer
            className="column full-center container-box large"
            style={{ flex: 1 }}
          >
            <GIContainer className="column container-box small mb8 mx16">
              <GIText
                text="Post Instructions"
                type="h1"
                className={`${mobileAndTabletcheck() ? "tac" : "tal"} mb8`}
              />
              <GIText
                className={`${mobileAndTabletcheck() ? "tac" : "tal"}`}
                text="Add custom steps for your marketing campaign or follow existing ones with a pre-built template."
                type="h6"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer
            className="full-center container-box small mx16"
            style={{ flex: 0.8 }}
          >
            <img src="src/svgs/home-instructions.svg" className="fill-parent" />
          </GIContainer>
        </GIContainer>

        <GIContainer className="x-wrap full-center mt16">
          <GIContainer
            className="column full-center container-box large"
            style={{ flex: 1 }}
          >
            <GIContainer className="column container-box small mb8 mx16">
              <GIText
                text="Social Scheduling"
                type="h1"
                className={`${mobileAndTabletcheck() ? "tac" : "tar"} mb8`}
              />
              <GIText
                className={`${mobileAndTabletcheck() ? "tac" : "tar"}`}
                text="Sync all your social sharing accounts and post directly from our platform."
                type="h6"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer
            className="full-center container-box small mx16"
            style={{ flex: 0.8 }}
          >
            <img src="src/svgs/home-schedule.svg" className="fill-parent" />
          </GIContainer>
        </GIContainer>

        <Section5 />
      </Page>
    );
  }
}

export default HomePage;
