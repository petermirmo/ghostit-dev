import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import AgencyBlog from "../../svgs/AgencyBlog";
import AgencyBlogActive from "../../svgs/AgencyBlogActive";
import AgencySocial from "../../svgs/AgencySocial";
import AgencySocialActive from "../../svgs/AgencySocialActive";
import AgencyEbook from "../../svgs/AgencyEbook";
import AgencyEbookActive from "../../svgs/AgencyEbookActive";
import AgencyNewsletter from "../../svgs/AgencyNewsletter";
import AgencyNewsletterActive from "../../svgs/AgencyNewsletterActive";
import AgencyWeb from "../../svgs/AgencyWeb";
import AgencyWebActive from "../../svgs/AgencyWebActive";

import HomeAISVG from "../../svgs/HomeAISVG";

import GIText from "../../components/views/GIText";
import PictureTextDescription from "../../components/PictureTextDescription";
import NavigationLayout from "../../components/NavigationLayout";

import "./style.css";

class GhostitAgency extends Component {
  state = {
    categories: [
      {
        notActive: <AgencyBlog />,
        active: <AgencyBlogActive />,
        title1: "Optimized",
        title2: "Blog Posts"
      },
      {
        notActive: <AgencySocial />,
        active: <AgencySocialActive />,
        title1: "Social Media",
        title2: "Posts"
      },
      {
        notActive: <AgencyEbook />,
        active: <AgencyEbookActive />,
        title1: "Lead Generation",
        title2: "E-books"
      },
      {
        notActive: <AgencyNewsletter />,
        active: <AgencyNewsletterActive />,
        title1: "Email",
        title2: "Newsletters"
      },
      {
        notActive: <AgencyWeb />,
        active: <AgencyWebActive />,
        title1: "Web",
        title2: "Content"
      }
    ],
    activeAgencyDescription: 0
  };
  render() {
    const { categories, activeAgencyDescription } = this.state;
    return (
      <Page
        title="Agency"
        description="Increase the amount of qualified traffic to your site."
        keywords="content, ghostit, marketing, agency"
        className="website-page"
      >
        <GIText type="h1" text="Content Services" className="tac" />
        <GIText
          type="h4"
          text="Increase the amount of qualified traffic to your site."
          className="tac mb32"
        />
        <NavigationLayout
          className="mx64"
          data={categories.map((category, index) => {
            let active = false;
            if (index === activeAgencyDescription) active = true;

            return (
              <GIContainer
                onClick={() =>
                  this.setState({ activeAgencyDescription: index })
                }
                className="column mx16 same-size-flex-items"
              >
                <GIContainer className="column fill-flex">
                  {active && category.active}
                  {!active && category.notActive}
                </GIContainer>
                <GIText type="h3" text={category.title1} className="tac" />
                <GIText type="h3" text={category.title2} className="tac" />
              </GIContainer>
            );
          })}
        />
      </Page>
    );
  }
}

export default GhostitAgency;
