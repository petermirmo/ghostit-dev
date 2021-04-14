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
      description="Our marketing agency focuses on one thing: increasing qualified traffic to your site. Find out how our team can simplify your marketing process."
      keywords="content creators"
      style={{ width: "100%" }}
      title="Ghostit Services"
    >
      <GIText className="tac mb8" type="h1">
        <GIText
          className="primary-font"
          text="Search Engine Optimized (SEO) Blog Posts"
          type="span"
        />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Delivering high-quality content that attracts potential customers right to your website."
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText
            className="bold fs-20 mb4"
            text="Content Marketing Strategy"
            type="h3"
          />
          <GIText className="mb16" text="" type="p">
            During our onboarding session, our team will sit with you to
            understand your tone and voice of your brand. We will then develop a
            detailed content marketing strategy plan that includes word length
            for your content piece and the number of pieces of content per
            month.
          </GIText>
          <GIText
            className="bold fs-20 mb4"
            text="Content Creation"
            type="h3"
          />
          <GIText className="mb16" text="" type="p">
            Whether it’s a blog post or a full-length article, our content
            consistently drives increased traffic. Our approach to writing
            content is simple yet effective – we take the time to understand the
            value your brand brings to your audience. We then create original
            content for you based on your strategy while keeping your brand in
            mind. Once your content is ready, you’ll receive a copy of it for
            review, where you can make suggestions or edit requests.
          </GIText>
          <GIText
            className="bold fs-20 mb4"
            text="Search Engine Optimization"
            type="h3"
          />
          <GIText className="mb64" text="" type="p">
            We ensure that all the content we produce is optimized for your
            niche market. We conduct comprehensive SEO research of target
            keywords and optimize all titles and content with key terms.
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
      <ServicesNavigation />
    </Page>
  );
}

export default ServiceBlogPage;
