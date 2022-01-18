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
      description="Grow your revenue and meet your KPIs with strategic email marketing designed to deliver tangible results"
      keywords="content creators"
      style={{ width: "100%" }}
      title="Email Newsletters"
    >
      <GIText className="tac mb8" type="h1">
        <GIText className="primary-font" text="Email Newsletters" type="span" />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Grow your revenue and meet your KPIs with strategic email marketing designed to deliver tangible results"
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            Email newsletters may seem like an outdated tool but, when leveraged
            correctly, can be a game-changer for businesses searching for more
            leads, website traffic, open rates, and customer engagement.
          </GIText>
          <GIText className="mb16" text="" type="p">
            Including email marketing in your content strategy doesn’t
            mean blasting subscribers with spam. Our team builds an email
            marketing strategy that includes:
          </GIText>
          <GIContainer className="column pl16 mb16">
            <GIText className="mb16" text="" type="p">
              - Sending regularly scheduled newsletters to keep you top-of-mind,
            </GIText>
            <GIText className="mb16" text="" type="p">
              - Building email blasts to welcome new subscribers or promote new
              offers, and
            </GIText>
            <GIText className="mb16" text="" type="p">
              - Automating email campaigns to reduce admin time so you can focus
              your time and energy on growing your business.
            </GIText>
          </GIContainer>
          <GIText className="mb64" text="" type="p">
            There’s no reason your email newsletter can’t be the one your
            customers look forward to opening, and with content writing services
            like ours, we can ensure your subscribers feel their impact. Our
            email newsletters consistently outperform and have a higher
            click-through rate than the industry average. We write, design, and
            build emails to inform your audience and prompt them to take action.
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
