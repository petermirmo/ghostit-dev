import React, { Component } from "react";
import moment from "moment-timezone";

import Calendar from "../../../components/Calendar";

import { mobileAndTabletcheck } from "../../../componentFunctions";

let startingDate = new moment().add(-10, "day");
const calendarEvents = [
  {
    _id: "5c0d925bf241b544d81f8be9",
    startDate: startingDate,
    endDate: new moment(startingDate).add(9, "day"),
    name: "Blog Post Promotion Template",
    description:
      "Use this amazing blog post promotion marketing template as a standard operating procedure when posting a blog post. With this template you can edit, add or remove any of the instructions you don't want to or follow the full template. ",
    userID: "5acfa9409f3e9e06ac173d26",
    color: "var(--campaign-color3)",
    createdAt: "2018-09-13T21:58:06.650Z",
    updatedAt: "2018-12-09T22:10:13.092Z",
    __v: 13,
    recipeID: "5b9add6ef3c75900146c21f7",
    calendarID: "5c0c8692d1942c1570f32fed",
    posts: [
      {
        _id: "5c0d9260f241b544d81f8bea",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "When you are optimizing your blog post on your site make sure you do the following. \n\n- Include your keyword in your URL\n\n- Use Short URL’s \n\n- Make sure your post is keyword optimized and people are searching for that search term\n\n- Front-Load Your Keyword In Your Title Tag. If your target keyword is “Blog post promotion”\n\n- Make sure it shows up in the beginning of the blog posts → “Blow post promotion - The complete checklist”\n\n- Make sure your keyword appears in the first 150 words. \n\n- Use Your Keyword in H1, H2 or H3 Tags\n\n- Optimize Images. Add alt tags \n\n- Use External Links. Link out to content that will make your points in your article more credible. \n\n- Use Internal Links. Link to any of your already existing content that would add to the readers experience. ",
        postingDate: new moment(startingDate),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Post the blog to the website. Pre-post blog checklist",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:32.297Z",
        updatedAt: "2018-12-09T22:08:32.297Z",
        __v: 0
      },
      {
        _id: "5c0d9262f241b544d81f8bec",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "When sending out your blog post to your email list make sure you do the following:\n\n- Keep your subject line short and engaging \n\n- Put the important links at the top of the email! Clicks dramatically drop off the lower your links are within the body of your email \n\n- Write a short summary on the article with a link back. \n\n- Add the option to share to friends.\n\nSomething to consider: if you are posting blog posts frequently you don’t want to bombard your audience with emails. \n\nSend the best blog post once to twice per week or do a blog roundup. \n",
        postingDate: new moment(startingDate).add(1, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Send blog to email list",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:34.401Z",
        updatedAt: "2018-12-09T22:08:34.401Z",
        __v: 0
      },
      {
        _id: "5c0d926af241b544d81f8bee",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#0077b5",
        status: "pending",
        accountID: "qOY79iYOOp",
        content: "Check out our new blog!",
        instructions:
          "Blog post link: ghostit.co/blog\n\nCreate a LinkedIn post that talks about your blog post. Stories or long form posts do better than shorter posts on LinkedIn. Try and incorporate more of your blog post into the LinkedIn post than you would on Facebook or Twitter. \n\n-----\n\nExample post from Ryan Bonnici Vp of marketing at G2 Crowd. \n\n\"I wouldn't be where I am today if it weren't for the help of some amazing mentors (and a hell of a lot of luck!!).\n\nFor the last few years I've made a real effort to #throwitback and say yes whenever i can to people asking for mentorship.\n\nIt has been an absolute blast meeting so many smart folks of all ages that want to learn and grow. But it has also been really difficult to manage at scale (especially since taking on my new role at G2 Crowd last year).\n\nThat's why this year I'm trying to share my learnings through more scalable channels, like podcasts, webinars and events.\n\nMost recently, the legendary Max Altschuler from Sales Hacker, Inc. launched his new #book 'Career Hacking for Millennials'. He and I caught up on his new #podcast, which you can have a listen to now. Or, if you want a free copy of his book, let me know in the comments.\n\nLink below:\n",
        postingDate: new moment(startingDate).add(2, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "linkedin",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Linkedin Post same day as publish",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:42.103Z",
        updatedAt: "2018-12-09T22:08:42.103Z",
        __v: 0
      },
      {
        _id: "5c0d926ff241b544d81f8bf0",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "Industry friends and colleagues are great people to share your article with. \n\nOnly share it with them if it is relevant and will add value. The more valuable your email is to your friends the greater the likelihood will be that they share it with their audience. \n\nThe easiest ways to share your blog post with your friends is through emails or mentioning them on social media.",
        postingDate: new moment(startingDate).add(1, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Share blog post with Friends",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:47.017Z",
        updatedAt: "2018-12-09T22:08:47.017Z",
        __v: 0
      },
      {
        _id: "5c0d9270f241b544d81f8bf2",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "If you have the budget, running small ads ($50-250) per blog post will help you get in front of your audience faster. Your goal for blogging as a business should be to drive people back to your site and an ad will accelerate this. This step can be reserved for your biggest posts and doesn’t have to be completed every time you publish a blog post. ",
        postingDate: new moment(startingDate).add(2, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Run Facebook Ad",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:48.856Z",
        updatedAt: "2018-12-09T22:08:48.856Z",
        __v: 0
      },
      {
        _id: "5c0d9273f241b544d81f8bf4",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "If you have the budget, running small ads ($50-250) per blog post will help you get in front of your audience faster. Your goal for blogging as a business should be to drive people back to your site and an ad will accelerate this. This step can be reserved for your biggest posts and doesn’t have to be completed every time you publish a blog post. ",
        postingDate: new moment(startingDate).add(4, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Run Facebook Ad",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:51.245Z",
        updatedAt: "2018-12-09T22:08:51.245Z",
        __v: 0
      },
      {
        _id: "5c0d9277f241b544d81f8bf6",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "Drive traffic back to your blog by answering relevant questions on niche communities. Reddit and Quora are a great way to make this work. \n\nReddit hates spam so be very careful that you are not blatantly posting your article with the hopes that people read it. The most effective articles that get clicks are thoughtful answers that need more. Say someone on reddit asks how to promote a blog post, you can go in and post at the end to your answer and say “If you are looking for more details or tactical information I  wrote up a full post on this that I would be happy to share”.\n\nFind good questions by filtering subreddits “top 24 hours” and see if engagement is high. If engagement is high you guess that other people are interested in the question and answers because it is getting upvoted. \n\nQuora is much more open to posting links but make sure your answer is thoughtful. Similar to Reddit, find questions that are picking up steam by checking the views on the question and then posting a summary of your answer with a link back to your blog post. ",
        postingDate: new moment(startingDate).add(6, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Answer questions on niche communities",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:55.296Z",
        updatedAt: "2018-12-09T22:08:55.296Z",
        __v: 0
      },
      {
        _id: "5c0d9280f241b544d81f8bfa",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#0077b5",
        status: "pending",
        accountID: "qOY79iYOOp",
        content: "Come check out our new Blog!",
        instructions:
          'Blog post link: ghostit.co/blog\n\nCreate a LinkedIn post posts that talks about your blog post. Since it has been a week and there is probably activity on your LinkedIn feed since then you can reuse the earlier post from the 17th. This post can be shorter since you already posted a long form post on LinkedIn. \n\nExample twitter post: "The best way to promote is to have a standard operating procedure so everyone is on the same page with what needs to be done. We created a standard operating procedure for you that you can follow and get maximum engagement on every post: www.ghostit.co/blog"\n\n',
        postingDate: new moment(startingDate).add(7, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "linkedin",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Linkedin Post 1 week after publish",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:09:04.194Z",
        updatedAt: "2018-12-09T22:09:04.194Z",
        __v: 0
      },
      {
        _id: "5c0d927bf241b544d81f8bf8",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "Re-posting your blog post to various communities is still viable such as LinkedIn Pulse, IndieHackers, or other relevant sites that allow you to put a version of your blog post on their site and point links back to your website. \n\n- Post blog post to IndieHackers\n- LinkedIn Pulse\n- Inbound.org",
        postingDate: new moment(startingDate).add(8, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5b9add6ef3c75900146c21f7",
        name: "Repurposing your content",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:08:59.950Z",
        updatedAt: "2018-12-09T22:08:59.950Z",
        __v: 0
      }
    ],
    row: 0
  },
  {
    _id: "5c0d96e49d377a1728c437bc",
    startDate: new moment(startingDate).add(3, "day"),
    endDate: new moment(startingDate).add(7, "day"),
    name: "Rahul's Idea",
    description: "Advertise biz card pricing",
    userID: "5acfa9409f3e9e06ac173d26",
    color: "var(--campaign-color1)",
    createdAt: "2018-10-12T23:23:04.046Z",
    updatedAt: "2018-12-09T22:28:34.270Z",
    __v: 4,
    recipeID: "5bc12cd88b083200136321a8",
    calendarID: "5c0c8692d1942c1570f32fed",
    posts: [
      {
        _id: "5c0d96f09d377a1728c437bd",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#0077b5",
        status: "pending",
        accountID: "qOY79iYOOp",
        content: "Come check out our awesome new site!",
        instructions: "",
        postingDate: new moment(startingDate).add(3, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "linkedin",
        campaignID: "5c0d96e49d377a1728c437bc",
        name: "Linkedin Post",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:28:00.821Z",
        updatedAt: "2018-12-09T22:28:00.821Z",
        __v: 0
      },
      {
        _id: "5c0d96fc9d377a1728c437bf",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions: "Blast out biz card promo to clients",
        postingDate: new moment(startingDate).add(4, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5bc12cd88b083200136321a8",
        name: "Send out newsletter email",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:28:12.842Z",
        updatedAt: "2018-12-09T22:28:12.842Z",
        __v: 0
      },
      {
        _id: "5c0d96ff9d377a1728c437c1",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#1da1f2",
        status: "pending",
        accountID: "921756558161088512",
        content:
          "Need business cards? $89 for 1,000.. Call us! #businesscards #yyjbusiness #yyjsmallbusiness #victoria #yyj",
        instructions: "n",
        postingDate: new moment(startingDate).add(5, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "twitter",
        campaignID: "5bc12cd88b083200136321a8",
        name: "Twitter Post",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:28:15.919Z",
        updatedAt: "2018-12-09T22:28:15.919Z",
        __v: 0
      },
      {
        _id: "5c0d97059d377a1728c437c3",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions: "Call 10 past clients",
        postingDate: new moment(startingDate).add(7, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5bc12cd88b083200136321a8",
        name: "Influencer Outreach",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:28:21.440Z",
        updatedAt: "2018-12-09T22:28:21.440Z",
        __v: 0
      }
    ],
    row: 1
  },
  {
    _id: "5c0d97309d377a1728c437c5",
    startDate: new moment(startingDate).add(10, "day"),
    endDate: new moment(startingDate).add(24, "day"),
    name: "HubSpot B2B Lead Generation Content Campaign",
    description:
      "Use this template when promoting an E-book, white paper, or any other kind of gated material. ",
    userID: "5acfa9409f3e9e06ac173d26",
    color: "var(--campaign-color4)",
    createdAt: "2018-11-05T23:48:16.218Z",
    updatedAt: "2018-12-09T22:30:41.650Z",
    __v: 11,
    recipeID: "5be0d6c086fa840013d52546",
    calendarID: "5c0c8692d1942c1570f32fed",
    posts: [
      {
        _id: "5c0d97429d377a1728c437c7",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#1da1f2",
        status: "pending",
        accountID: "921756558161088512",
        content:
          "Telling your personal brand story can be a challenge, but it’s one of the most important things you can do in 2018.",
        instructions:
          "Example Twitter Post: \n\nTelling your personal brand story can be a challenge, but it’s one of the most important things you can do in 2018.\n\nAt (our company) we created a guide on how to tell your brand story that includes over 40 real examples. \n\nDownload it here: ",
        postingDate: new moment(startingDate).add(10, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "twitter",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Twitter Post Day of Campaign Launch",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:22.913Z",
        updatedAt: "2018-12-09T22:29:22.913Z",
        __v: 0
      },
      {
        _id: "5c0d97799d377a1728c437db",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#0077b5",
        status: "pending",
        accountID: "qOY79iYOOp",
        content: "Hilarious and cool, can life get any better?",
        instructions:
          "First LinkedIn post on the day of your content launch:\n\nExample post: \n\nKnowing how to tell your personal brand story is one of the most important things you can do in 2018.\n\nEspecially on LinkedIn, we have seen this too many times where people don't know what they should be saying or how to properly tell their story.  \n\nYou can get our guide here: (insert link)",
        postingDate: new moment(startingDate).add(10, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "linkedin",
        campaignID: "5be0d6c086fa840013d52546",
        name: "LinkedIn Post Day of Campaign Launch",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:30:17.281Z",
        updatedAt: "2018-12-09T22:30:17.281Z",
        __v: 0
      },
      {
        _id: "5c0d97499d377a1728c437c9",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "HubSpot makes sure that their existing audience also gets notified of the content they have just promoted. \n\nWhy spend all this time and energy creating and promoting a lead generating piece if you’re not going to email it to your existing audience? They’re the ones who are most likely to promote your content for you. \n\nWhen writing this email, you don’t have to get creative. Simply use the text from your content and summarize it for a quick email broadcast. \n\n— \n\nSubject line: \n(1): How to tell your personal brand story \n(2): Stop stumbling when it comes to telling your personal brand story - Here’s how\n\nBody: \nHi (Name), \n\nTelling your personal brand story can be a challenge, but it’s one of the most important things you can do in 2018.\n\nTo help you overcome this challenge, we created an in-depth guide around How to Tell Your Personal Brand Story.\n\nIt covers: \n\n- Tips for what to include in your professional bio \n- 40+ real examples of professional bios\n- 40 plug-and-play templates\n- Advice on how to prepare and write your bio\n\nYou can download it here. → CTA\n\nAll the best, \n\nSender Name\nPosition\n\nP.S. If you think this is something your colleagues would find valuable, send it to them here. → CTA",
        postingDate: new moment(startingDate).add(11, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Send Out an Email Newsletter Broadcast",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:29.434Z",
        updatedAt: "2018-12-09T22:29:29.434Z",
        __v: 0
      },
      {
        _id: "5c0d974f9d377a1728c437cb",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "HubSpot makes sure that their existing audience also gets notified of the content they have just promoted. \n\nWhy spend all this time and energy creating and promoting a lead generating piece if you’re not going to email it to your existing audience? They’re the ones who are most likely to promote your content for you. \n\nWhen writing this email, you don’t have to get creative. Simply use the text from your content and summarize it for a quick email broadcast. \n\n— \n\nSubject line: \n(1): How to tell your personal brand story \n(2): Stop stumbling when it comes to telling your personal brand story - Here’s how\n\nBody: \nHi (Name), \n\nTelling your personal brand story can be a challenge, but it’s one of the most important things you can do in 2018.\n\nTo help you overcome this challenge, we created an in-depth guide around How to Tell Your Personal Brand Story.\n\nIt covers: \n\n- Tips for what to include in your professional bio \n- 40+ real examples of professional bios\n- 40 plug-and-play templates\n- Advice on how to prepare and write your bio\n\nYou can download it here. → CTA\n\nAll the best, \n\nSender Name\nPosition\n\nP.S. If you think this is something your colleagues would find valuable, send it to them here. → CTA",
        postingDate: new moment(startingDate).add(11, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Send Out an Email Newsletter Broadcast",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:35.029Z",
        updatedAt: "2018-12-09T22:29:35.029Z",
        __v: 0
      },
      {
        _id: "5c0d97519d377a1728c437cd",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "Because HubSpot is an influential, recognized brand name, they can pitch to guest blog pretty much anywhere and get accepted.\n\nFor us, it probably isn’t so easy. \n\nReferral traffic is super important for two reasons:\n\n\n1. It provides valuable backlinks to your site, helping your content rank up in search.\n2. It brands your business as an authority in the space leading to better name recognition. \n\n\nThere are three tools that I recommend here:\n\nAhrefs, Hunter.io, and LinkedIn.\n\nFirst, go to the Content Explorer tool in Ahrefs.\n\nThen, filter the content by the following: \n- 2017 to 2018 (or current year)\n- English\n- Domain rating between 30 and 60 (this can vary the stronger your own domain is)\n- Organic traffic at least over 300 visits per month\n\nYou can see under the “English” tab that there are 48 results. \n\nThose are 48 guest blogging prospects you can now reach out to and promote your content. \n\nIf you don’t know how to find their contact information, here’s an easy way to do it that works a fair bit of the time.\n\nFirst, pick a blog with big potential. In this example, let’s pick the third one down on the image. It has 4, 100 monthly organic views, so if you can get a blog on their blog, it would mean some significant traffic back to your own site. \n\nPut the URL into Hunter.io to get the email pattern.\n\nAs you can see, it says the email pattern is lastname@domain.com.\n\nTry to find at least 20 people to reach out to. \n\n",
        postingDate: new moment(startingDate).add(14, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5be0d6c086fa840013d52546",
        name:
          "Find Guest Blogging Opportunities to Drive Referral Traffic Back to Your Content",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:37.733Z",
        updatedAt: "2018-12-09T22:29:37.733Z",
        __v: 0
      },
      {
        _id: "5c0d97559d377a1728c437cf",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          'When putting your email together, make sure you’re clear about the reason you’re getting in touch. You don’t want to email them saying, “Can I write a blog post on your blog and link back to mine?” That’ll get you nowhere, and it’s spammy. No one wants to be on the receiving end of that email. \n\nInstead, try:\n\n"Hi James, \n\nI was reading (blog post title) and love how relevant it is to the process I’m going through right now of building my own personal brand. I love how you outlined (x, y, and z). \n\nIn the table of contents, you outlined how important print, signage, and packaging is but didn’t include any links to relevant signage content. \n\nWe created a guide on how to tell your personal brand story that includes 40+ email signature templates that can add a ton of value to your readers brand building learning journey. \n\nI was also wondering if there are any opportunities for someone who has lived this problem before to contribute to your blog as an industry expert?\n\nBest, \nKimia Hamidi"\n\nThis template does a few things that’ll help open up opportunities for your guest blogging or link building efforts. \n\n\n1. It’s not spammy and shows you put time into at least skimming their content.\n2. It includes the opportunity to have backlinks as well as guest blogging opportunities.\n3. There’s no hard ask — we don’t know them and they don’t know us. Warming them up before going in for a hard ask works way better. \n\nOnce you’ve done this enough times, you’ll find a few great guest blogging opportunities where you can take the best parts from your lead generating piece, turn them into a long-form blog post, and whip up a new post for that publication.  ',
        postingDate: new moment(startingDate).add(15, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Send your outreach emails to your 20 prospects ",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:41.104Z",
        updatedAt: "2018-12-09T22:29:41.104Z",
        __v: 0
      },
      {
        _id: "5c0d97599d377a1728c437d1",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#0077b5",
        status: "pending",
        accountID: "qOY79iYOOp",
        content: "Our new team member Jake, growing every day!",
        instructions:
          'Post another call to action about your content. Chances are your audience has forgotten about it or could have missed it. \n\nThe LinkedIn feed also updates so frequently that you can use your previous post. \n\n"Telling your brand story is one of the most important things you can do in 2018. \n\nWe found a lot of professionals struggle with it so we created a guide with over 40 examples that you can use.\n\nDownload it here: "',
        postingDate: new moment(startingDate).add(16, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "linkedin",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Linkedin Post 8 Days after Campaign Launch",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:45.274Z",
        updatedAt: "2018-12-09T22:29:45.274Z",
        __v: 0
      },
      {
        _id: "5c0d975f9d377a1728c437d3",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#1da1f2",
        status: "pending",
        accountID: "921756558161088512",
        content:
          "Only 5% of your audience sees what you post on twitter so make sure you update them with your call to action.",
        instructions:
          'Post another call to action about your content. \n\nOnly 5% of your audience sees what you post on twitter so make sure you update them with your call to action. \n\nYou can paraphrase what you already said in LinkedIn and Facebook. \n\n"Telling your brand story is one of the most important things you can do in 2018. \n\nWe found a lot of professionals struggle with it so we created a guide with over 40 examples that you can use.\n\nCheck it out here: "',
        postingDate: new moment(startingDate).add(17, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "twitter",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Twitter Post 8 Days after Campaign Launch",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:51.657Z",
        updatedAt: "2018-12-09T22:29:51.657Z",
        __v: 0
      },
      {
        _id: "5c0d97629d377a1728c437d5",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "var(--seven-purple-color)",
        instructions:
          "Finding influencers to share your content is a lot like finding guest blogging opportunities.\n\nSimply go to BuzzSumo and enter in the keyword that you used to find guest blogging opportunities. \n\nIn this case, it was “Personal Brand.”\n\nYou can then click “View Sharers” to find out who likes this type of content and who’s most likely to share your new piece with their audience. \n\nWe can use a similar email template, as well. The name of the game is repurposing the work we’ve already done for maximum success.\n\nHi (Name), \n\nI was scrolling through Twitter and noticed you shared (x, y, and z piece), all related to building a personal brand. I’m going through this process myself and thought the content you shared was very helpful! \n\nIf you have a few minutes, my team and I are about to publish (our B2B Lead Generation Piece) and would love to get your thoughts and see if you think it would be valuable to you or your audience. \n\nBest, \nKimia Hamidi \n\n\nThis template uses the same base as the earlier template but is asking more directly for the influencers opinion on the content. This validates them and makes them feel important but also gets important eyeballs on our content. ",
        postingDate: new moment(startingDate).add(18, "day"),
        linkImage: "",
        socialType: "custom",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Find Relevant Influencers to Promote Your Content",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:54.387Z",
        updatedAt: "2018-12-09T22:29:54.387Z",
        __v: 0
      },
      {
        _id: "5c0d97669d377a1728c437d7",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#1da1f2",
        status: "pending",
        accountID: "921756558161088512",
        content:
          "Do you struggle to tell your brand story or sometimes don't know what to write when people ask?",
        instructions:
          "Remind your audience that you spent time and effort creating this guide that they would find helpful.\n\nDo you struggle to tell your brand story or sometimes don't know what to write when people ask?\n\nDon't worry we spent a lot of time researching the best at this and created over 40+ examples and an in-depth guide that you can use.\n\nGet it here: ",
        postingDate: new moment(startingDate).add(23, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "twitter",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Twitter Post 14 days after campaign launch",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:29:58.368Z",
        updatedAt: "2018-12-09T22:29:58.368Z",
        __v: 0
      },
      {
        _id: "5c0d976d9d377a1728c437d9",
        images: [],
        userID: "5acfa9409f3e9e06ac173d26",
        color: "#1da1f2",
        status: "pending",
        accountID: "921756558161088512",
        content:
          "Don't worry we spent a lot of time researching the best at this and created over 40+ examples and an in-depth guide that you can use.",
        instructions:
          "Remind your audience that  you spent time and effort creating this guide that they would find helpful.\n\nDo you struggle to tell your brand story or sometimes don't know what to write when people ask?\n\nDon't worry we spent a lot of time researching the best at this and created over 40+ examples and an in-depth guide that you can use.\n\nGet it here: ",
        postingDate: new moment(startingDate).add(24, "day"),
        link: "",
        linkImage: "",
        accountType: "profile",
        socialType: "twitter",
        campaignID: "5be0d6c086fa840013d52546",
        name: "Twitter Post 21 days after your campaign lauch",
        calendarID: "5c0c8692d1942c1570f32fed",
        createdAt: "2018-12-09T22:30:05.376Z",
        updatedAt: "2018-12-09T22:30:05.376Z",
        __v: 0
      }
    ],
    row: 1
  }
];

class Section2 extends Component {
  state = {
    calendarDate: new moment()
  };
  render() {
    const { calendarDate } = this.state;
    return (
      <div id="home-page-sub-section">
        <div className="home-page-text mb32">
          <div className="small-box">
            <h1 className="h1-like pb8">Custom Workflows</h1>
            <p>
              Map your marketing campaign from scratch or use pre-built
              templates.
            </p>
          </div>
        </div>
        {!mobileAndTabletcheck() && (
          <div className="px64" id="home-page-calendar-container">
            <Calendar
              calendarEvents={calendarEvents}
              calendarDate={new moment()}
              onSelectDay={() => {}}
              onSelectPost={() => {}}
              onSelectCampaign={() => {}}
              timezone={"America/Vancouver"}
              categories={{
                All: true,
                Facebook: false,
                Twitter: false,
                Linkedin: false,
                Blog: false,
                Campaigns: false
              }}
              updateActiveCategory={() => {}}
              calendars={[]}
              onDateChange={date => this.setState({ calendarDate: date })}
              userList={[]}
            />
          </div>
        )}
        {mobileAndTabletcheck() && (
          <img
            className="width100"
            src="https://res.cloudinary.com/ghostit-co/image/upload/v1545336001/Screenshot_168.png"
          />
        )}
      </div>
    );
  }
}

export default Section2;
