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
      description="Update your website copy and content with our data-driven approach"
      keywords="content creators"
      style={{ width: "100%" }}
      title="Web Content"
    >
      <GIText className="tac mb8" type="h1">
        <GIText className="primary-font" text="Web Content" type="span" />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Update your website copy and content with our data-driven approach"
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            Beautifully designed websites with stunning photography are only
            half the battle (or even less) if you want a high-ranking website
            that converts. So what’s the other half?
          </GIText>
          <GIText className="mb16" text="" type="p">
            Your web content is the real star in your conversion tool belt. It
            should be easy to read, speak directly to your customers’ concerns,
            and load quickly — all with SEO-relevant keywords in mind.
          </GIText>
          <GIText className="mb16" text="" type="p">
            If you find your current website struggles to rank or convert, we’ll
            sit down with you to audit your website and identify areas of
            improvement. We analyze your call-to-actions, landing pages, title
            tags, and website copy for their effectiveness in meeting your
            business goals. We also do competitor analysis to ensure we’re
            implementing content strategies that can give your web content an
            edge over the competition.
          </GIText>
          <GIText className="mb64" text="" type="p">
            To develop a robust content strategy, we’ll do a deep dive into your
            target audience’s pain points and expectations and research
            pertinent SEO short- and long-tail keywords. Our writers will then
            leverage this data to create tailored website content your
            demographic will respond to. With compelling content, you’ll engage
            visitors, generate new leads, and create lifelong customers.
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
