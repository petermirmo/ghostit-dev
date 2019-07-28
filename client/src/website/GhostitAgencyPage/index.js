import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import SvgBranch from "../../components/SvgBranch";

import NavigationLayout from "../../components/navigations/NavigationLayout";

import AgencyForm from "../../components/forms/AgencyForm";

import { categories } from "./util.js";

import { isMobileOrTablet } from "../../componentFunctions";

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
        <GIText className="four-blue tac mb8" type="h1">
          Content
          <GIText className="primary-font" text="&nbsp;Services" type="span" />
        </GIText>
        <GIText
          className="tac mb32"
          text="Increase the amount of qualified traffic to your site."
          type="h4"
        />
        {!isMobileOrTablet() && (
          <NavigationLayout
            className="x-wrap full-center"
            data={categories.map((category, index) => {
              let active = false;
              if (index === activeAgencyComponent) active = true;

              return (
                <GIContainer
                  className="column mx16 container-box column x-150px"
                  onClick={() =>
                    this.setState({ activeAgencyComponent: index })
                  }
                >
                  <GIContainer className="clickable">
                    {active && category.active}
                    {!active && category.notActive}
                  </GIContainer>
                  <GIText
                    className="tac ellipsis"
                    type="h3"
                    text={category.title1}
                  />
                  <GIText
                    className="tac ellipsis"
                    type="h3"
                    text={category.title2}
                  />
                </GIContainer>
              );
            })}
          />
        )}

        <GIContainer className="column full-center container-box extra-large">
          {!isMobileOrTablet() && (
            <GIContainer
              className="py32 px64 mt16 mb32 br4"
              style={{ backgroundColor: "var(--seven-blue-color)" }}
            >
              <GIText
                className="white"
                text={categories[activeAgencyComponent].description}
                type="p"
              />
            </GIContainer>
          )}
          {!isMobileOrTablet() && (
            <GIText
              className="tac mb32"
              text="Our content services are focused on one thing. Increasing the amount of qualified traffic to your site."
              type="h3"
            />
          )}

          <GIContainer className="x-fill x-wrap full-center reverse mt32">
            <GIContainer className="container-box small column mb8 mx16">
              <GIText
                className={`${textAlignClassName} mb8`}
                text="Understanding Your Business"
                type="h3"
              />
              <GIText
                className={textAlignClassName}
                text="Before we can start creating your content, we need to know who you are. Understanding your company is our mission and allows us to create great content. We want to know you better than any digital agency can. That starts with a conversation and a questionnaire. What are your KPIs? What are your top goals? The more we know about you, the faster we will be able to increase your site traffic."
                type="p"
              />
            </GIContainer>
            <GIContainer className="container-box x-150px mx16">
              <img
                alt="agency-understanding"
                className="fill-parent"
                src={require("../../svgs/agency-understanding.svg")}
              />
            </GIContainer>
          </GIContainer>

          <GIContainer className="x-fill x-wrap full-center reverse mt32">
            <GIContainer className="container-box small column mb8 mx16">
              <GIText
                className={`${textAlignClassName} mb8`}
                text="Content Marketing Strategy"
                type="h3"
              />
              <GIText
                className={textAlignClassName}
                text="From here, we take full control. Your Content Strategy is where we get into the real heavy details. We delve into your target demographic (what is your ideal buyer's persona?), what are they searching for? What are the topics and keywords you need to be ranking for (high search intent and volume, low difficulty), and a full competitive analysis (what is your competition ranking for and how can we make your website show up before theirs)."
                type="p"
              />
            </GIContainer>
            <GIContainer className="container-box x-150px mx16">
              <img
                alt="agency-strategy"
                src={require("../../svgs/agency-strategy.svg")}
                className="fill-parent"
              />
            </GIContainer>
          </GIContainer>

          <GIContainer className="x-fill x-wrap full-center reverse mt32">
            <GIContainer className="container-box small column mb8 mx16">
              <GIText
                className={`${textAlignClassName} mb8`}
                text="Content Creation and Refinement"
                type="h3"
              />
              <GIText
                className={textAlignClassName}
                text="Once your content strategy has been created and we are ready to start writing, our content coordinator finds an in-house writer that best fits for your company’s needs. And like a perfectly synchronized tag team, the content coordinator tags in the writer to get writing. Before it goes live, all the content we create for you is edited by the coordinator first. Then, it's put up for your approval, or automatically scheduled and posted, depending on your preference."
                type="p"
              />
            </GIContainer>
            <GIContainer className="container-box x-150px mx16">
              <img
                alt="agency-creation"
                src={require("../../svgs/agency-creation.svg")}
                className="fill-parent"
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>

        <GIContainer className="container-box extra-large mt32">
          <GIText
            text="Book a call to go over the details of your content marketing requirements."
            type="h1"
            className="tac px32 x-fill"
          />
        </GIContainer>
        <GIContainer className="x-wrap px32 x-fill container-box extra-large">
          <GIContainer className="fill-flex my32">
            <AgencyForm />
          </GIContainer>
          <GIContainer className="pl32 my32">
            <img
              alt="agency-call"
              src={require("../../svgs/agency-call.svg")}
              className="fill-parent"
            />
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default GhostitAgency;
