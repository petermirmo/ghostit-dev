import React from "react";
import { Link } from "react-router-dom";

import ServicesNavigation from "../ServicesNavigation";

import Page from "../../../components/containers/Page";
import GIContainer from "../../../components/containers/GIContainer";
import GIText from "../../../components/views/GIText";

import { isMobileOrTablet } from "../../../util";

function ServiceBlogPage({ location }) {
  return (
    <Page
      className="website-page align-center px32 mt32"
      description="Setting up effective paid online advertising to generate leads and drive traffic to your business"
      keywords="content creators"
      style={{ width: "100%" }}
      title="Paid Online Advertising"
    >
      <GIText className="tac mb8" type="h1">
        <GIText
          className="primary-font"
          text="Paid Online Advertising"
          type="span"
        />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Setting up effective paid online advertising to generate leads and drive traffic to your business"
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            Google, Facebook, and other online platforms boast billions of users
            — users you could be turning into leads and sales for your business.
            As part of a comprehensive content strategy, paid online
            advertising can amplify your brand and get the right eyes on your
            business.
          </GIText>
          <GIText className="mb16" text="" type="p">
            However, paid online advertising can seem like a black hole.
            Businesses spend increasing amounts of money on ads yet fail to see
            the results they want, leading them to believe they're of no use.
            With our experienced team, we put your money to good use, doing the
            research, custom URL tracking, and management of your ad campaigns
            throughout their duration to improve optimization and targeting.
          </GIText>
          <GIText className="mb16" text="" type="p">
            We ensure that all the content we produce is optimized for your
            niche market. We conduct comprehensive SEO research of target
            keywords and optimize all titles and content with key terms.
          </GIText>
          <GIText
            className="bold fs-20 mb4"
            text="We have the know-how and expertise to place online ads on:"
            type="h3"
          />
          <GIContainer className="column pl16 mb16">
            <GIText className="mb4" text="" type="p">
              - Facebook,
            </GIText>
            <GIText className="mb4" text="" type="p">
              - YouTube,
            </GIText>
            <GIText className="mb4" text="" type="p">
              - Instagram,
            </GIText>
            <GIText className="mb4" text="" type="p"></GIText>- Google,
            <GIText className="mb4" text="" type="p"></GIText>- LinkedIn,
            <GIText className="mb4" text="" type="p"></GIText>- And more,
          </GIContainer>
          <GIText className="mb64" text="" type="p">
            Does your content strategy involve content promotion? Our
            team knows exactly how to push your website articles and blog posts
            to new, relevant audiences with shared interests and followings of
            their own to networks like Outbrain and Quuu Promote.
          </GIText>
        </GIContainer>
        <Link
          className="tac no-bold white fs-26 bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
          style={{ width: "50%" }}
          to="/contact-us"
        >
          Get a Quote
        </Link>
      </GIContainer>
      <ServicesNavigation location={location} />
    </Page>
  );
}

export default ServiceBlogPage;
