import React, { Component } from "react";

import Page from "../../components/containers/Page";

import AgencyBlog from "../../svgs/AgencyBlog";
import AgencyUnderstanding from "../../svgs/AgencyUnderstanding";
import AgencyStrategy from "../../svgs/AgencyStrategy";
import AgencyCreation from "../../svgs/AgencyCreation";
import HomeAISVG from "../../svgs/HomeAISVG";

import GIText from "../../components/views/GIText";
import PictureTextDescription from "../../components/PictureTextDescription";
import NavigationLayout from "../../components/NavigationLayout";

import "./style.css";

class GhostitAgency extends Component {
  render() {
    return (
      <Page
        title="Agency"
        description="Increase the amount of qualified traffic to your site."
        keywords="content, ghostit, marketing, agency"
        className="website-page"
      >
        <PictureTextDescription
          svg={<HomeAISVG />}
          title="Understanding Your Business"
          description="Before we can start creating your content, we need to know who you are. Understanding your company is our
          mission and allows us to create great content. We want to know you better than any digital agency can.
          That starts with a conversation and a questionnaire. What are your KPIs? What are your top goals? The more
          we know about you, the faster we will be able to increase your site traffic."
          size="large"
          direction="left"
        />
        <NavigationLayout
          data={[
            <AgencyBlog />,
            <AgencyBlog />,
            <AgencyBlog />,
            <AgencyBlog />,
            <AgencyBlog />
          ]}
        />

        <PictureTextDescription
          svg={<AgencyStrategy />}
          title="Content Marketing Strategy"
          description="From here, we take full control. Your Content Strategy is where we get into the real heavy details. We delve into your target demographic (what is your ideal buyer's persona?), what are they searching for? What are the topics and keywords you need to be ranking for (high search intent and volume, low difficulty), and a full competitive analysis (what is your competition ranking for and how can we make your website show up before theirs)."
          size="large"
          direction="left"
        />
        <PictureTextDescription
          svg={<AgencyCreation />}
          title="Content Creation and Refinement"
          description="Once your content strategy has been created and we are ready to start writing, our content coordinator
          finds an in-house writer that best fits for your company’s needs. And like a perfectly synchronized tag
          team, the content coordinator tags in the writer to get writing. Before it goes live, all the content we
          create for you is edited by the coordinator first. Then, it's put up for your approval, or automatically
          scheduled and posted, depending on your preference."
          size="large"
          direction="left"
        />
      </Page>
    );
  }
}

export default GhostitAgency;

{
  /* <h1 className="tac">Content Services</h1>
        <h3 className="tac mx16 unimportant-text">Increase the amount of qualified traffic to your site.</h3>
        <div className="wrapping-container">


          <div className="container-box small common-shadow pa32 ma32 br4">
            <h4 className="h2-like mb8">2. Content Marketing Strategy</h4>
            <p>
              ‍Before we can start creating your content, we need to know who you are. Understanding your company is our
              mission and allows us to create great content. We want to know you better than any digital agency can.
              That starts with a conversation and a questionnaire. What are your KPIs? What are your top goals? The more
              we know about you, the faster we will be able to increase your site traffic.
            </p>
          </div>

          <div className="container-box small common-shadow pa32 ma32 br4">
            <h4 className="h2-like mb8">3. Content Creation and Refinement</h4>
            <p>
              Once your content strategy has been created and we are ready to start writing, our content coordinator
              finds an in-house writer that best fits for your company’s needs. And like a perfectly synchronized tag
              team, the content coordinator tags in the writer to get writing. Before it goes live, all the content we
              create for you is edited by the coordinator first. Then, it's put up for your approval, or automatically
              scheduled and posted, depending on your preference.
            </p>
          </div>
        </div> */
}
