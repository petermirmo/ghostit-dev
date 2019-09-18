import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import SvgBranch from "../../components/SvgBranch";

import NavigationLayout from "../../components/navigations/NavigationLayout";

import AgencyForm from "../../components/forms/AgencyForm";

import { categories } from "./util.js";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class GhostitAgency extends Component {
  state = {
    categories,
    activeAgencyComponent: 0
  };
  render() {
    const { activeAgencyComponent, categories } = this.state;
    let textAlignClassName = "taj";

    if (isMobileOrTablet()) textAlignClassName = "tac";
    return (
      <Page
        className="website-page align-center mt32"
        description="Increase the amount of qualified traffic to your site."
        keywords="content, ghostit, marketing, agency"
        title="Agency"
      >
        <GIText className="tac mb8" type="h1">
          Content
          <GIText className="primary-font" text="&nbsp;Services" type="span" />
        </GIText>
        <GIText
          className="tac mb64"
          text="Increase the amount of qualified traffic to your site."
          type="h4"
        />
        <GIContainer className="x-fill x-wrap full-center px32">
          <GIContainer className="relative column container-box small common-border ov-visible one-blue shadow-3 px32 py64 br20">
            <GIText
              className="muli mb8"
              text="Optimized Blog Posts"
              type="h4"
            />
            <GIText
              text="A relevant blog post is more than just 500 to 1000 random words. We make your company's blog into a powerful tool that helps your website rank higher in Google and converts visitors into paying customers. Our posts turn your blog into a growth machine. Coupled with an in-depth content marketing strategy that looks into your company's brand and voice, we create unique blog posts that your new and existing customers will come back for over and over."
              type="p"
            />
            <GIContainer className="test common-border four-blue bg-white round" />
          </GIContainer>
        </GIContainer>

        <GIContainer className="x-fill">
          <AgencyForm />
        </GIContainer>
      </Page>
    );
  }
}

export default GhostitAgency;
