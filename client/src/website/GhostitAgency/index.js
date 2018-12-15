import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import "./style.css";

class GhostitAgency extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div className="website-page">
        <MetaTags>
          <title>Ghostit | Agency</title>
          <meta
            name="description"
            content="Increase the amount of qualified traffic to your site."
          />
          <meta property="og:title" content="Agency" />
          <meta
            property="og:description"
            content="Increase the amount of qualified traffic to your site."
          />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/ghostit-co/image/upload/v1544851159/5993441872de2b0001f8b90c_Ghostit_Logo_-_Final_webclip.png"
          />
        </MetaTags>
        <h1 className="tac">Content Services</h1>
        <h3 className="tac mx16 unimportant-text">
          Increase the amount of qualified traffic to your site.
        </h3>
        <div className="wrapping-container">
          <div className="container-box small common-shadow pa32 ma32">
            <h4 className="h2-like mb8">1. Understanding Your Business</h4>
            <p>
              ‍Before we can start creating your content, we need to know who
              you are. Understanding your company is our mission and allows us
              to create great content. We want to know you better than any
              digital agency can. That starts with a conversation and a
              questionnaire. What are your KPIs? What are your top goals? The
              more we know about you, the faster we will be able to increase
              your site traffic.
            </p>
          </div>

          <div className="container-box small common-shadow pa32 ma32">
            <h4 className="h2-like mb8">2. Content Marketing Strategy</h4>
            <p>
              ‍Before we can start creating your content, we need to know who
              you are. Understanding your company is our mission and allows us
              to create great content. We want to know you better than any
              digital agency can. That starts with a conversation and a
              questionnaire. What are your KPIs? What are your top goals? The
              more we know about you, the faster we will be able to increase
              your site traffic.
            </p>
          </div>

          <div className="container-box small common-shadow pa32 ma32">
            <h4 className="h2-like mb8">3. Content Creation and Refinement</h4>
            <p>
              Once your content strategy has been created and we are ready to
              start writing, our content coordinator finds an in-house writer
              that best fits for your company’s needs. And like a perfectly
              synchronized tag team, the content coordinator tags in the writer
              to get writing. Before it goes live, all the content we create for
              you is edited by the coordinator first. Then, it's put up for your
              approval, or automatically scheduled and posted, depending on your
              preference.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default GhostitAgency;
