import React, { Component } from "react";

import axios from "axios";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/pro-light-svg-icons/faAngleLeft";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";

import Consumer, { ExtraContext } from "../../context";

import PostCreation from "../../components/postingFiles/PostCreation";
import PostEdittingModal from "../../components/postingFiles/PostEditingModal";
import Calendar from "../../components/Calendar";
import QueuePreview from "../../components/QueuePreview";
import Campaign from "../../components/postingFiles/CampaignAndRecipe/Campaign";
import Dashboard from "../../components/Dashboard";
import TemplatesModal from "../../components/postingFiles/TemplatesModal";
import Loader from "../../components/notifications/Loader";
import CalendarChat from "../../components/CalendarChat";
import Page from "../../components/containers/Page";
import Modal from "../../components/containers/Modal";
import Modal0 from "../../components/containers/Modal0";
import ConfirmAlert from "../../components/notifications/ConfirmAlert";

import Dropdown from "../../components/views/Dropdown";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
import GIText from "../../components/views/GIText";
import GIContainer from "../../components/containers/GIContainer";

import CalendarSideBar from "./SideBar";

import { isAdmin } from "../../util";

import {
  getCalendarInvites,
  triggerSocketPeers,
  initSocket,
  getCampaigns
} from "../util";

import { validateEmail } from "../../componentFunctions";

import {
  addMonth,
  getActiveCategoriesInArray,
  getCalendarAccounts,
  getCalendarEvents,
  getCalendarUsers,
  getPosts,
  subtractMonth,
  updateActiveCategory
} from "./util";

class CalendarPage extends Component {
  state = {
    calendarInvites: [],
    clickedDate: new moment(),
    calendarDate: new moment(),
    calendarEditing: false,
    calendarName: "",
    clickedEvent: undefined,
    clickedEventIsRecipe: false,
    inviteUserActivated: false,
    inviteUserEmail: "",

    customPosts: [],
    facebookPosts: [],
    linkedinPosts: [],
    twitterPosts: [],

    campaignModal: false,
    contentModal: false,
    dashboardModal: false,
    postEdittingModal: false,
    templatesModal: false,

    calendarEventCategories: {
      All: true,
      Campaigns: false,
      Custom: false,
      Facebook: false,
      Linkedin: false,
      Twitter: false
    },

    loading: false,

    queuePreview: false,
    recipeEditing: false,
    removeUserObj: undefined,
    socket: undefined,

    userList: [] // list of users connected to the same calendar socket as this user (including this user)
  };

