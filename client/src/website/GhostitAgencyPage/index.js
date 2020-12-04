import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/pro-solid-svg-icons/faDollarSign";
import { faBrowser } from "@fortawesome/pro-solid-svg-icons/faBrowser";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import SvgBranch from "../../components/SvgBranch";

import NavigationLayout from "../../components/navigations/NavigationLayout";

import AgencyForm from "../../components/forms/AgencyForm";

import { isMobileOrTablet } from "../../util";
import { shortenText } from "./util";

import "./style.css";

class GhostitAgency extends Component {
  state = {
    activeAgencyComponent: 0,
    showMore1: false,
    showMore2: false,
    showMore3: false,
    showMore4: false,
    showMore5: false,
    showMore6: false,
    showMore7: false,
  };
  render() {
    const {
      activeAgencyComponent,
      showMore1,
      showMore2,
      showMore3,
      showMore4,
      showMore5,
      showMore6,
      showMore7,
    } = this.state;
    let textAlignClassName = "taj";

    if (isMobileOrTablet()) textAlignClassName = "tac";
    return (
      <Page
        className="website-page align-center mt32"
        description="Our marketing agency focuses on one thing: increasing qualified traffic to your site. Find out how our team can simplify your marketing process."
        keywords="content creators"
        style={{ width: "100%" }}
        title="Ghostit Services"
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
        <GIContainer className="container full wrap justify-center px32">
          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore1: !showMore1 })}
          >
            <GIText
              className="muli mb8"
              text="SEO Optimized Blog Posts"
              type="h4"
            />
            <GIText
              text={shortenText(
                showMore1,
                "How often are you posting on your blog? Can you track the effectiveness of your efforts? Is each post performing the way you need it to? A relevant blog post is more than just 500 to 1000 random words. We make your company's blog into a powerful tool that helps your website rank higher in Google and converts visitors into paying customers. Our posts turn your blog into a growth machine. Coupled with an in-depth content marketing strategy that looks into your company's brand and voice, we create unique blog posts that your new and existing customers will come back for."
              )}
              type="p"
            />
            <GIContainer className="pt8">
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
          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore2: !showMore2 })}
          >
            <GIText className="muli mb8" text="Social Media Posts" type="h4" />

            <GIText
              text={shortenText(
                showMore2,
                "Quality social media does two things: educates and engages your audience. You know that person in the group who monopolizes the conversation, never asks anyone about themselves, and generally has lousy timing? Yeah, no one wants to be that person, especially on social media. We create quality social posts to get your customers excited about what you're promoting. We add value to the conversation online — we don't just add to the noise. We help you create strong customer relationships by posting engaging, relevant, and consistent content that is uniquely formatted for each specific social platform. Your posts will always be on-point and designed to resonate with your audience, whether you're on Facebook, Twitter, LinkedIn or Instagram."
              )}
              type="p"
            />
            <GIContainer className="pt8">
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
          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore6: !showMore6 })}
          >
            <GIText className="muli mb8" text="Paid Advertising" type="h4" />
            <GIText
              text={shortenText(
                showMore6,
                "In today's fast-paced online world, organic content and social media aren't going to cut it anymore. To see real results now, you're going to have to invest. The problem with paid advertising online is that anyone can do it, but most people are doing it wrong. Paid advertising online involves a lot of research, custom URL tracking, and management to be effective. Otherwise, you may as well be advertising in a newspaper that no one reads. Our team has the time, experience, and passion needed to see results. We can help you set up the right paid ad campaigns for your business on the relevant social platforms and search engines like Google so that your business is seen by the right people at the right time."
              )}
              type="p"
            />
            <GIContainer className="pt8">
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <FontAwesomeIcon className="" icon={faDollarSign} size="2x" />
            </GIContainer>
          </GIContainer>

          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore4: !showMore4 })}
          >
            <GIText className="muli mb8" text="Email Newsletter" type="h4" />
            <GIText
              text={shortenText(
                showMore4,
                "\"Not another one.\" That's not shortenText your customers should be saying about your email newsletters. Your email campaigns should be part and parcel of a strong marketing strategy. When done right, you'll notice an increase in leads, website traffic, open rates, and customer engagement. Every business and entrepreneur out there is sending newsletters, your job is to be the one that your customer opens and enjoys reading. We can help."
              )}
              type="p"
            />
            <GIContainer className="pt8">
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
          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore5: !showMore5 })}
          >
            <GIText className="muli mb8" text="Web Content" type="h4" />
            <GIText
              text={shortenText(
                showMore5,
                "Your website is the most powerful marketing vehicle you can leverage. You can't afford to have a less than inspiring website in today's world. Even if you're equipped with a beautiful design and stunning photographs, content is still the most effective conversion tool in your arsenal. Your website must be esthetically pleasing, easy to read, answer your target customers' concerns, have a quick load time, and rank for the relevant keywords in your industry. That's just what it needs to do to be found. Your copy needs to be compelling and relevant enough to convert. This is where we come in. We will search engine optimize your website with in-depth keyword research and competitor analysis to generate organic traffic from Google. We will create content that will engage and convert visitors into lifelong customers. From your homepage to the contact page and everything in-between, we want your website to be a comprehensive content experience that turns visitors into loyal customers."
              )}
              type="p"
            />
            <GIContainer className="x-fill mt16">
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
          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore3: !showMore3 })}
          >
            <GIText
              className="muli mb8"
              text="Lead Generation E-Book"
              type="h4"
            />
            <GIText
              text={shortenText(
                showMore3,
                "You'll see how easy it is to push your goals with a well-written, commercially-driven ebook that caters to your targeted audience. Our ghostwriters and content specialists will pair intense research and creative writing abilities to tell a story that'll appeal to your demographic. Don't believe an ebook could be a powerful conversion tool? Don't take our word for it. Hubspot's main driver of email signups is their powerful ebook strategy, driving 6000 leads per day!"
              )}
              type="p"
            />
            <GIContainer className="pt8">
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
          <GIContainer
            className="clickable bg-white relative column container small common-border ov-visible one-blue shadow-3 px32 py64 mb48 mx16 br20"
            onClick={() => this.setState({ showMore7: !showMore7 })}
          >
            <GIText
              className="muli mb8"
              text="Website Design & Development"
              type="h4"
            />
            <GIText
              text={shortenText(
                showMore7,
                "We don't just build websites. Nowadays, anyone can build a website. At Ghostit, our team thinks of your website as your online business persona. When you have a business, you don't just put time into what your storefront looks like. You also need to network in your community, advertise, and provide quality service. This is how we approach website design. Sure, we think it's important to have an attractive and well-designed site, but we do more than that. We focus on creating compelling content that converts, and that ranks well with Google, Bing, and other search engines. When it comes to functionality, there's no set of features or complexity we can't handle. We've helped businesses create well-ranking, beautiful, and functional eCommerce sites, online communities, and basic informational websites. Don't settle for any old website. Get the site that works for you and get's you noticed."
              )}
              type="p"
            />
            <GIContainer className="pt8">
              <GIContainer className="dot bg-three-blue" />
              <GIContainer className="dot bg-five-blue ml4" />
              <GIContainer className="dot bg-seven-blue ml4" />
            </GIContainer>

            <GIContainer className="agency-img-absolute-container full-center common-border four-blue bg-white round">
              <FontAwesomeIcon icon={faBrowser} size="2x" />
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
          <GIContainer className="container extra-large justify-center wrap mb32">
            <GIContainer className="full-center xy-96px common-border one-blue mr16 mb16 round">
              <GIContainer className="full-center xy-64px common-border four-blue round">
                <GIText text="1" type="h1" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="column justify-center flex-fill x-min-250px mr16">
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
              className="mt8"
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1568821295/agency-img-1.jpg"
            />
          </GIContainer>
          <GIContainer className="container-box extra-large justify-center wrap mb32">
            <GIContainer className="full-center xy-96px common-border one-blue mr16 mb16 round">
              <GIContainer className="full-center xy-64px common-border four-blue round">
                <GIText text="2" type="h1" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="column justify-center flex-fill x-min-250px mr16">
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
              className="mt8"
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1568821217/agency-img-2.jpg"
            />
          </GIContainer>
          <GIContainer className="container-box extra-large justify-center wrap mb32">
            <GIContainer className="full-center xy-96px common-border one-blue mr16 mb16 round">
              <GIContainer className="full-center xy-64px common-border four-blue round">
                <GIText text="3" type="h1" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="column justify-center flex-fill x-min-250px mr16">
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
              className="mt8"
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1568821296/agency-img-3.jpg"
            />
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default GhostitAgency;
