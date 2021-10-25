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
      description="Leave cookie-cutter websites behind — customize your website to increase engagement and leads for your business"
      style={{ width: "100%" }}
      title="Web Design & Development"
    >
      <GIText className="tac mb8" type="h1">
        <GIText
          className="primary-font"
          text="Web Design & Development"
          type="span"
        />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Leave cookie-cutter websites behind — customize your website to increase engagement and leads for your business "
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            Thanks to website builders like Wix and Squarespace, creating your
            own website has never been easier. But a site needs to be more than
            just pretty pictures and a nice layout. It’s often a potential
            lead’s first impression of your business; what impression are you
            making?
          </GIText>
          <GIText className="mb16" text="" type="p">
            Our goal is to make sure your website leaves a positive, lasting
            impression on your visitors that still focuses on driving traffic
            and conversions. Our team works hand-in-hand with you to understand
            your vision so our UI and UX designers can custom develop an
            attractive, user-friendly website that aligns with your brand — and
            we don’t stop there. We use a data-driven approach to ensure we’re
            using the right SEO guaranteed to help rank your business with
            superior copy and content that converts visitors into leads.
          </GIText>
          <GIText className="mb16" text="" type="p">
            Ghostit’s team of skilled web developers are all about the details,
            building out your designs and website features and ensuring your
            website is fully functional, optimized, and bug-free before it goes
            live.
          </GIText>
          <GIText
            className="bold fs-20 mb4"
            text="We’re proficient in:"
            type="h3"
          />
          <GIContainer className="column pl16 mb16">
            <GIText className="mb4" text="" type="p">
              - CMS, such as WordPress;
            </GIText>
            <GIText className="mb4" text="" type="p">
              - Website builders (i.e. Wix, Squarespace, Webflow); and
            </GIText>
            <GIText className="mb4" text="" type="p">
              - Custom development and coding with libraries like React and
              languages like Javascript.
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