  componentDidMount() {
    this._ismounted = true;

    const { activeCalendarIndex, calendars } = this.context;
    const { campaigns } = this.state;

    getCalendarInvites(stateObject => {
      this.handleChange(stateObject);
    });
    this.fillCalendar();

    initSocket(
      stateObject => this.handleChange(stateObject),
      calendars,
      activeCalendarIndex,
      campaigns,
      this.getPostArrays,
      this.updateSocketCalendar
    );

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
  getPostArrays = () => {
    const {
      facebookPosts,
      twitterPosts,
      linkedinPosts,
      customPosts
    } = this.state;
    return {
      facebookPosts,
      twitterPosts,
      linkedinPosts,
      customPosts
    };
  };

  notifySocketUsersOnPageClose = () => {
    const { socket } = this.state;
    if (socket) socket.emit("unmounting_socket_component");
  };

  updateSocketCalendar = socket => {
    const { activeCalendarIndex, calendars, user } = this.context;

    if (!calendars || activeCalendarIndex === undefined || !socket) return;
    socket.emit("calendar_connect", {
      calendarID: calendars[activeCalendarIndex]._id,
      email: user.email,
      name: user.fullName
    });
  };

  inviteResponse = (context, index, response) => {
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
            context.handleChange(prevState => {
              return {
                calendars: [...prevState.calendars, calendar]
              };
            });
          }
        }
      });
  };

  fillCalendar = () => {
    const { activeCalendarIndex, calendars } = this.context;
    const { calendarDate } = this.state;

    getPosts(calendars, activeCalendarIndex, calendarDate, this.handleChange);
    getCampaigns(calendars, activeCalendarIndex, this.handleChange);
  };

  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject);
    if (callback) callback();
  };

  updateActiveCalendar = index => {
    const { calendarDate, socket } = this.state;
    const { calendars } = this.context;
    if (calendars)
      if (calendars[index]) moment.tz.setDefault(calendars[index].timezone);
    this.context.handleChange(
      { activeCalendarIndex: index },
      this.setState(
        {
          calendarDate: new moment(calendarDate),
          calendarEditing: false
        },
        () => {
          this.fillCalendar();
          this.updateSocketCalendar(socket);
          if (!calendars[index].accounts)
            getCalendarAccounts(
              this.context.activeCalendarIndex,
              this.context.calendars,
              this.context.handleCalendarChange
            );
          if (!calendars[index].users)
            getCalendarUsers(
              this.context.activeCalendarIndex,
              this.context.calendars,
              this.context.handleCalendarChange
            );
        }
      )
    );
  };

  render() {
    const {
      calendarDate,
      calendarEditing,
      calendarInvites,
      calendarName,
      campaignModal,
      campaigns,
      clickedDate,
      calendarEventCategories,
      clickedEvent,
      clickedEventIsRecipe,
      contentModal,
      customPosts,
      dashboardModal,
      facebookPosts,
      instagramPosts,
      inviteUserActivated,
      inviteUserEmail,
      linkedinPosts,
      loading,
      postEdittingModal,
      queuePreview,
      recipeEditing,
      socket,
      templatesModal,
      twitterPosts,
      userList
    } = this.state;
    const { activeCalendarIndex, calendars, defaultCalendarID } = this.context;

    const calendarEvents = getCalendarEvents(
      calendarEventCategories,
      campaigns,
      customPosts,
      facebookPosts,
      instagramPosts,
      linkedinPosts,
      twitterPosts
    );

    const modalsOpen =
      campaignModal ||
      contentModal ||
      dashboardModal ||
      postEdittingModal ||
      templatesModal;

    return (
      <Consumer>
        {context => (
          <Page className="relative" title="Calendar">
            {loading && <Loader />}
            {!modalsOpen && (
              <GIContainer className="fill-parent">
                <GIContainer className="column bg-light-grey flex-fill">
                  {calendarInvites &&
                    calendarInvites.length > 0 &&
                    calendarInvites.map((obj, index) =>
                      calendarInvites.map((calendar, index) => {
                        return (
                          <GIContainer
                            className="x-fill full-center py8"
                            key={`invite ${index}`}
                          >
                            {`You have been invited to ${calendar.calendarName}.`}
                            <GIContainer>
                              <button
                                className="x-fill shadow-blue-3 bg-blue-fade-2 white br4 px16 py8 ml8"
                                onClick={e => {
                                  e.preventDefault();
                                  this.inviteResponse(context, index, true);
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="x-fill common-border five-blue br4 px16 py8 ml8"
                                onClick={e => {
                                  e.preventDefault();
                                  this.inviteResponse(context, index, false);
                                }}
                              >
                                Reject
                              </button>
                            </GIContainer>
                          </GIContainer>
                        );
                      })
                    )}
                  {!modalsOpen && (
                    <GIContainer className="column x-fill">
                      <GIContainer className="flex-fill align-center">
                        <GIText
                          className="muli px32 py16"
                          text={
                            calendars[activeCalendarIndex]
                              ? calendars[activeCalendarIndex].calendarName
                              : ""
                          }
                          type="h4"
                        />
                        {calendars[activeCalendarIndex] &&
                          defaultCalendarID ===
                            calendars[activeCalendarIndex]._id && (
                            <GIText
                              className="common-border green px8 py4 br4"
                              text="Default"
                              type="p"
                            />
                          )}
                      </GIContainer>

                      <GIContainer className="justify-between x-fill wrap pl32 pr16">
                        <GIContainer className="full-center my16">
                          <GIContainer
                            className="round-icon button round common-border five-blue full-center pa4"
                            onClick={() =>
                              subtractMonth(calendarDate, date => {
                                this.handleChange({ calendarDate: date });
                                getPosts(
                                  calendars,
                                  activeCalendarIndex,
                                  calendarDate,
                                  this.handleChange
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
                                getPosts(
                                  calendars,
                                  activeCalendarIndex,
                                  calendarDate,
                                  this.handleChange
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
                        <GIContainer className="full-center mb16">
                          <GIButton
                            className="common-border py16 px32 mr8 br4"
                            onClick={() =>
                              this.handleChange({ queuePreview: !queuePreview })
                            }
                            text={queuePreview ? "Calendar" : "Queue Preview"}
                          />
                          <Dropdown
                            activeItem={getActiveCategoriesInArray(
                              calendarEventCategories
                            )}
                            className="common-border shadow-light br4"
                            dropdownActiveDisplayClassName="no-bottom-br common-border five-blue"
                            dropdownClassName="common-border five-blue no-top-br br4"
                            dropdownItems={Object.keys(
                              calendarEventCategories
                            ).map((key, index) => key)}
                            handleParentChange={dropdownClickedItemObj =>
                              updateActiveCategory(
                                calendarEventCategories,
                                this.handleChange,
                                dropdownClickedItemObj.item
                              )
                            }
                            search
                            size="2x"
                            title={
                              <GIText
                                className="tac muli flex-fill px32 py16"
                                text="Filter Calendar"
                                type="h6"
                              />
                            }
                          />
                        </GIContainer>
                      </GIContainer>

                      <GIContainer className="pl32 pr16 pb32">
                        {queuePreview && (
                          <QueuePreview
                            calendarDate={calendarDate}
                            calendarEvents={calendarEvents}
                            onSelectPost={clickedEvent =>
                              this.handleChange({
                                postEdittingModal: true,
                                clickedEvent
                              })
                            }
                          />
                        )}
                        {!queuePreview && (
                          <Calendar
                            activeCalendarIndex={activeCalendarIndex}
                            calendars={calendars}
                            calendarDate={calendarDate}
                            calendarEvents={calendarEvents}
                            onSelectCampaign={campaign =>
                              this.handleChange({
                                clickedEvent: campaign,
                                clickedEventIsRecipe: false,
                                recipeEditing: false,
                                campaignModal: true
                              })
                            }
                            onSelectDay={date =>
                              this.handleChange({
                                clickedDate: date,
                                dashboardModal: true
                              })
                            }
                            onSelectPost={clickedEvent =>
                              this.handleChange({
                                postEdittingModal: true,
                                clickedEvent
                              })
                            }
                            updateActiveCalendar={this.updateActiveCalendar}
                            userList={userList}
                          />
                        )}
                      </GIContainer>
                    </GIContainer>
                  )}
                </GIContainer>
                {!isNaN(activeCalendarIndex) && !modalsOpen && (
                  <CalendarSideBar
                    updateActiveCalendar={this.updateActiveCalendar}
                    userList={userList}
                  />
                )}
              </GIContainer>
            )}
            {false && <CalendarChat calendars={calendars} />}

            {contentModal && calendars[activeCalendarIndex] && (
              <Modal0
                body={
                  <PostCreation
                    calendarAccounts={calendars[activeCalendarIndex].accounts}
                    calendarID={calendars[activeCalendarIndex]._id}
                    clickedCalendarDate={clickedDate}
                    handleParentChange={this.handleChange}
                    notify={context.notify}
                    savePostCallback={post => {
                      this.setState({ contentModal: false });
                      getPosts(
                        calendars,
                        activeCalendarIndex,
                        calendarDate,
                        this.handleChange
                      );
                      triggerSocketPeers(
                        "calendar_post_saved",
                        post,
                        calendars,
                        activeCalendarIndex,
                        socket
                      );
                    }}
                  />
                }
                close={() => this.handleChange({ contentModal: false })}
              />
            )}
            {postEdittingModal && (
              <PostEdittingModal
                calendarAccounts={calendars[activeCalendarIndex].accounts}
                calendarID={calendars[activeCalendarIndex]._id}
                clickedEvent={clickedEvent}
                close={() =>
                  this.handleChange({
                    postEdittingModal: false,
                    templatesModal: false,
                    recipeEditorModal: false,
                    clickedEvent: undefined
                  })
                }
                handleParentChange={this.handleChange}
                savePostCallback={post => {
                  getPosts(
                    calendars,
                    activeCalendarIndex,
                    calendarDate,
                    this.handleChange
                  );
                  triggerSocketPeers(
                    "calendar_post_saved",
                    post,
                    calendars,
                    activeCalendarIndex,
                    socket
                  );
                }}
                triggerSocketPeers={(type, post) =>
                  triggerSocketPeers(
                    type,
                    post,
                    calendars,
                    activeCalendarIndex,
                    socket
                  )
                }
                updateCalendarPosts={() =>
                  getPosts(
                    calendars,
                    activeCalendarIndex,
                    calendarDate,
                    this.handleChange
                  )
                }
              />
            )}

            {campaignModal && calendars[activeCalendarIndex] && (
              <Modal0
                body={
                  <Campaign
                    calendarAccounts={calendars[activeCalendarIndex].accounts}
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
              <Modal0
                close={() => this.setState({ dashboardModal: false })}
                body={
                  <GIContainer className="column x-fill bg-light-grey py16">
                    <GIText
                      className="muli x-fill tac py32"
                      text="Schedule Task"
                      type="h4"
                    />
                    <Dashboard
                      handleParentChange={stateObject => {
                        stateObject.dashboardModal = false;
                        this.handleChange(stateObject);
                      }}
                    />
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
CalendarPage.contextType = ExtraContext;

export default CalendarPage;
