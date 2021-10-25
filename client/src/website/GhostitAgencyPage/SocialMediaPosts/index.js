import React from "react";
import { Link } from "react-router-dom";

import ServicesNavigation from "../ServicesNavigation";

import Page from "../../../components/containers/Page";
import GIContainer from "../../../components/containers/GIContainer";
import GIText from "../../../components/views/GIText";

import { isMobileOrTablet } from "../../../util";

function ServiceBlogPage() {
  return (
    <Page
      className="website-page align-center px32 mt32"
      description="Authentic, engaging content to drive your brand forward"
      keywords="content creators"
      style={{ width: "100%" }}
      title="Social Media Posts"
    >
      <GIText className="tac mb8" type="h1">
        <GIText
          className="primary-font"
          text="Social Media Posts"
          type="span"
        />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Authentic, engaging content to drive your brand forward"
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            You may have a love-hate relationship with social media, but it’s an
            integral part of a business’ digital content strategy. So how do you
            cut through the noise and stand out? We can say from experience,
            it’s not about quantity — it’s about quality.
          </GIText>
          <GIText className="mb16" text="" type="p">
            Organic growth doesn’t come overnight. It’s a long-term process, and
            it won’t come at all without purposeful, high-quality social media
            posts — that’s where our content writing services come in.
          </GIText>
          <GIText className="mb16" text="" type="p">
            We spend as much time as you need discovering the core of your
            business and its personality. This shapes how we consistently
            develop quality posts that power your social media channels and add
            value to your customers’ online conversations.
          </GIText>
          <GIText className="mb16" text="" type="p">
            From Facebook to Twitter to LinkedIn to Instagram, your Ghostit
            social media content creator takes care of every step of the content
            creation process:
          </GIText>
          <GIContainer className="column pl32">
            <GIText className="mb16" type="p">
              • Uniquely format your message for each platform.
            </GIText>
            <GIText className="mb16" type="p">
              • Schedule your posts at optimal times.
            </GIText>
            <GIText className="mb64" type="p">
              • Ensure content is published according to our — and your —
              standards.
            </GIText>
          </GIContainer>
        </GIContainer>
        <Link
          className="tac no-bold white fs-26 bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
          style={{ width: "50%" }}
          to="/contact-us"
        >
          Get a Quote
        </Link>
      </GIContainer>
      <ServicesNavigation />
    </Page>
  );
}

export default ServiceBlogPage;
