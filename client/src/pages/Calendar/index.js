import React, { Component } from "react";

import axios from "axios";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPencilAlt,
  faPlus
} from "@fortawesome/pro-light-svg-icons";

import { connect } from "react-redux";

import PostCreation from "../../components/postingFiles/PostCreation";
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
import Modal0 from "../../components/containers/Modal0";

import Dropdown from "../../components/views/Dropdown";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
import GIText from "../../components/views/GIText";
import GIContainer from "../../components/containers/GIContainer";

import Consumer from "../../context";

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
  getActiveCategoriesInArray,
  getCalendarEvents,
  getCalendarUsers,
  getPosts,
  inviteUserToCalendar,
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
    campaignModal: true,
    contentModal: false,
    dashboardModal: false,
    postEdittingModal: false,

    calendarEventCategories: {
      All: true,
      Campaigns: false,
      Custom: false,
      Facebook: false,
      Linkedin: false,
      Twitter: false
    },

    loading: false,

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
      recipeEditing,
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
      postEdittingModal;

    return (
      <Consumer>
        {context => (
          <Page className="x-fill column relative" title="Calendar">
            {loading && <Loader />}
            {!modalsOpen && (
              <GIContainer className="calendar-grid x-fill">
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
                <GIContainer className="shadow-medium">
                  <GIButton
                    className="five-blue fill-flex common-border ml16 mr8 py8 px16 my8 br4"
                    onClick={() => {}}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                    <GIText className="pl8" text="Edit" type="h5" />
                  </GIButton>
                  <GIButton
                    className="bg-orange-fade fill-flex shadow-orange mr16 ml8 py8 px16 my8 br4"
                    onClick={() => {}}
                  >
                    <FontAwesomeIcon className="white" icon={faPlus} />
                    <GIText className="white pl8" text="New" type="h6" />
                  </GIButton>
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
                    <Dropdown
                      activeItem={getActiveCategoriesInArray(
                        calendarEventCategories
                      )}
                      className="x-fill common-border shadow-light br4"
                      dropdownActiveDisplayClassName="no-bottom-br common-border five-blue"
                      dropdownClassName="common-border five-blue"
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
                <GIContainer className="pl32 pr16">
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
                      let className = "column x-fill px16 py16";
                      if (
                        index === calendarUsers.length - 1 &&
                        (calendars[activeCalendarIndex] &&
                          calendars[activeCalendarIndex].emailsInvited !== 0)
                      )
                        className += " border-bottom-light";

                      return (
                        <GIContainer className={className} key={index}>
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
                      );
                    })}
                    {calendars[activeCalendarIndex] &&
                      calendars[activeCalendarIndex].emailsInvited.map(
                        (email, index) => {
                          let className = "column x-fill px16 py16";
                          if (
                            index !==
                            calendars[activeCalendarIndex].emailsInvited
                              .length -
                              1
                          )
                            className += " border-bottom-light";

                          return (
                            <GIContainer className={className} key={index}>
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
                      this.setState({ contentModal: false });
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
          </Page>
        )}
      </Consumer>
    );
  }
}

/*{calendarInvites.map((calendar, index) => {
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
})}*/

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(CalendarPage);
