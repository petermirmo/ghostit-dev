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
      description="Build authority, increase brand presence, and capture leads with high-value, high-quality eBooks"
      keywords="content creators"
      style={{ width: "100%" }}
      title="Lead Generation eBooks"
    >
      <GIText className="tac mb8" type="h1">
        <GIText
          className="primary-font"
          text="Lead Generation eBooks"
          type="span"
        />
      </GIText>
      <GIText
        className="tac px32 mb64"
        text="Build authority, increase brand presence, and capture leads with high-value, high-quality eBooks"
        type="h4"
      />
      <GIContainer className="column full-center container large bg-white shadow-3 pa32 mb32 br16">
        <GIContainer className="column">
          <GIText className="mb16" text="" type="p">
            What’s a simple way you can generate leads and prove your expertise
            in your field? With a powerful yet underrated conversion tool: the
            downloadable eBook. Lead generating eBooks allow businesses to
            connect with potential customers through well-written, beautifully
            packaged downloads — something our content writing services can
            provide.
          </GIText>
          <GIText className="mb64" text="" type="p">
            Our eBook ghostwriters combine intense research, team collaboration,
            and creative writing abilities to tell a story that appeals to your
            niche audience. And with a targeted landing page and effective paid
            ad strategy, you’ll capture leads instantly while raising brand
            awareness every time a user heads to your website to download your
            eBook.
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
