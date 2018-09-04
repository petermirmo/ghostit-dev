import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";

import ContentModal from "./PostingFiles/ContentModal";
import PostEdittingModal from "./PostingFiles/PostEdittingModal";
import BlogEdittingModal from "./PostingFiles/BlogEdittingModal";
import NewsletterEdittingModal from "./PostingFiles/NewsletterEdittingModal";
import NavigationBar from "../../components/Navigations/NavigationBar/";
import Calendar from "../../components/Calendar/";
import OptionModal from "../../components/OptionModal";
import CampaignModal from "../../components/CampaignAndRecipe/CampaignModal";
import RecipeModal from "../../components/CampaignAndRecipe/RecipeModal";

class Content extends Component {
  state = {
    clickedEvent: undefined,

    facebookPosts: [],
    twitterPosts: [],
    linkedinPosts: [],
    websitePosts: [],
    newsletterPosts: [],

    clickedDate: new moment(),

    blogEdittingModal: false,
    contentModal: false, // modal after selecting post from the optionModal
    postEdittingModal: false,
    newsletterEdittingModal: false,
    optionModal: false, // modal to pick between campaign or post
    campaignModal: false,
    recipeModal: false,

    calendarEventCategories: {
      All: true,
      Facebook: false,
      Twitter: false,
      Linkedin: false,
      Blog: false
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

    this.getPosts();
    this.getBlogs();
    this.getNewsletters();
    this.getCampaigns();
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  getPosts = () => {
    let facebookPosts = [];
    let twitterPosts = [];
    let linkedinPosts = [];

    // Get all of user's posts to display in calendar
    axios.get("/api/posts").then(res => {
      // Set posts to state
      let { posts, loggedIn } = res.data;
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
    });
  };

  getBlogs = () => {
    axios.get("/api/blogs").then(res => {
      let { blogs, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      for (let index in blogs) {
        blogs[index].startDate = blogs[index].postingDate;
        blogs[index].endDate = blogs[index].postingDate;
      }

      if (this._ismounted) {
        this.setState({ websitePosts: blogs });
      }
    });
  };

  getNewsletters = () => {
    axios.get("/api/newsletters").then(res => {
      let { newsletters, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      for (let index in newsletters) {
        newsletters[index].startDate = newsletters[index].postingDate;
        newsletters[index].endDate = newsletters[index].postingDate;
      }

      if (this._ismounted) {
        this.setState({ newsletterPosts: newsletters });
      }
    });
  };

  getCampaigns = () => {
    axios.get("/api/campaigns").then(res => {
      let { campaignArray, loggedIn } = res.data;
      if (loggedIn === false) window.location.reload();

      for (let index in campaignArray) {
        campaignArray[index].campaign.posts = campaignArray[index].posts;
        campaignArray[index] = campaignArray[index].campaign;
      }

      if (this._ismounted) {
        this.setState({ campaigns: campaignArray });
      }
    });
  };

  openModal = date => {
    // Date for post is set to date clicked on calendar
    // Time for post is set to current time
    this.setState({ clickedDate: date, optionModal: true });
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
    } else {
      this.setState({ postEdittingModal: true, clickedEvent: post });
    }
  };

  openCampaign = campaign => {
    this.setState({ campaignModal: true, clickedEvent: campaign });
  };

  closeModals = () => {
    this.setState({
      blogEdittingModal: false,
      contentModal: false,
      postEdittingModal: false,
      newsletterEdittingModal: false,
      optionModal: false,
      campaignModal: false,
      recipeModal: false,
      recipeEditorModal: false,
      clickedEvent: undefined
    });
  };
  updateTabState = event => {
    // Category name is stored in html element id
    let categoryName = event.target.id;
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
          Blog: false
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
      clickedDate,
      campaigns,
      recipe
    } = this.state;
    const {
      All,
      Facebook,
      Twitter,
      Linkedin,
      Instagram,
      Blog,
      Newsletter
    } = calendarEventCategories;

    let calendarEvents = [];

    if (Facebook || All) {
      for (let index in facebookPosts) {
        calendarEvents.push(facebookPosts[index]);
      }
    }
    if (Twitter || All) {
      for (let index in twitterPosts) {
        calendarEvents.push(twitterPosts[index]);
      }
    }
    if (Linkedin || All) {
      for (let index in linkedinPosts) {
        calendarEvents.push(linkedinPosts[index]);
      }
    }
    if (Instagram || All) {
      for (let index in instagramPosts) {
        calendarEvents.push(instagramPosts[index]);
      }
    }
    if (Blog || All) {
      for (let index in websitePosts) {
        calendarEvents.push(websitePosts[index]);
      }
    }
    if (Newsletter || All) {
      for (let index in newsletterPosts) {
        calendarEvents.push(newsletterPosts[index]);
      }
    }
    for (let index in campaigns) {
      calendarEvents.push(campaigns[index]);
    }

    return (
      <div className="wrapper" style={this.props.margin}>
        <NavigationBar
          categories={calendarEventCategories}
          updateParentState={this.updateTabState}
        />
        <Calendar
          calendarEvents={calendarEvents}
          calendarDate={new moment()}
          onSelectDay={this.openModal}
          onSelectPost={this.editPost}
          onSelectCampaign={this.openCampaign}
          timezone={timezone}
        />
        {this.state.contentModal && (
          <ContentModal
            clickedCalendarDate={clickedDate}
            timezone={timezone}
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
        {this.state.optionModal && (
          <OptionModal handleChange={this.handleChange} />
        )}
        {this.state.campaignModal && (
          <CampaignModal
            close={this.closeModals}
            handleChange={this.handleChange}
            timezone={timezone}
            clickedCalendarDate={clickedDate}
            updateCampaigns={this.getCampaigns}
            campaign={clickedEvent}
            recipe={recipe}
          />
        )}
        {this.state.recipeModal && (
          <RecipeModal
            close={this.closeModals}
            handleChange={this.handleChange}
            clickedCalendarDate={clickedDate}
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
