import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";

import ContentModal from "./PostingFiles/ContentModal";
import PostEdittingModal from "./PostingFiles/PostEdittingModal";
import BlogEdittingModal from "./PostingFiles/BlogEdittingModal";
import NewsletterEdittingModal from "./PostingFiles/NewsletterEdittingModal";
import Calendar from "../../components/Calendar/";
import CampaignModal from "../../components/CampaignAndRecipe/CampaignModal";
import RecipeModal from "../../components/CampaignAndRecipe/RecipeModal";
import Notification from "../../components/Notifications/Notification";

class Content extends Component {
  state = {
    clickedEvent: undefined,
    clickedEventIsRecipe: false,
    recipeEditing: false,

    calendars: [],
    activeCalendarIndex: undefined,

    facebookPosts: [],
    twitterPosts: [],
    linkedinPosts: [],
    websitePosts: [],
    newsletterPosts: [],

    clickedDate: new moment(),

    blogEdittingModal: false,
    contentModal: false, // modal after selecting post from the recipeModal
    postEdittingModal: false,
    newsletterEdittingModal: false,
    campaignModal: false,
    recipeModal: false,

    calendarEventCategories: {
      All: true,
      Facebook: false,
      Twitter: false,
      Linkedin: false,
      Blog: false,
      Campaigns: false
    },
    notification: {
      show: false,
      type: undefined,
      title: undefined,
      message: undefined
    },
    timezone: ""
  };

