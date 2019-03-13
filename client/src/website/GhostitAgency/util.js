import React from "react";
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

export const categories = [
  {
    notActive: <AgencyBlog />,
    active: <AgencyBlogActive />,
    title1: "Optimized",
    title2: "Blog Posts",
    description:
      "A relevant blog post is more than just 500 to 1000 random words. We make your company's blog into a powerful tool that helps your website rank higher in Google and converts visitors into paying customers. Our posts turn your blog into a growth machine. Coupled with an in-depth content marketing strategy that looks into your company's brand and voice, we create unique blog posts that your new and existing customers will come back for over and over."
  },
  {
    notActive: <AgencySocial />,
    active: <AgencySocialActive />,
    title1: "Social Media",
    title2: "Posts",
    description:
      "We create social content a little different than other companies. We create them with the goal in mind toget your customers excited about what you are promoting. We do this because we don't want we createfor our customers to just add to the noise. When it comes to social media, consistency is key, but not allplatforms are created equal. The tone you use on Facebook shouldn't be the same on LinkedIn, but yourbrand's voice should. The social posts we create keep your messaging voice at the forefront whilereformulating it for each platform. Your posts will always be on-point and designed to resonate with youraudience, whether you're on Facebook, Twitter, LinkedIn or Instagram."
  },
  {
    notActive: <AgencyEbook />,
    active: <AgencyEbookActive />,
    title1: "Lead Generation",
    title2: "E-books",
    description:
      "You'll see how easy it is to push your goals with a well-written, commercially-driven e-book that caters to your targeted audience. With the right content coordinator-writer combo, they'll pair strong research and creative writing to tell a story that'll appeal to your demographic. Hubspot's main driver of email signups is their powerful e-book strategy. If it's an indication of how powerful it can be they drive 6000 leads per day. "
  },
  {
    notActive: <AgencyNewsletter />,
    active: <AgencyNewsletterActive />,
    title1: "Email",
    title2: "Newsletters",
    description:
      "\"Not another one.\" That's not something your customers should be saying about your email newsletters. Your email campaigns should be part and parcel of a strong marketing strategy. When done right, you'll notice an increase in leads, website tra!c and customer engagement. Who doesn't want customers who care about your business?"
  },
  {
    notActive: <AgencyWeb />,
    active: <AgencyWebActive />,
    title1: "Web",
    title2: "Content",
    description:
      "\"Not another one.\" That's not something your customers should be saying about your email newsletters. Your email campaigns should be part and parcel of a strong marketing strategy. When done right, you'll notice an increase in leads, website tra!c and customer engagement. Who doesn't want customers who care about your business?"
  }
];
