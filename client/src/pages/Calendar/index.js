import React, { Component } from "react";

import axios from "axios";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCheck,
  faPencilAlt,
  faPlus,
  faTimes
} from "@fortawesome/pro-light-svg-icons";

import { faTrash } from "@fortawesome/pro-solid-svg-icons";

import { connect } from "react-redux";

import PostCreation from "../../components/postingFiles/PostCreation";
import PostEdittingModal from "../../components/postingFiles/PostEditingModal";
import Calendar from "../../components/Calendar";
import QueuePreview from "../../components/QueuePreview";
import CalendarManager from "../../components/CalendarManager";
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

import Consumer from "../../context";

import { isAdmin } from "../../util";

import {
  getCalendars,
  getCalendarInvites,
  triggerSocketPeers,
  initSocket,
  getCampaigns,
  getUserEmail
} from "../util";

import { validateEmail } from "../../componentFunctions";

import {
  addMonth,
  createNewCalendar,
  deleteCalendar,
  getActiveCategoriesInArray,
  getCalendarEvents,
  getCalendarUsers,
  getPosts,
  inviteUserToCalendar,
  isUserAdminOfCalendar,
  removeUserFromCalendar,
  saveCalendarName,
  subtractMonth,
  updateActiveCategory
} from "./util";

import "./style.css";

