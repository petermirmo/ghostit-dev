import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import SvgBranch from "../../components/SvgBranch";

import NavigationLayout from "../../components/navigations/NavigationLayout";

import AgencyForm from "../../components/forms/AgencyForm";

import { isMobileOrTablet } from "../../util";
import { something } from "./util";

import "./style.css";

class GhostitAgency extends Component {
  state = {
    activeAgencyComponent: 0,
    showMore1: false,
    showMore2: false,
    showMore3: false,
    showMore4: false,
    showMore5: false
  };
  render() {
    const {
      activeAgencyComponent,
      showMore1,
      showMore2,
      showMore3,
      showMore4,
      showMore5
    } = this.state;
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
          className="tac px32 mb64"
          text="Increase the amount of qualified traffic to your site."
          type="h4"
        />
        <GIContainer className="x-fill x-wrap justify-center px32">
          <GIContainer className="relative column container-box small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20">
            <GIText
              className="muli mb8"
              text="Optimized Blog Posts"
              type="h4"
            />
            <GIText
              text={something(
                showMore1,
                "A relevant blog post is more than just 500 to 1000 random words. We make your company's blog into a powerful tool that helps your website rank higher in Google and converts visitors into paying customers. Our posts turn your blog into a growth machine. Coupled with an in-depth content marketing strategy that looks into your company's brand and voice, we create unique blog posts that your new and existing customers will come back for over and over."
              )}
              type="p"
            />
            <GIContainer
              className="x-fill mt16"
              onClick={() => this.setState({ showMore1: !showMore1 })}
            >
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <img
                alt=""
                className="x-50"
                src={require("../../svgs/agency-edit.svg")}
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="relative column container-box small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20">
            <GIText className="muli mb8" text="Social Media Post" type="h4" />
            <GIText
              text={something(
                showMore2,
                "We create social content a little different than other companies. We create them with the goal in mind toget your customers excited about what you are promoting. We do this because we don't want we createfor our customers to just add to the noise. When it comes to social media, consistency is key, but not allplatforms are created equal. The tone you use on Facebook shouldn't be the same on LinkedIn, but yourbrand's voice should. The social posts we create keep your messaging voice at the forefront whilereformulating it for each platform. Your posts will always be on-point and designed to resonate with youraudience, whether you're on Facebook, Twitter, LinkedIn or Instagram."
              )}
              type="p"
            />
            <GIContainer
              className="x-fill mt16"
              onClick={() => this.setState({ showMore2: !showMore2 })}
            >
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <img
                alt=""
                className="x-50"
                src={require("../../svgs/agency-thumbs-up.svg")}
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="relative column container-box small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20">
            <GIText
              className="muli mb8"
              text="Lead Generation E-Book"
              type="h4"
            />
            <GIText
              text={something(
                showMore3,
                "You'll see how easy it is to push your goals with a well-written, commercially-driven e-book that caters to your targeted audience. With the right content coordinator-writer combo, they'll pair strong research and creative writing to tell a story that'll appeal to your demographic. Hubspot's main driver of email signups is their powerful e-book strategy. If it's an indication of how powerful it can be they drive 6000 leads per day."
              )}
              type="p"
            />
            <GIContainer
              className="x-fill mt16"
              onClick={() => this.setState({ showMore3: !showMore3 })}
            >
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <img
                alt=""
                className="x-50"
                src={require("../../svgs/agency-book.svg")}
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="relative column container-box small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20">
            <GIText className="muli mb8" text="Email Newsletter" type="h4" />
            <GIText
              text={something(
                showMore4,
                "\"Not another one.\" That's not something your customers should be saying about your email newsletters. Your email campaigns should be part and parcel of a strong marketing strategy. When done right, you'll notice an increase in leads, website tra!c and customer engagement. Who doesn't want customers who care about your business?"
              )}
              type="p"
            />
            <GIContainer
              className="x-fill mt16"
              onClick={() => this.setState({ showMore4: !showMore4 })}
            >
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <img
                alt=""
                className="x-50"
                src={require("../../svgs/agency-email.svg")}
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="relative column container-box small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20">
            <GIText className="muli mb8" text="Web Content" type="h4" />
            <GIText
              text={something(
                showMore5,
                "Your website is the most powerful marketing vehicle you can leverage. Even if you’re equipped with a beautiful design and stunning photographs, content is still the most effective conversion tool in your arsenal. Not only can we help search engine optimize your website with in-depth keyword research and competitor analysis to generate organic traffic from Google, we also create content that your target audience will engage with. This helps build brand trust and credibility, which is invaluable especially for businesses in competitive verticals. From your homepage to the contact page and everything in-between, we want your website to be a comprehensive content experience that turns visitors into loyal customers. Enhance your conversion rates and brand voice through quality website content."
              )}
              type="p"
            />
            <GIContainer
              className="x-fill mt16"
              onClick={() => this.setState({ showMore5: !showMore5 })}
            >
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <img
                alt=""
                className="x-50"
                src={require("../../svgs/agency-web.svg")}
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>

        <GIContainer className="column full-center mb64">
          <img
            alt=""
            className="mb32"
            src={require("../../svgs/agency-laptop-graph.svg")}
          />
          <GIText
            className="muli tac px32"
            text="Our content services are focused on one thing."
            type="h4"
          />
          <GIText className="muli tac px32" type="h2">
            Increasing the amount of{" "}
            <GIText
              className="four-blue"
              text="Qualified Traffic"
              type="span"
            />{" "}
            to your site.
          </GIText>
        </GIContainer>
        <GIContainer className="column full-center">
          <GIContainer className="container-box extra-large justify-center x-wrap mb32">
            <GIContainer className="full-center xy-96px common-border one-blue mr16 mb16 round">
              <GIContainer className="full-center xy-64px common-border four-blue round">
                <GIText text="1" type="h1" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="column justify-center fill-flex x-min-250px mr16">
              <GIText className="muli mb16" type="h4">
                Understanding Your{" "}
                <GIText className="four-blue" text="Business" type="span" />
              </GIText>
              <GIText type="p">
                Before we can start creating your content, we need to know who
                you are. Understanding your company is our mission and allows us
                to create great content. We want to know you better than any
                digital agency can.
                <br />
                <br />
                That starts with a conversation and a questionnaire. What are
                your KPIs? What are your top goals? The more we know about you,
                the faster we will be able to increase your site traffic.
              </GIText>
            </GIContainer>
            <img
              alt=""
              className=""
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1568821295/agency-img-1.jpg"
            />
          </GIContainer>
          <GIContainer className="container-box extra-large justify-center x-wrap mb32">
            <GIContainer className="full-center xy-96px common-border one-blue mr16 mb16 round">
              <GIContainer className="full-center xy-64px common-border four-blue round">
                <GIText text="2" type="h1" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="column justify-center fill-flex x-min-250px mr16">
              <GIText className="muli mb16" type="h4">
                Content Marketing{" "}
                <GIText className="four-blue" text="Strategy" type="span" />
              </GIText>
              <GIText type="p">
                From here, we take full control. Your Content Strategy is where
                we get into the real heavy details. We delve into your target
                demographic (what is your ideal buyer's persona?), what are they
                searching for?
                <br />
                <br />
                What are the topics and keywords you need to be ranking for
                (high search intent and volume, low difficulty), and a full
                competitive analysis (what is your competition ranking for and
                how can we make your website show up before theirs).
              </GIText>
            </GIContainer>
            <img
              alt=""
              className=""
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1568821217/agency-img-2.jpg"
            />
          </GIContainer>
          <GIContainer className="container-box extra-large justify-center x-wrap mb32">
            <GIContainer className="full-center xy-96px common-border one-blue mr16 mb16 round">
              <GIContainer className="full-center xy-64px common-border four-blue round">
                <GIText text="3" type="h1" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="column justify-center fill-flex x-min-250px mr16">
              <GIText className="muli mb16" type="h4">
                Content Creation &{" "}
                <GIText className="four-blue" text="Refinement" type="span" />
              </GIText>
              <GIText type="p">
                Once your content strategy has been created and we are ready to
                start writing, our content coordinator finds an in-house writer
                that best fits for your company’s needs. And like a perfectly
                synchronized tag team, the content coordinator tags in the
                writer to get writing.
                <br />
                <br />
                Before it goes live, all the content we create for you is edited
                by the coordinator first. Then, it's put up for your approval,
                or automatically scheduled and posted, depending on your
                preference.
              </GIText>
            </GIContainer>
            <img
              alt=""
              className=""
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1568821296/agency-img-3.jpg"
            />
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
