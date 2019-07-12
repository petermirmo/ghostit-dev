import React, { Component } from "react";

import axios from "axios";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-light-svg-icons";

import { connect } from "react-redux";

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
import Dropdown from "../../components/views/Dropdown";

import Consumer from "../../context";

import {
  getCalendars,
  getCalendarInvites,
  triggerSocketPeers,
  initSocket,
  getCampaigns
} from "../util";

import { addMonth, getCalendarEvents, getPosts, subtractMonth } from "./util";

class Content extends Component {
  state = {
    activeCalendarIndex: undefined,

    calendars: [],
    calendarInvites: [],
    clickedDate: new moment(),
    calendarDate: new moment(),
    clickedEvent: undefined,
    clickedEventIsRecipe: false,

    defaultCalendarID: undefined,

    customPosts: [],
    facebookPosts: [],
    linkedinPosts: [],
    twitterPosts: [],

    calendarManagerModal: false,
    campaignModal: false,
    contentModal: false,
    dashboardModal: false,

    calendarEventCategories: {
      All: true,
      Campaigns: false,
      Custom: false,
      Facebook: false,
      Linkedin: false,
      Twitter: false
    },

    loading: false,
    postEdittingModal: false,

    recipeEditing: false,
    socket: undefined,

    templatesModal: false,

    userList: [] // list of users connected to the same calendar socket as this user (including this user)
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
    this.handleChange(getPosts(calendars, activeCalendarIndex, calendarDate));
    getCampaigns(calendars, activeCalendarIndex, this.handleChange);
  };

  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
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

  updateActiveCategory = key => {
    let { calendarEventCategories } = this.state;
    calendarEventCategories[key] = !calendarEventCategories[key];

    calendarEventCategories["All"] = false;

    if (key === "All") {
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
      userList
    } = this.state;

    const calendarEvents = getCalendarEvents(
      calendarEventCategories,
      campaigns,
      customPosts,
      facebookPosts,
      instagramPosts,
      linkedinPosts,
      twitterPosts
    );

    return (
      <Consumer>
        {context => (
          <Page className="content-page" title="Calendar">
            {loading && <Loader />}

            <GIContainer className="column vc x-fill">
              <GIContainer className="x-fill">
                <Dropdown
                  activeItem={activeCalendarIndex}
                  className="x-fill common-shadow-medium"
                  dropdownItems={calendars.map(
                    (calendar, index) => calendar.calendarName
                  )}
                  handleParentChange={dropdownClickedItemObj =>
                    this.updateActiveCalendar(dropdownClickedItemObj.index)
                  }
                  search
                  size="2x"
                  title={
                    <GIText
                      className="muli fill-flex pl32 py16"
                      text={
                        calendars[activeCalendarIndex]
                          ? calendars[activeCalendarIndex].calendarName
                          : ""
                      }
                      type="h4"
                    />
                  }
                />
              </GIContainer>

              {calendarInvites.map((calendar, index) => {
                return (
                  <GIContainer className="" key={`invite ${index}`}>
                    {`You have been invited to ${calendar.calendarName}.`}
                    <GIButton
                      className="calendar-invite-accept"
                      onClick={e => {
                        e.preventDefault();
                        inviteResponse(index, true);
                      }}
                      text="Accept"
                    />
                    <GIButton
                      className="calendar-invite-reject"
                      onClick={e => {
                        e.preventDefault();
                        inviteResponse(index, false);
                      }}
                      text="Reject"
                    />
                  </GIContainer>
                );
              })}
            </GIContainer>
            <GIContainer className="column px32">
              <GIContainer className="justify-between x-fill my16">
                <GIContainer className="full-center">
                  <GIContainer
                    className="round-icon button round common-border five-blue full-center pa4"
                    onClick={() =>
                      subtractMonth(calendarDate, date => {
                        this.handleChange({ calendarDate: date });
                        this.handleChange(
                          getPosts(calendars, activeCalendarIndex, calendarDate)
                        );
                      })
                    }
                  >
                    <FontAwesomeIcon
                      className="five-blue"
                      icon={faAngleLeft}
                      size="2x"
                    />
                  </GIContainer>
                  <GIText
                    className="tac muli mx64"
                    text={calendarDate.format("MMMM YYYY")}
                    type="h3"
                  />

                  <GIContainer
                    className="round-icon button round common-border five-blue full-center pa4"
                    onClick={() =>
                      addMonth(calendarDate, date => {
                        this.handleChange({ calendarDate: date });
                        this.handleChange(
                          getPosts(calendars, activeCalendarIndex, calendarDate)
                        );
                      })
                    }
                  >
                    <FontAwesomeIcon
                      className="five-blue"
                      icon={faAngleRight}
                      size="2x"
                    />
                  </GIContainer>
                </GIContainer>
                <GIContainer className="full-center">
                  <Dropdown
                    className="x-fill common-border common-shadow-light br4"
                    dropdownItems={Object.keys(calendarEventCategories).map(
                      (key, index) => key
                    )}
                    handleParentChange={dropdownClickedItemObj =>
                      this.updateActiveCategory(dropdownClickedItemObj.item)
                    }
                    search
                    size="2x"
                    title={
                      <GIText
                        className="tac muli fill-flex pl32 pr48 py16"
                        text="Filter Calendar"
                        type="h6"
                      />
                    }
                  />
                </GIContainer>
              </GIContainer>
              <Calendar
                activeCalendarIndex={activeCalendarIndex}
                calendars={calendars}
                calendarDate={calendarDate}
                calendarEvents={calendarEvents}
                calendarInvites={calendarInvites}
                enableCalendarManager={() =>
                  this.setState({ calendarManagerModal: true })
                }
                inviteResponse={this.inviteResponse}
                onSelectCampaign={this.openCampaign}
                onSelectDay={date =>
                  this.handleChange({ clickedDate: date, dashboardModal: true })
                }
                onSelectPost={clickedEvent =>
                  this.handleChange({ postEdittingModal: true, clickedEvent })
                }
                updateActiveCalendar={this.updateActiveCalendar}
                userList={userList}
              />
            </GIContainer>
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
                  this.handleChange(
                    getPosts(calendars, activeCalendarIndex, calendarDate)
                  );
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
                  this.handleChange(
                    getPosts(calendars, activeCalendarIndex, calendarDate)
                  );
                  triggerSocketPeers(
                    "calendar_post_saved",
                    post,
                    calendars,
                    activeCalendarIndex,
                    socket
                  );
                }}
                updateCalendarPosts={() =>
                  this.handleChange(
                    getPosts(calendars, activeCalendarIndex, calendarDate)
                  )
                }
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
