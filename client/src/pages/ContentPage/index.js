import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";

import io from "socket.io-client";

import ContentModal from "./PostingFiles/ContentModal";
import PostEdittingModal from "./PostingFiles/PostEdittingModal";
import BlogEdittingModal from "./PostingFiles/BlogEdittingModal";
import NewsletterEdittingModal from "./PostingFiles/NewsletterEdittingModal";
import Calendar from "../../components/Calendar/";
import CalendarManager from "../../components/CalendarManager/";
import Campaign from "../../components/CampaignAndRecipe/Campaign";
import RecipeModal from "../../components/CampaignAndRecipe/RecipeModal";
import Notification from "../../components/Notifications/Notification";
import Loader from "../../components/Notifications/Loader/";
import ConfirmAlert from "../../components/Notifications/ConfirmAlert";
import CalendarChat from "../../components/CalendarChat";

class Content extends Component {
  state = {
    loading: false,
    clickedEvent: undefined,
    clickedEventIsRecipe: false,
    recipeEditing: false,

    socket: undefined,
    userList: [], // list of users connected to the same calendar socket as this user (including this user)

    calendars: [],
    calendarInvites: [],
    activeCalendarIndex: undefined,
    defaultCalendarID: undefined,
    calendarManagerModal: false,

    facebookPosts: [],
    twitterPosts: [],
    linkedinPosts: [],
    websitePosts: [],
    newsletterPosts: [],

    clickedDate: new moment(),
    calendarDate: new moment(),

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
      message: undefined,
      timer: undefined
    },
    confirmAlert: {
      show: false,
      type: undefined,
      title: undefined,
      message: undefined,
      callback: undefined
    },
    timezone: ""
  };

  componentDidMount() {
    this._ismounted = true;

    this.initSocket();

    axios.get("/api/timezone").then(res => {
      let { timezone, loggedIn } = res.data;

      if (!timezone) timezone = moment.tz.guess();
      moment.tz.setDefault(timezone);

      if (this._ismounted)
        this.setState({ timezone, calendarDate: new moment() });
    });

    axios.get("/api/calendars").then(res => {
      const { success, calendars, defaultCalendarID } = res.data;
      if (!success || !calendars || calendars.length === 0) {
        console.log(res.data.err);
        console.log(res.data.message);
        console.log(calendars);
      } else {
        let activeCalendarIndex = calendars.findIndex(
          calObj => calObj._id.toString() === defaultCalendarID.toString()
        );
        if (activeCalendarIndex === -1) activeCalendarIndex = 0;
        if (this._ismounted) {
          this.setState(
            {
              calendars,
              activeCalendarIndex,
              defaultCalendarID
            },
            () => {
              this.fillCalendar();
              this.updateSocketCalendar();
            }
          );
        }
      }
    });

    axios.get("/api/calendars/invites").then(res => {
      const { success, err, message, calendars } = res.data;
      if (!success) {
        console.log(err);
        console.log(message);
        console.log("failed to retrieve calendar invites.");
      } else {
        if (!calendars || calendars.length === 0) {
          return;
        } else {
          // calendars is an array of all calendars that have this user's email in its emailsInvited array
          this.setState({ calendarInvites: calendars });
        }
      }
    });

    window.addEventListener("beforeunload", this.notifySocketUsersOnPageClose);
  }

  componentWillUnmount() {
    const { socket } = this.state;
    this._ismounted = false;
    window.removeEventListener(
      "beforeunload",
      this.notifySocketUsersOnPageClose
    );
    socket.emit("unmounting_socket_component");
  }

  notifySocketUsersOnPageClose = () => {
    const { socket } = this.state;
    if (socket) socket.emit("unmounting_socket_component");
  };

  initSocket = () => {
    let socket;

    if (process.env.NODE_ENV === "development")
      socket = io("http://localhost:5000");
    else socket = io();

    socket.on("calendar_post_saved", post => {
      const { calendars, activeCalendarIndex } = this.state;

      post.startDate = post.postingDate;
      post.endDate = post.postingDate;

      if (
        calendars[activeCalendarIndex]._id.toString() !==
        post.calendarID.toString()
      ) {
        return;
      } else {
        let targetListName;
        if (post.socialType === "facebook") targetListName = "facebookPosts";
        else if (post.socialType === "twitter") targetListName = "twitterPosts";
        else if (post.socialType === "linkedin")
          targetListName = "linkedinPosts";
        else console.log(`unhandled post socialType: ${post.socialType}`);
        if (targetListName) {
          const index = this.state[targetListName].findIndex(
            postObj => postObj._id.toString() === post._id.toString()
          );
          if (index === -1) {
            // new post so just add it to the list
            this.setState(prevState => {
              return {
                [targetListName]: [...prevState[targetListName], post]
              };
            });
          } else {
            // post exists so we just need to update it
            this.setState(prevState => {
              return {
                [targetListName]: [
                  ...prevState[targetListName].slice(0, index),
                  post,
                  ...prevState[targetListName].slice(index + 1)
                ]
              };
            });
          }
        }
      }
    });

    socket.on("calendar_post_deleted", reqObj => {
      const { postID, socialType } = reqObj;
      if (!postID || !socialType) return;

      let targetListName;
      if (socialType === "facebook") targetListName = "facebookPosts";
      else if (socialType === "twitter") targetListName = "twitterPosts";
      else if (socialType === "linkedin") targetListName = "linkedinPosts";
      else console.log(`unhandled post socialType: ${socialType}`);

      const index = this.state[targetListName].findIndex(
        post => post._id.toString() === postID.toString()
      );
      if (index === -1) return;
      this.setState(prevState => {
        return {
          [targetListName]: [
            ...prevState[targetListName].slice(0, index),
            ...prevState[targetListName].slice(index + 1)
          ]
        };
      });
    });

    socket.on("calendar_blog_saved", blog => {
      const { calendars, activeCalendarIndex, websitePosts } = this.state;
      if (!calendars || activeCalendarIndex === undefined) return;
      const calendarID = calendars[activeCalendarIndex]._id;
      if (blog.calendarID.toString() !== calendarID.toString()) return;
      blog.startDate = blog.postingDate;
      blog.endDate = blog.postingDate;
      const index = websitePosts.findIndex(
        blogObj => blogObj._id.toString() === blog._id.toString()
      );
      if (index !== -1) {
        this.setState(prevState => {
          return {
            websitePosts: [
              ...prevState.websitePosts.slice(0, index),
              blog,
              ...prevState.websitePosts.slice(index + 1)
            ]
          };
        });
      } else {
        this.setState(prevState => {
          return { websitePosts: [...prevState.websitePosts, blog] };
        });
      }
    });

    socket.on("calendar_blog_deleted", blogID => {
      const { websitePosts } = this.state;
      const index = websitePosts.findIndex(
        blog => blog._id.toString() === blogID.toString()
      );
      if (index !== -1) {
        this.setState(prevState => {
          return {
            websitePosts: [
              ...websitePosts.slice(0, index),
              ...websitePosts.slice(index + 1)
            ]
          };
        });
      }
    });

    socket.on("calendar_newsletter_saved", newsletter => {
      const { calendars, activeCalendarIndex, newsletterPosts } = this.state;
      if (!calendars || activeCalendarIndex === undefined) return;
      const calendarID = calendars[activeCalendarIndex]._id;
      if (newsletter.calendarID.toString() !== calendarID.toString()) return;
      newsletter.startDate = newsletter.postingDate;
      newsletter.endDate = newsletter.postingDate;
      const index = newsletterPosts.findIndex(
        newsletterObj =>
          newsletterObj._id.toString() === newsletter._id.toString()
      );
      if (index !== -1) {
        this.setState(prevState => {
          return {
            newsletterPosts: [
              ...prevState.newsletterPosts.slice(0, index),
              newsletter,
              ...prevState.newsletterPosts.slice(index + 1)
            ]
          };
        });
      } else {
        this.setState(prevState => {
          return {
            newsletterPosts: [...prevState.newsletterPosts, newsletter]
          };
        });
      }
    });

    socket.on("calendar_newsletter_deleted", newsletterID => {
      const { newsletterPosts } = this.state;
      const index = newsletterPosts.findIndex(
        newsletter => newsletter._id.toString() === newsletterID.toString()
      );
      if (index !== -1) {
        this.setState(prevState => {
          return {
            newsletterPosts: [
              ...newsletterPosts.slice(0, index),
              ...newsletterPosts.slice(index + 1)
            ]
          };
        });
      }
    });

    socket.on("calendar_campaign_saved", campaign => {
      const { campaigns, calendars, activeCalendarIndex } = this.state;
      if (
        campaign.calendarID.toString() !==
        calendars[activeCalendarIndex]._id.toString()
      )
        return;
      const index = campaigns.findIndex(
        camp => camp._id.toString() === campaign._id.toString()
      );
      if (index !== -1) {
        this.setState(prevState => {
          return {
            campaigns: [
              ...prevState.campaigns.slice(0, index),
              campaign,
              ...prevState.campaigns.slice(index + 1)
            ]
          };
        });
      } else {
        this.setState(prevState => {
          return {
            campaigns: [...prevState.campaigns, campaign]
          };
        });
      }
    });

    socket.on("calendar_campaign_deleted", campaignID => {
      const { campaigns } = this.state;
      const index = campaigns.findIndex(
        campaign => campaign._id.toString() === campaignID.toString()
      );
      if (index !== -1) {
        this.setState(prevState => {
          return {
            campaigns: [
              ...prevState.campaigns.slice(0, index),
              ...prevState.campaigns.slice(index + 1)
            ]
          };
        });
      }
    });

    socket.on("campaign_post_saved", reqObj => {
      const { calendarID, campaignID } = reqObj;
      const post = reqObj.extra;
      const { campaigns, calendars, activeCalendarIndex } = this.state;

      if (
        calendarID.toString() !== calendars[activeCalendarIndex]._id.toString()
      )
        return;

      const index = campaigns.findIndex(
        campaign => campaign._id.toString() === campaignID.toString()
      );
      if (index === -1) return; // campaign doesnt exist yet for this user so can't add a post to it

      const campaign = campaigns[index];
      const postIndex = campaign.posts.findIndex(
        postObj => postObj._id.toString() === post._id.toString()
      );

      if (postIndex === -1) {
        // post doesn't exist in the campaign yet so just need to add it
        this.setState(prevState => {
          return {
            campaigns: [
              ...prevState.campaigns.slice(0, index),
              {
                ...prevState.campaigns[index],
                posts: [...prevState.campaigns[index].posts, post]
              },
              ...prevState.campaigns.slice(index + 1)
            ]
          };
        });
      } else {
        // post exists already so need to update it
        this.setState(prevState => {
          return {
            campaigns: [
              ...prevState.campaigns.slice(0, index),
              {
                ...prevState.campaigns[index],
                posts: [
                  ...prevState.campaigns[index].posts.slice(0, postIndex),
                  post,
                  ...prevState.campaigns[index].posts.slice(postIndex + 1)
                ]
              },
              ...prevState.campaigns.slice(index + 1)
            ]
          };
        });
      }
    });

    socket.on("campaign_post_deleted", reqObj => {
      const { calendarID, campaignID } = reqObj;
      const postID = reqObj.extra;

      const { campaigns, calendars, activeCalendarIndex } = this.state;

      if (
        calendarID.toString() !== calendars[activeCalendarIndex]._id.toString()
      )
        return;

      const index = campaigns.findIndex(
        campaign => campaign._id.toString() === campaignID.toString()
      );
      if (index === -1) return; // campaign doesnt exist yet for this user so can't add a post to it

      const campaign = campaigns[index];
      const postIndex = campaign.posts.findIndex(
        postObj => postObj._id.toString() === postID.toString()
      );

      if (postIndex === -1) {
        // post doesn't exist in the campaign yet so don't need to delete it
        return;
      } else {
        // post exists so just need to remove it
        this.setState(prevState => {
          return {
            campaigns: [
              ...prevState.campaigns.slice(0, index),
              {
                ...prevState.campaigns[index],
                posts: [
                  ...prevState.campaigns[index].posts.slice(0, postIndex),
                  ...prevState.campaigns[index].posts.slice(postIndex + 1)
                ]
              },
              ...prevState.campaigns.slice(index + 1)
            ]
          };
        });
      }
    });

    socket.on("campaign_modified", reqObj => {
      const { calendarID, campaignID } = reqObj;
      const campaign = reqObj.extra;

      const { campaigns, calendars, activeCalendarIndex } = this.state;

      if (
        calendarID.toString() !== calendars[activeCalendarIndex]._id.toString()
      )
        return;

      const index = campaigns.findIndex(
        campaign => campaign._id.toString() === campaignID.toString()
      );
      if (index === -1) return; // campaign doesnt exist yet for this user so can't add a post to it

      this.setState(prevState => {
        return {
          campaigns: [
            ...prevState.campaigns.slice(0, index),
            {
              ...prevState.campaigns[index],
              ...campaign,
              posts: prevState.campaigns[index].posts
            },
            ...prevState.campaigns.slice(index + 1)
          ]
        };
      });
    });

    socket.on("socket_user_list", reqObj => {
      const { roomID, userList } = reqObj;
      const { calendars, activeCalendarIndex } = this.state;

      if (roomID.toString() !== calendars[activeCalendarIndex]._id.toString())
        return;

      this.setState({ userList });
    });

    this.setState({ socket });
  };

  updateSocketCalendar = () => {
    const { calendars, activeCalendarIndex, socket } = this.state;
    if (!calendars || activeCalendarIndex === undefined || !socket) return;
    socket.emit("calendar_connect", {
      calendarID: calendars[activeCalendarIndex]._id,
      email: this.props.user.email,
      name: this.props.user.fullName
    });
  };

  inviteResponse = (index, response) => {
    // function that gets called when the user clicks Accept or Reject on one of their calendar invites
    // repsonse is whether they clicked accept or reject (true or false)
    // index is the index of the calendar in calendarInvites
    const { calendarInvites } = this.state;
    const calendarID = calendarInvites[index]._id;

    this.setState(prevState => {
      return {
        calendarInvites: [
          ...prevState.calendarInvites.slice(0, index),
          ...prevState.calendarInvites.slice(index + 1)
        ]
      };
    });

    axios
      .post("/api/calendars/invites/response", {
        calendarID,
        response
      })
      .then(res => {
        const { success, err, message, calendar } = res.data;
        if (!success) {
          console.log(err);
          console.log(message);
        } else {
          if (response === true) {
            this.setState(prevState => {
              return {
                calendars: [...prevState.calendars, calendar]
              };
            });
          }
        }
      });
  };

  getCalendars = () => {
    axios.get("/api/calendars").then(res => {
      const { success, calendars } = res.data;
      if (!success || !calendars || calendars.length === 0) {
        console.log(res.data.err);
        console.log(res.data.message);
        console.log(calendars);
      } else {
        if (calendars.length - 1 < this.state.activeCalendarIndex) {
          this.setState(
            { activeCalendarIndex: calendars.length - 1, calendars },
            this.fillCalendar
          );
        } else {
          this.setState({ calendars }, this.fillCalendar);
        }
      }
    });
  };

  fillCalendar = () => {
    this.getPosts();
    this.getBlogs();
    this.getNewsletters();
    this.getCampaigns();
  };

  notify = (type, title, message, length = 5000) => {
    // maybe this function's length should be dynamically determined based on
    // the length of the message
    // (long message = longer length so there is more time to read it)
    const { notification } = this.state;

    const timer = setTimeout(() => {
      this.setState({
        notification: {
          show: false
        }
      });
    }, length);

    if (notification.show) {
      // notification is currently active so we need to clear the previous timeout
      // so this new notification doesn't get disabled when the previous one times out
      clearTimeout(notification.timer);
    }

    this.setState({
      notification: {
        show: true,
        type,
        title,
        message,
        timer
      }
    });
  };

  getPosts = () => {
    // if this (or any of the getPosts/getBlogs/getCampaigns/etc fails,
    // we should maybe setState({ posts: [] })) so that we don't render
    // posts from a previous calendar
    const { calendars, activeCalendarIndex, calendarDate } = this.state;

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
    axios
      .post("/api/calendar/posts/" + calendarID, { calendarDate })
      .then(res => {
        const { success, err, message, posts, loggedIn } = res.data;
        if (!success) {
          console.log(message);
          console.log(err);
        } else {
          if (loggedIn === false) this.props.history.push("/sign-in");

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
              facebookPosts,
              twitterPosts,
              linkedinPosts,
              loading: false
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
        if (loggedIn === false) this.props.history.push("/sign-in");

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
        if (loggedIn === false) this.props.history.push("/sign-in");

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
        if (loggedIn === false) this.props.history.push("/sign-in");

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
    console.log(post);
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
      calendarManagerModal: false,
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

  updateActiveCalendar = index => {
    this.setState({ activeCalendarIndex: index }, () => {
      this.fillCalendar();
      this.updateSocketCalendar();
    });
  };

  triggerSocketPeers = (type, extra, campaignID) => {
    const { calendars, activeCalendarIndex, socket } = this.state;
    if (
      calendars &&
      activeCalendarIndex !== undefined &&
      calendars[activeCalendarIndex]
    ) {
      socket.emit("trigger_socket_peers", {
        calendarID: calendars[activeCalendarIndex]._id,
        campaignID,
        type,
        extra
      });
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
      calendarInvites,
      activeCalendarIndex,
      defaultCalendarID,
      calendarDate,
      loading,
      confirmAlert,
      userList
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
        {loading && <Loader />}
        <Calendar
          calendars={calendars}
          calendarInvites={calendarInvites}
          inviteResponse={this.inviteResponse}
          activeCalendarIndex={activeCalendarIndex}
          updateActiveCalendar={this.updateActiveCalendar}
          enableCalendarManager={() => {
            this.setState({ calendarManagerModal: true });
          }}
          userList={userList}
          calendarEvents={calendarEvents}
          onDateChange={date => {
            this.handleChange(date, "calendarDate");
            this.getPosts();
          }}
          calendarDate={calendarDate}
          onSelectDay={this.openModal}
          onSelectPost={this.editPost}
          onSelectCampaign={this.openCampaign}
          timezone={timezone}
          categories={calendarEventCategories}
          updateActiveCategory={this.updateActiveCategory}
        />
        <CalendarChat calendars={calendars} />
        {this.state.calendarManagerModal && (
          <div
            className="modal"
            onClick={() => {
              this.closeModals();
              this.getCalendars();
            }}
          >
            <div
              className="large-modal common-transition"
              onClick={e => e.stopPropagation()}
            >
              <CalendarManager
                calendars={calendars}
                activeCalendarIndex={activeCalendarIndex}
                defaultCalendarID={defaultCalendarID}
                close={() => {
                  this.closeModals();
                  this.getCalendars();
                }}
                notify={this.notify}
              />
            </div>
          </div>
        )}
        {this.state.contentModal && (
          <ContentModal
            clickedCalendarDate={clickedDate}
            timezone={timezone}
            calendarID={calendars[activeCalendarIndex]._id}
            close={this.closeModals}
            notify={this.notify}
            savePostCallback={post => {
              this.getPosts();
              this.triggerSocketPeers("calendar_post_saved", post);
              this.closeModals();
            }}
            saveBlogCallback={blog => {
              this.getBlogs();
              this.triggerSocketPeers("calendar_blog_saved", blog);
              this.closeModals();
            }}
            saveNewsletterCallback={newsletter => {
              this.getNewsletters();
              this.triggerSocketPeers("calendar_newsletter_saved", newsletter);
              this.closeModals();
            }}
          />
        )}
        {this.state.postEdittingModal && (
          <PostEdittingModal
            savePostCallback={post => {
              this.getPosts();
              this.triggerSocketPeers("calendar_post_saved", post);
            }}
            updateCalendarPosts={this.getPosts}
            clickedEvent={clickedEvent}
            timezone={timezone}
            close={this.closeModals}
            notify={this.notify}
            triggerSocketPeers={this.triggerSocketPeers}
            calendarID={calendars[activeCalendarIndex]._id}
          />
        )}
        {this.state.blogEdittingModal && (
          <BlogEdittingModal
            saveBlogCallback={blog => {
              this.getBlogs();
              this.triggerSocketPeers("calendar_blog_saved", blog);
            }}
            updateCalendarBlogs={this.getBlogs}
            clickedEvent={clickedEvent}
            close={this.closeModals}
            triggerSocketPeers={this.triggerSocketPeers}
          />
        )}
        {this.state.newsletterEdittingModal && (
          <NewsletterEdittingModal
            saveNewsletterCallback={newsletter => {
              this.getNewsletters();
              this.triggerSocketPeers("calendar_newsletter_saved", newsletter);
            }}
            updateCalendarNewsletters={this.getNewsletters}
            clickedEvent={clickedEvent}
            close={this.closeModals}
            triggerSocketPeers={this.triggerSocketPeers}
          />
        )}
        {this.state.campaignModal && (
          <div className="modal">
            <div
              className="large-modal common-transition"
              onClick={e => e.stopPropagation()}
            >
              <Campaign
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
                confirmAlert={confirmAlert}
                triggerSocketPeers={this.triggerSocketPeers}
              />
            </div>
          </div>
        )}
        {this.state.recipeModal && (
          <RecipeModal
            close={this.closeModals}
            handleChange={this.handleChange}
            clickedCalendarDate={clickedDate}
            calendarID={calendars[activeCalendarIndex]._id}
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
        {confirmAlert.show && (
          <ConfirmAlert
            close={() => {
              let { confirmAlert } = this.state;
              confirmAlert.show = false;
              this.setState({ confirmAlert });
            }}
            title={confirmAlert.title}
            message={confirmAlert.message}
            callback={confirmAlert.callback}
            type={confirmAlert.type}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Content);
