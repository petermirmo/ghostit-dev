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
      description="Boost your search engine positioning with data-driven, high-quality blog posts that will scale your business"
      keywords="content creators"
      style={{ width: "100%" }}
      title="SEO Blog Posts"
    >
      <GIText className="tac mb8" type="h1">
        <GIText className="primary-font" text="SEO Blog Posts" type="span" />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Boost your search engine positioning with data-driven, high-quality blog posts that will scale your business"
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            SEO — three letters that strike fear into the hearts of businesses
            and blog writers worldwide. It’s never been more complex and
            challenging to rank, begging the question: Is it worth it?
          </GIText>
          <GIText className="mb16" text="" type="p">
            Of course, the answer is yes. You have something worthwhile to
            share, and with the right SEO partner, visitors will come — and
            convert.
          </GIText>
          <GIText className="mb64" text="" type="p">
            Our team knows how to dig into your business and brand,
            understanding minute details such as personality, tone, and voice.
            We take this in-depth research and build a comprehensive digital
            content strategy, complete with quality keywords for your audience
            and niche. From here, a Ghostit blog writer can transform ideas into
            coherent, engaging posts with high-value backlinks that will turn
            your blog page into a growth machine.
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
