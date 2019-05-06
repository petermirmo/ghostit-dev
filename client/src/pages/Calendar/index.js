import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  openContentModal,
  openCalendarManagerModal
} from "../../redux/actions";

import ContentModal from "../../components/postingFiles/ContentModal";
import PostEdittingModal from "../../components/postingFiles/PostEditingModal";
import Calendar from "../../components/Calendar";
import CalendarManager from "../../components/CalendarManager";
import Campaign from "../../components/postingFiles/CampaignAndRecipe/Campaign";
import Dashboard from "../../components/Dashboard";
import TemplatesModal from "../../components/postingFiles/TemplatesModal";
import Loader from "../../components/notifications/Loader";
import CalendarChat from "../../components/CalendarChat";
import Page from "../../components/containers/Page";
import Modal from "../../components/containers/Modal";

import GIText from "../../components/views/GIText";
import GIContainer from "../../components/containers/GIContainer";

import Consumer from "../../context";

import {
  getCalendars,
  getCalendarInvites,
  triggerSocketPeers,
  initSocket,
  getCampaigns
} from "../util";

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

    facebookPosts: [],
    twitterPosts: [],
    linkedinPosts: [],
    customPosts: [],

    clickedDate: new moment(),
    calendarDate: new moment(),

    calendarManagerModal: false,
    campaignModal: false,
    contentModal: false,
    dashboardModal: false,
    postEdittingModal: false,
    templatesModal: false,

    calendarEventCategories: {
      All: true,
      Facebook: false,
      Twitter: false,
      Linkedin: false,
      Campaigns: false,
      Custom: false
    }
  };

  componentDidMount() {
    this._ismounted = true;

    getCalendars(stateObject => {
      if (this._ismounted) this.setState(stateObject);
      this.fillCalendar();

      const {
        calendars,
        activeCalendarIndex,
        campaigns,
        facebookPosts,
        twitterPosts,
        linkedinPosts,
        customPosts
      } = this.state;

      initSocket(
        stateObject => this.handleChange(stateObject),
        calendars,
        activeCalendarIndex,
        campaigns,
        facebookPosts,
        twitterPosts,
        linkedinPosts,
        customPosts,
        this.updateSocketCalendar
      );
    });

    getCalendarInvites(stateObject => {
      if (this._ismounted) this.setState(stateObject);
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
    if (socket) socket.emit("unmounting_socket_component");
  }

  notifySocketUsersOnPageClose = () => {
    const { socket } = this.state;
    if (socket) socket.emit("unmounting_socket_component");
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
        calendars.sort((a, b) => {
          if (a.calendarName > b.calendarName) return 1;
          else return -1;
        });

        if (calendars.length - 1 < this.state.activeCalendarIndex) {
          moment.tz.setDefault(calendars[calendars.length - 1].timezone);
          this.setState(
            {
              activeCalendarIndex: calendars.length - 1,
              calendars,
              calendarDate: new moment()
            },
            this.fillCalendar
          );
        } else {
          this.setState(
            {
              calendars
            },
            this.fillCalendar
          );
        }
      }
    });
  };

  fillCalendar = () => {
    const { calendars, activeCalendarIndex } = this.state;
    this.getPosts();
    getCampaigns(calendars, activeCalendarIndex, this.handleChange);
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
    let customPosts = [];

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
            } else if (posts[index].socialType === "custom") {
              customPosts.push(posts[index]);
            }
          }
          if (this._ismounted) {
            this.setState({
              facebookPosts,
              twitterPosts,
              linkedinPosts,
              customPosts,
              loading: false
            });
          }
        }
      });
  };

  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  editPost = post => {
    // Open editting modal
    if (
      post.socialType === "facebook" ||
      post.socialType === "twitter" ||
      post.socialType === "linkedin" ||
      post.socialType === "custom"
    ) {
      this.setState({ postEdittingModal: true, clickedEvent: post });
    }
  };

  openCampaign = campaign => {
    this.setState({
      clickedEvent: campaign,
      clickedEventIsRecipe: false,
      recipeEditing: false,
      campaignModal: true
    });
  };

  closeModals = () => {
    this.setState({
      postEdittingModal: false,
      templatesModal: false,
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
          Campaigns: false,
          Custom: false
        }
      });
    } else {
      this.setState({ calendarEventCategories });
    }
  };

  updateActiveCalendar = index => {
    const { calendarDate, calendars } = this.state;
    if (calendars)
      if (calendars[index]) moment.tz.setDefault(calendars[index].timezone);

    this.setState(
      {
        activeCalendarIndex: index,
        calendarDate: new moment(calendarDate)
      },
      () => {
        this.fillCalendar();
        this.updateSocketCalendar();
      }
    );
  };

  render() {
    const {
      activeCalendarIndex,
      calendarDate,
      calendarInvites,
      calendarManagerModal,
      calendars,
      campaignModal,
      campaigns,
      clickedDate,
      calendarEventCategories,
      clickedEvent,
      clickedEventIsRecipe,
      contentModal,
      customPosts,
      dashboardModal,
      defaultCalendarID,
      facebookPosts,
      instagramPosts,
      linkedinPosts,
      loading,
      postEdittingModal,
      recipeEditing,
      socket,
      templatesModal,
      twitterPosts,
      userList,
      websitePosts
    } = this.state;
    const {
      All,
      Campaigns,
      Custom,
      Facebook,
      Instagram,
      Linkedin,
      Twitter
    } = calendarEventCategories;

    let calendarEvents = [];

    if (Custom || All)
      if (customPosts) calendarEvents = calendarEvents.concat(customPosts);
    if (Facebook || All)
      if (facebookPosts) calendarEvents = calendarEvents.concat(facebookPosts);
    if (Twitter || All)
      if (twitterPosts) calendarEvents = calendarEvents.concat(twitterPosts);
    if (Linkedin || All)
      if (linkedinPosts) calendarEvents = calendarEvents.concat(linkedinPosts);
    if (Instagram || All)
      if (instagramPosts)
        calendarEvents = calendarEvents.concat(instagramPosts);

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
          }
        }
        if (campaign.posts.length > 0) {
          calendarEvents.push(campaign);
        }
      }
    }
    return (
      <Consumer>
        {context => (
          <Page title="Calendar" className="content-page">
            {loading && <Loader />}
            <Calendar
              activeCalendarIndex={activeCalendarIndex}
              calendars={calendars}
              calendarDate={calendarDate}
              calendarEvents={calendarEvents}
              calendarInvites={calendarInvites}
              categories={calendarEventCategories}
              enableCalendarManager={() =>
                this.setState({ calendarManagerModal: true })
              }
              inviteResponse={this.inviteResponse}
              onDateChange={date => {
                this.handleChange({ calendarDate: date });
                this.getPosts();
              }}
              onSelectCampaign={this.openCampaign}
              onSelectDay={date =>
                this.handleChange({ clickedDate: date, dashboardModal: true })
              }
              onSelectPost={this.editPost}
              updateActiveCalendar={this.updateActiveCalendar}
              updateActiveCategory={this.updateActiveCategory}
              userList={userList}
            />
            {false && <CalendarChat calendars={calendars} />}
            {calendarManagerModal && (
              <Modal
                body={
                  <CalendarManager
                    calendars={calendars}
                    activeCalendarIndex={activeCalendarIndex}
                    defaultCalendarID={defaultCalendarID}
                    close={() => {
                      this.setState({ calendarManagerModal: false });
                      this.getCalendars();
                    }}
                  />
                }
                close={() => {
                  this.setState({ calendarManagerModal: false });
                  this.getCalendars();
                }}
              />
            )}
            {contentModal && calendars[activeCalendarIndex] && (
              <ContentModal
                calendarID={calendars[activeCalendarIndex]._id}
                clickedCalendarDate={clickedDate}
                handleParentChange={this.handleChange}
                notify={context.notify}
                savePostCallback={post => {
                  this.getPosts();
                  triggerSocketPeers(
                    "calendar_post_saved",
                    post,
                    calendars,
                    activeCalendarIndex,
                    socket
                  );
                  this.setState({ contentModal: false });
                }}
              />
            )}
            {postEdittingModal && (
              <PostEdittingModal
                savePostCallback={post => {
                  this.getPosts();
                  triggerSocketPeers(
                    "calendar_post_saved",
                    post,
                    calendars,
                    activeCalendarIndex,
                    socket
                  );
                }}
                updateCalendarPosts={this.getPosts}
                clickedEvent={clickedEvent}
                close={this.closeModals}
                triggerSocketPeers={(type, post) =>
                  triggerSocketPeers(
                    type,
                    post,
                    calendars,
                    activeCalendarIndex,
                    socket
                  )
                }
                calendarID={calendars[activeCalendarIndex]._id}
              />
            )}

            {campaignModal && calendars[activeCalendarIndex] && (
              <Modal
                body={
                  <Campaign
                    calendarID={calendars[activeCalendarIndex]._id}
                    campaign={clickedEvent}
                    clickedCalendarDate={clickedDate}
                    handleParentChange={this.handleChange}
                    isRecipe={clickedEventIsRecipe}
                    recipeEditing={recipeEditing}
                    triggerSocketPeers={(type, extra, campaignID) =>
                      triggerSocketPeers(
                        type,
                        extra,
                        calendars,
                        activeCalendarIndex,
                        socket,
                        campaignID
                      )
                    }
                    updateCampaigns={() =>
                      getCampaigns(
                        calendars,
                        activeCalendarIndex,
                        this.handleChange
                      )
                    }
                  />
                }
                className="large-modal"
                close={() => this.setState({ campaignModal: false })}
              />
            )}
            {templatesModal && calendars[activeCalendarIndex] && (
              <TemplatesModal
                handleParentChange={this.handleChange}
                clickedCalendarDate={clickedDate}
                calendarID={calendars[activeCalendarIndex]._id}
              />
            )}
            {dashboardModal && calendars[activeCalendarIndex] && (
              <Modal
                body={
                  <GIContainer className="x-fill py16">
                    <Dashboard
                      className="justify-center"
                      handleParentChange={stateObject => {
                        stateObject.dashboardModal = false;
                        this.handleChange(stateObject);
                      }}
                    />
                  </GIContainer>
                }
                className="large-modal"
                close={() => this.setState({ dashboardModal: false })}
                header={
                  <GIContainer className="border-bottom full-center x-fill py8">
                    <GIText text="Schedule Task" type="h3" />
                  </GIContainer>
                }
              />
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Content);