class CalendarPage extends Component {
  state = {
    activeCalendarIndex: undefined,

    calendars: [],
    calendarInvites: [],
    calendarUsers: [],
    clickedDate: new moment(),
    calendarDate: new moment(),
    calendarEditing: false,
    calendarName: "",
    clickedEvent: undefined,
    clickedEventIsRecipe: false,
    defaultCalendarID: undefined,
    inviteUserActivated: false,
    inviteUserEmail: "",

    customPosts: [],
    facebookPosts: [],
    linkedinPosts: [],
    twitterPosts: [],

    calendarManagerModal: false,
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
    removeUserPrompt: false,
    socket: undefined,

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
      getCalendarUsers(calendars, this.handleChange, activeCalendarIndex);
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
    const { user } = this.props;

    if (!calendars || activeCalendarIndex === undefined || !socket) return;

    socket.emit("calendar_connect", {
      calendarID: calendars[activeCalendarIndex]._id,
      email: user.email,
      name: user.fullName
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
    const { activeCalendarIndex, calendarDate, calendars } = this.state;

    getPosts(calendars, activeCalendarIndex, calendarDate, this.handleChange);
    getCampaigns(calendars, activeCalendarIndex, this.handleChange);
  };

  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject);
    if (callback) callback();
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

  updateActiveCalendar = index => {
    const { calendarDate, calendars } = this.state;
    if (calendars)
      if (calendars[index]) moment.tz.setDefault(calendars[index].timezone);

    this.setState(
      {
        activeCalendarIndex: index,
        calendarDate: new moment(calendarDate),
        calendarEditing: false
      },
      () => {
        this.fillCalendar();
        this.updateSocketCalendar();
        getCalendarUsers(calendars, this.handleChange, index);
      }
    );
  };

  render() {
    const {
      activeCalendarIndex,
      calendarDate,
      calendarEditing,
      calendarInvites,
      calendarManagerModal,
      calendarName,
      calendars,
      calendarUsers,
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
      inviteUserActivated,
      inviteUserEmail,
      linkedinPosts,
      loading,
      postEdittingModal,
      queuePreview,
      recipeEditing,
      removeUserObj,
      removeUserPrompt,
      socket,
      templatesModal,
      twitterPosts,
      userList
    } = this.state;

    const { user } = this.props;

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
      calendarManagerModal ||
      campaignModal ||
      contentModal ||
      dashboardModal ||
      postEdittingModal ||
      templatesModal;

    return (
      <Consumer>
        {context => (
          <Page className="x-fill column relative" title="Calendar">
            {loading && <Loader />}
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
                            this.inviteResponse(index, true);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="x-fill common-border five-blue br4 px16 py8 ml8"
                          onClick={e => {
                            e.preventDefault();
                            this.inviteResponse(index, false);
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
              <GIContainer className="calendar-grid x-fill">
                {calendarEditing && (
                  <GIInput
                    className="fs-20 shadow-medium px32"
                    onChange={event =>
                      this.handleChange({
                        calendarName: event.target.value
                      })
                    }
                    placeholder="Calendar Name..."
                    type="text"
                    value={calendarName}
                  />
                )}
                {!calendarEditing && (
                  <Dropdown
                    activeItem={activeCalendarIndex}
                    className="shadow-medium"
                    dropdownActiveDisplayClassName="border-right five-blue"
                    dropdownClassName="border-bottom border-right five-blue"
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
                )}
                <GIContainer className="shadow-medium px8">
                  {!calendarEditing &&
                    (isUserAdminOfCalendar(
                      calendars[activeCalendarIndex],
                      user
                    ) ||
                      isAdmin(user)) && (
                      <GIButton
                        className="five-blue fill-flex common-border mx8 py8 px16 my8 br4"
                        onClick={() =>
                          this.handleChange({
                            calendarEditing: true,
                            calendarName:
                              calendars[activeCalendarIndex].calendarName
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                        <GIText className="five-blue" text="Edit" type="h5" />
                      </GIButton>
                    )}
                  {!calendarEditing && (
                    <GIButton
                      className="bg-orange-fade fill-flex shadow-orange mx8 py8 px16 my8 br4"
                      onClick={() =>
                        this.handleChange({ dashboardModal: true })
                      }
                    >
                      <FontAwesomeIcon className="white" icon={faPlus} />
                      <GIText className="white" text="New" type="h6" />
                    </GIButton>
                  )}
                  {calendarEditing && (
                    <GIButton
                      className="five-blue fill-flex common-border mx8 py8 px16 my8 br4"
                      onClick={() =>
                        this.handleChange({ calendarEditing: true })
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      <GIText
                        className="five-blue"
                        onClick={() =>
                          saveCalendarName(
                            calendars,
                            this.handleChange,
                            activeCalendarIndex,
                            calendarName
                          )
                        }
                        text="Save"
                        type="h5"
                      />
                    </GIButton>
                  )}
                  {calendarEditing && (
                    <GIButton
                      className="fill-flex common-border mx8 py8 px16 my8 br4"
                      onClick={() =>
                        this.handleChange({ calendarEditing: false })
                      }
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      <GIText text="Cancel" type="h6" />
                    </GIButton>
                  )}
                  {calendarEditing && (
                    <GIButton
                      className="fill-flex common-border mx8 py8 px16 my8 br4"
                      onClick={() =>
                        deleteCalendar(
                          calendars,
                          context,
                          this.handleChange,
                          activeCalendarIndex,
                          this.updateActiveCalendar
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <GIText text="Delete Calendar" type="h6" />
                    </GIButton>
                  )}
                </GIContainer>

                <GIContainer className="justify-between x-fill pl32 pr16 my16">
                  <GIContainer className="full-center">
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
                  <GIContainer className="full-center">
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
                      dropdownItems={Object.keys(calendarEventCategories).map(
                        (key, index) => key
                      )}
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
                          className="tac muli fill-flex pl32 pr48 py16"
                          text="Filter Calendar"
                          type="h6"
                        />
                      }
                    />
                  </GIContainer>
                </GIContainer>
                <GIContainer className="full-center mr32">
                  <GIText className="tac" text="Calendar Users" type="h4" />
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
                      enableCalendarManager={() =>
                        this.setState({ calendarManagerModal: true })
                      }
                      inviteResponse={this.inviteResponse}
                      onSelectCampaign={this.openCampaign}
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
                <GIContainer className="column container-box twentyvw mr32">
                  <GIContainer className="full-center common-border relative pt16 pb32 br8">
                    {inviteUserActivated && (
                      <GIInput
                        className="mx16 br4"
                        onChange={event =>
                          this.handleChange({
                            inviteUserEmail: event.target.value
                          })
                        }
                        name="email"
                        placeholder="Email Address"
                        type="text"
                        value={inviteUserEmail}
                      />
                    )}
                    {!inviteUserActivated && (
                      <GIText
                        className="tac"
                        text={getUserEmail(user)}
                        type="h5"
                      />
                    )}

                    <GIButton
                      className={
                        "white absolute bottom-0 translate-y-50 px16 py4 br4" +
                        (validateEmail(inviteUserEmail) || !inviteUserActivated
                          ? " bg-five-blue"
                          : " grey-button")
                      }
                      onClick={() => {
                        if (inviteUserActivated) {
                          if (validateEmail(inviteUserEmail))
                            inviteUserToCalendar(
                              calendars,
                              context,
                              activeCalendarIndex,
                              this.handleChange,
                              inviteUserEmail
                            );
                          else alert("Not an email address");
                        } else this.handleChange({ inviteUserActivated: true });
                      }}
                      text="Invite"
                    />
                  </GIContainer>
                  <GIContainer className="column full-center common-border pt8 br8">
                    {calendarUsers.map((user, index) => {
                      let className = "align-center x-fill px16 py16";
                      if (index !== calendarUsers.length - 1)
                        className += " border-bottom-light";

                      return (
                        <GIContainer className={className} key={index}>
                          <GIContainer className="x-70 column fill-flex">
                            <GIText
                              className="ellipsis"
                              text={user.fullName}
                              title={user.fullName}
                              type="h6"
                            />
                            <GIText
                              className="label ellipsis"
                              text={user.email}
                              type="p"
                            />
                          </GIContainer>
                          {calendarEditing && (
                            <FontAwesomeIcon
                              className="delete ml8"
                              icon={faTrash}
                              onClick={() => {
                                this.handleChange({
                                  removeUserPrompt: true,
                                  removeUserObj: {
                                    calendarIndex: activeCalendarIndex,
                                    userIndex: index
                                  }
                                });
                              }}
                            />
                          )}
                        </GIContainer>
                      );
                    })}
                    {calendars[activeCalendarIndex] &&
                      calendars[activeCalendarIndex].emailsInvited.map(
                        (email, index) => {
                          let className = "align-center x-fill px16 py16";
                          if (
                            index !==
                            calendars[activeCalendarIndex].emailsInvited
                              .length -
                              1
                          )
                            className += " border-bottom-light";

                          return (
                            <GIContainer className={className} key={index}>
                              <GIContainer className="x-70 column fill-flex">
                                <GIText
                                  className="ellipsis"
                                  text={email}
                                  title={email}
                                  type="h6"
                                />
                                <GIText
                                  className="green ellipsis"
                                  text="Invitation Sent..."
                                  type="p"
                                />
                              </GIContainer>
                            </GIContainer>
                          );
                        }
                      )}
                  </GIContainer>
                </GIContainer>
              </GIContainer>
            )}
            {false && <CalendarChat calendars={calendars} />}
            {calendarManagerModal && (
              <Modal0
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
              <Modal0
                body={
                  <PostCreation
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
                calendarID={calendars[activeCalendarIndex]._id}
                clickedEvent={clickedEvent}
                close={this.closeModals}
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
                      className="justify-center"
                      handleParentChange={stateObject => {
                        stateObject.dashboardModal = false;
                        this.handleChange(stateObject);
                      }}
                    />
                  </GIContainer>
                }
              />
            )}
            {removeUserPrompt && (
              <ConfirmAlert
                close={() =>
                  this.handleChange({
                    removeUserPrompt: false,
                    removeUserObj: undefined
                  })
                }
                title="Remove User"
                message="Are you sure you want to remove this user from the calendar?"
                firstButton="Remove"
                callback={response => {
                  this.handleChange({
                    removeUserPrompt: false,
                    removeUserObj: undefined
                  });
                  if (response)
                    removeUserFromCalendar(
                      removeUserObj.calendarIndex,
                      calendars,
                      context,
                      removeUserObj.userIndex
                    );
                }}
                type="delete-calendar"
              />
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}

/*createNewCalendar(
  context,
  this.handleChange,
  calendars.length,
  "Calendar " + (calendars.length + 1),
  this.updateActiveCalendar
)*/

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(CalendarPage);