  componentDidMount() {
    this._ismounted = true;
    axios.get("/api/timezone").then(res => {
      let { timezone, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      if (!timezone) timezone = this.state.timezone;
      moment.tz.setDefault(timezone);

      if (this._ismounted) this.setState({ timezone });
    });

    axios.get("/api/calendars").then(res => {
      const { success, calendars, defaultCalendarID } = res.data;
      if (!success || !calendars || calendars.length === 0) {
        console.log(res.data.err);
        console.log(res.data.message);
        console.log(calendars);
      } else {
        let activeCalendarIndex = calendars.findIndex(
          calObj => calObj._id === defaultCalendarID
        );
        if (activeCalendarIndex === -1) activeCalendarIndex = 0;
        this.setState({ calendars, activeCalendarIndex }, this.fillCalendar);
      }
    });
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  fillCalendar = () => {
    this.getPosts();
    this.getBlogs();
    this.getNewsletters();
    this.getCampaigns();
  };

  notify = (type, title, message, length = 5000) => {
    const { notification } = this.state;
    if (!notification.show) {
      setTimeout(() => {
        this.setState({
          notification: {
            show: false
          }
        });
      }, length);
    }
    this.setState({
      notification: {
        show: true,
        type,
        title,
        message
      }
    });
  };

  getPosts = () => {
    // if this (or any of the getPosts/getBlogs/getCampaigns/etc fails,
    // we should maybe setState({ posts: [] })) so that we don't render
    // posts from a previous calendar
    const { calendars, activeCalendarIndex } = this.state;
    if (!calendars || !calendars[activeCalendarIndex]) {
      console.log(calendars);
      console.log(activeCalendarIndex);
      console.log("calendar error");
      return;
    }
    const calendarID = calendars[activeCalendarIndex]._id;
    let facebookPosts = [];
    let twitterPosts = [];
    let linkedinPosts = [];

    // Get all of user's posts to display in calendar
    axios.get("/api/calendar/posts/" + calendarID).then(res => {
      const { success, err, message, posts, loggedIn } = res.data;
      if (!success) {
        console.log(message);
        console.log(err);
      } else {
        if (loggedIn === false) window.location.reload();

        for (let index in posts) {
          posts[index].startDate = posts[index].postingDate;
          posts[index].endDate = posts[index].postingDate;
        }

        for (let index in posts) {
          if (posts[index].socialType === "facebook") {
            facebookPosts.push(posts[index]);
          } else if (posts[index].socialType === "twitter") {
            twitterPosts.push(posts[index]);
          } else if (posts[index].socialType === "linkedin") {
            linkedinPosts.push(posts[index]);
          }
        }
        if (this._ismounted) {
          this.setState({
            facebookPosts: facebookPosts,
            twitterPosts: twitterPosts,
            linkedinPosts: linkedinPosts
          });
        }
      }
    });
  };

  getBlogs = () => {
    const { calendars, activeCalendarIndex } = this.state;
    if (!calendars || !calendars[activeCalendarIndex]) {
      console.log(calendars);
      console.log(activeCalendarIndex);
      console.log("calendar error");
      return;
    }
    const calendarID = calendars[activeCalendarIndex]._id;

    axios.get("/api/calendar/blogs/" + calendarID).then(res => {
      let { success, err, message, blogs, loggedIn } = res.data;
      if (!success) {
        console.log(message);
        console.log(err);
      } else {
        if (loggedIn === false) window.location.reload();

        for (let index in blogs) {
          blogs[index].startDate = blogs[index].postingDate;
          blogs[index].endDate = blogs[index].postingDate;
        }

        if (this._ismounted) {
          this.setState({ websitePosts: blogs });
        }
      }
    });
  };

  getNewsletters = () => {
    const { calendars, activeCalendarIndex } = this.state;
    if (!calendars || !calendars[activeCalendarIndex]) {
      console.log(calendars);
      console.log(activeCalendarIndex);
      console.log("calendar error");
      return;
    }
    const calendarID = calendars[activeCalendarIndex]._id;

    axios.get("/api/calendar/newsletters/" + calendarID).then(res => {
      let { success, err, message, newsletters, loggedIn } = res.data;
      if (!success) {
        console.log(message);
        console.log(err);
      } else {
        if (loggedIn === false) window.location.reload();

        for (let index in newsletters) {
          newsletters[index].startDate = newsletters[index].postingDate;
          newsletters[index].endDate = newsletters[index].postingDate;
        }

        if (this._ismounted) {
          this.setState({ newsletterPosts: newsletters });
        }
      }
    });
  };

  getCampaigns = () => {
    const { calendars, activeCalendarIndex } = this.state;
    if (!calendars || !calendars[activeCalendarIndex]) {
      console.log(calendars);
      console.log(activeCalendarIndex);
      console.log("calendar error");
      return;
    }
    const calendarID = calendars[activeCalendarIndex]._id;

    axios.get("/api/calendar/campaigns/" + calendarID).then(res => {
      let { success, err, message, campaigns, loggedIn } = res.data;
      if (!success) {
        console.log(message);
        console.log(err);
      } else {
        if (loggedIn === false) window.location.reload();

        for (let index in campaigns) {
          campaigns[index].campaign.posts = campaigns[index].posts;
          campaigns[index] = campaigns[index].campaign;
        }

        if (this._ismounted) {
          this.setState({ campaigns });
        }
      }
    });
  };

  openModal = date => {
    // Date for post is set to date clicked on calendar
    // Time for post is set to current time
    this.setState({ clickedDate: date, recipeModal: true });
  };
  handleChange = (value, index) => {
    this.setState({ [index]: value });
  };
  editPost = post => {
    // Open editting modal
    if (post.socialType === "blog") {
      this.setState({ blogEdittingModal: true, clickedEvent: post });
    } else if (post.socialType === "newsletter") {
      this.setState({ newsletterEdittingModal: true, clickedEvent: post });
    } else if (
      post.socialType === "facebook" ||
      post.socialType === "twitter" ||
      post.socialType === "linkedin"
    ) {
      this.setState({ postEdittingModal: true, clickedEvent: post });
    }
  };

  openCampaign = campaign => {
    this.setState({
      campaignModal: true,
      clickedEvent: campaign,
      clickedEventIsRecipe: false,
      recipeEditing: false
    });
  };

  closeModals = () => {
    this.setState({
      blogEdittingModal: false,
      contentModal: false,
      postEdittingModal: false,
      newsletterEdittingModal: false,
      campaignModal: false,
      recipeModal: false,
      recipeEditorModal: false,
      clickedEvent: undefined
    });
  };

  updateActiveCategory = categoryName => {
    let calendarEventCategories = this.state.calendarEventCategories;
    calendarEventCategories[categoryName] = !calendarEventCategories[
      categoryName
    ];
    calendarEventCategories["All"] = false;

    if (categoryName === "All") {
      this.setState({
        calendarEventCategories: {
          All: true,
          Facebook: false,
          Twitter: false,
          Linkedin: false,
          Blog: false,
          Campaigns: false
        }
      });
    } else {
      this.setState({ calendarEventCategories: calendarEventCategories });
    }
  };

  render() {
    const {
      calendarEventCategories,
      facebookPosts,
      twitterPosts,
      linkedinPosts,
      instagramPosts,
      websitePosts,
      newsletterPosts,
      timezone,
      clickedEvent,
      clickedEventIsRecipe,
      recipeEditing,
      clickedDate,
      campaigns,
      notification,
      calendars,
      activeCalendarIndex
    } = this.state;
    const {
      All,
      Facebook,
      Twitter,
      Linkedin,
      Instagram,
      Blog,
      Newsletter,
      Campaigns
    } = calendarEventCategories;

    let calendarEvents = [];

    if (Facebook || All)
      if (facebookPosts) calendarEvents = calendarEvents.concat(facebookPosts);
    if (Twitter || All)
      if (twitterPosts) calendarEvents = calendarEvents.concat(twitterPosts);
    if (Linkedin || All)
      if (linkedinPosts) calendarEvents = calendarEvents.concat(linkedinPosts);
    if (Instagram || All)
      if (instagramPosts)
        calendarEvents = calendarEvents.concat(instagramPosts);
    if (Blog || All)
      if (websitePosts) calendarEvents = calendarEvents.concat(websitePosts);
    if (Newsletter || All)
      if (newsletterPosts)
        calendarEvents = calendarEvents.concat(newsletterPosts);
    if (Campaigns || All)
      if (campaigns) calendarEvents = calendarEvents.concat(campaigns);
    if (!Campaigns && !All) {
      // only add the campaigns that have at least 1 post that passes the filter
      // and within that campaign, only include the qualifying posts
      for (let i = 0; i < campaigns.length; i++) {
        const campaign = { ...campaigns[i], posts: [] };
        for (let j = 0; j < campaigns[i].posts.length; j++) {
          const post = campaigns[i].posts[j];
          switch (post.socialType) {
            case "facebook":
              if (Facebook) campaign.posts.push(post);
              break;
            case "twitter":
              if (Twitter) campaign.posts.push(post);
              break;
            case "linkedin":
              if (Linkedin) campaign.posts.push(post);
              break;
            case "instagram":
              if (Instagram) campaign.posts.push(post);
              break;
            case "blog":
              if (Blog) campaign.posts.push(post);
              break;
            case "newsletter":
              if (Newsletter) campaign.posts.push(post);
              break;
          }
        }
        if (campaign.posts.length > 0) {
          calendarEvents.push(campaign);
        }
      }
    }

    return (
      <div className="content-page">
        <Calendar
          calendarEvents={calendarEvents}
          calendarDate={new moment()}
          onSelectDay={this.openModal}
          onSelectPost={this.editPost}
          onSelectCampaign={this.openCampaign}
          timezone={timezone}
          categories={calendarEventCategories}
          updateActiveCategory={this.updateActiveCategory}
        />
        {this.state.contentModal && (
          <ContentModal
            clickedCalendarDate={clickedDate}
            timezone={timezone}
            calendarID={calendars[activeCalendarIndex]._id}
            close={this.closeModals}
            savePostCallback={() => {
              this.getPosts();
              this.closeModals();
            }}
            saveBlogCallback={() => {
              this.getBlogs();
              this.closeModals();
            }}
            saveNewsletterCallback={() => {
              this.getNewsletters();
              this.closeModals();
            }}
          />
        )}
        {this.state.postEdittingModal && (
          <PostEdittingModal
            savePostCallback={() => this.getPosts()}
            clickedEvent={clickedEvent}
            timezone={timezone}
            close={this.closeModals}
          />
        )}
        {this.state.blogEdittingModal && (
          <BlogEdittingModal
            updateCalendarBlogs={this.getBlogs}
            clickedEvent={clickedEvent}
            close={this.closeModals}
          />
        )}
        {this.state.newsletterEdittingModal && (
          <NewsletterEdittingModal
            updateCalendarNewsletters={this.getNewsletters}
            clickedEvent={clickedEvent}
            close={this.closeModals}
          />
        )}
        {this.state.campaignModal && (
          <CampaignModal
            close={this.closeModals}
            handleChange={this.handleChange}
            calendarID={calendars[activeCalendarIndex]._id}
            timezone={timezone}
            clickedCalendarDate={clickedDate}
            updateCampaigns={this.getCampaigns}
            campaign={clickedEvent}
            isRecipe={clickedEventIsRecipe}
            recipeEditing={recipeEditing}
            notify={this.notify}
          />
        )}
        {this.state.recipeModal && (
          <RecipeModal
            close={this.closeModals}
            handleChange={this.handleChange}
            clickedCalendarDate={clickedDate}
          />
        )}
        {notification.show && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            callback={() =>
              this.setState({
                notification: {
                  show: false
                }
              })
            }
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // at this moment (aug 7 2018), user variable is never used so might be not be worth mapping it
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Content);
