import React, { Component } from "react";
import { connect } from "react-redux";

import io from "socket.io-client";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faCircle,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

class CalendarChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      collapsed: true,
      activeChatIndex: undefined,
      calendars: props.calendars,
      inputText: "",
      unread: [], // unread[i] === true if calendars[i] has unread messages
      chatTopNotification: undefined
    };
  }
  componentDidMount() {
    this._ismounted = true;

    this.initSocket();
    this.updateUnreadMessages();

    window.addEventListener("keypress", this.submitByEnterKey);
  }
  componentWillUnmount() {
    this._ismounted = false;
    window.removeEventListener("keypress", this.submitByEnterKey);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.calendars.length !== this.props.calendars.length) {
      this.setState({ calendars: this.props.calendars }, () => {
        this.joinSocketRooms();
        this.updateUnreadMessages();
      });
    }
  }

  submitByEnterKey = e => {
    const { collapsed, activeChatIndex } = this.state;

    if (e && e.keyCode && e.keyCode === 13) {
      // user pressed enter key
      if (!collapsed && activeChatIndex !== undefined) {
        // chat window is open
        this.sendMessage();
      }
    }
  };

  initSocket = () => {
    let socket;

    if (process.env.NODE_ENV === "development")
      socket = io("http://localhost:5000");
    else socket = io();

    socket.on("calendar_chat_connect_error", reqObj => {
      console.log(reqObj);
      if (reqObj && reqObj.message) alert(reqObj.message);
    });

    socket.on("calendar_chat_message_broadcast", reqObj => {
      const { calendarID, savedMsgObj } = reqObj;
      const { calendars } = this.state;

      const index = calendars.findIndex(
        calObj => calObj._id.toString() === calendarID.toString()
      );
      if (index === -1) return;

      this.addMessageToChatHistory(savedMsgObj, index);
    });

    socket.on("calendar_chat_send_more_messages", reqObj => {
      const { calendarID, newMessages, error } = reqObj;
      const { calendars, activeChatIndex } = this.state;

      if (error) {
        // do something to show error message at top of chatHistory div
      } else {
        if (newMessages.length <= 0) {
          // do something to show that there are no more messages in this chat at top of chatHistory div
        } else {
          // add these new messages to calendars[activeChatIndex].chatHistory
          if (
            calendarID.toString() === calendars[activeChatIndex]._id.toString()
          ) {
            // make sure we're still on the right calendar's chat
            const newChatHistory = [
              ...newMessages,
              ...calendars[activeChatIndex].chatHistory
            ];
            const newCalendar = {
              ...calendars[activeChatIndex],
              chatHistory: newChatHistory
            };
            const newCalendars = [
              ...calendars.slice(0, activeChatIndex),
              newCalendar,
              ...calendars.slice(activeChatIndex + 1)
            ];

            let old_height = document.getElementById("chat-history-div")
              .scrollHeight;

            this.setState({ calendars: newCalendars });
            window.setTimeout(() => {
              let chatDiv = document.getElementById("chat-history-div");

              chatDiv.scrollTop = chatDiv.scrollHeight - old_height;
            }, 10);
          }
        }
      }
    });

    this.setState({ socket }, this.joinSocketRooms);
  };

  joinSocketRooms = () => {
    const { socket, calendars } = this.state;

    if (!socket || !calendars || calendars.length === 0) return;

    const calendarIDList = calendars.map(calObj => {
      return {
        _id: calObj._id
      };
    });

    socket.emit("calendar_chat_connect", { calendarIDList });
  };

  requestMoreChatMessages = () => {
    const { calendars, activeChatIndex, socket } = this.state;

    socket.emit("calendar_chat_request_more_messages", {
      calendarID: calendars[activeChatIndex]._id,
      clientChatHistoryLength: calendars[activeChatIndex].chatHistory.length
    });
  };

  chatScrolled = e => {
    if (e.target.scrollTop === 0) {
      // div is scrolled to the top
      this.requestMoreChatMessages();
    }
  };

  getChatHistoryDiv = () => {
    const { calendars, activeChatIndex, chatTopNotification } = this.state;

    if (
      !calendars ||
      activeChatIndex === undefined ||
      !calendars[activeChatIndex]
    )
      return undefined;

    let chatHistory = calendars[activeChatIndex].chatHistory;

    return (
      <div
        className="chat-calendar-history"
        id="chat-history-div"
        onScroll={this.chatScrolled}
      >
        {chatTopNotification && (
          <div className="chat-calendar-history-notification">
            {chatTopNotification}
          </div>
        )}
        {!chatTopNotification && (
          <div className="chat-calendar-history-notification">
            Loading History
          </div>
        )}
        {chatHistory.map((chatObj, index) => {
          return (
            <div
              className="chat-calendar-history-message"
              key={`message-${index}`}
              title={`${new moment(chatObj.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}\n${chatObj.userEmail}`}
            >
              <b>{`${chatObj.username}`}</b>
              {`: ${chatObj.content}`}
            </div>
          );
        })}
      </div>
    );
  };

  scrollChatHistoryToBottom = () => {
    // function to force the chat history to scroll to the bottom
    // called whenever a new calendar chat is rendered or
    // when a new message on the current chat is received
    const chatHistoryDiv = document.getElementById("chat-history-div");
    if (chatHistoryDiv) chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
  };

  addMessageToChatHistory = (msgObj, calendarIndex) => {
    const { calendars, activeChatIndex, unread } = this.state;

    const newCalendarChatHistory = [
      ...calendars[calendarIndex].chatHistory,
      msgObj
    ];
    const newCalendar = {
      ...calendars[calendarIndex],
      chatHistory: newCalendarChatHistory
    };

    const newUnread = [...unread];
    if (activeChatIndex !== calendarIndex) {
      newUnread[calendarIndex] = true;
    }

    this.setState(
      prevState => {
        return {
          calendars: [
            ...prevState.calendars.slice(0, calendarIndex),
            newCalendar,
            ...prevState.calendars.slice(calendarIndex + 1)
          ],
          unread: newUnread
        };
      },
      () => {
        if (activeChatIndex === calendarIndex) this.scrollChatHistoryToBottom();
      }
    );
  };

  sendMessage = () => {
    const { calendars, activeChatIndex, inputText, socket } = this.state;

    if (!inputText || !/\S/.test(inputText)) {
      // second clause is to catch a full white-space string
      return;
    }

    socket.emit("calendar_chat_message_send", {
      calendarID: calendars[activeChatIndex]._id,
      inputText
    });
    socket.on("calendar_chat_message_received", msgObj => {
      socket.off("calendar_chat_message_received");
      this.updateChatOpenedTime(activeChatIndex);
      this.addMessageToChatHistory(msgObj, activeChatIndex);
      this.setState({ inputText: "" });
    });
  };

  updateChatOpenedTime = index => {
    const { socket, unread } = this.state;

    const newUnread = [...unread];
    newUnread[index] = false;
    this.setState({ unread: newUnread });

    socket.emit("calendar_chat_opened", {
      calendarID: this.state.calendars[index]._id,
      timestamp: new moment()
    });
    socket.on("calendar_chat_opened_response", chatLastOpened => {
      const { calendars } = this.state;
      socket.off("calendar_chat_opened_response");
      const newCalendar = { ...calendars[index], chatLastOpened };
      const newCalendars = [...calendars];
      newCalendars[index] = newCalendar;
      this.setState({ calendars: newCalendars });
    });
  };

  setActiveChatIndex = index => {
    if (
      !this.state.calendars ||
      !this.state.calendars[index] ||
      !this.state.socket
    )
      return;

    this.updateChatOpenedTime(index);

    this.setState(
      { activeChatIndex: index, inputText: "" },
      this.scrollChatHistoryToBottom
    );
  };

  calendarHasUnreadMessages = calendar => {
    if (calendar.chatHistory.length === 0) return false; // no msgs so no unread

    const chatLastOpened = calendar.chatLastOpened.find(
      chatLastOpenedObj =>
        chatLastOpenedObj.userID.toString() === this.props.user._id.toString()
    );
    if (!chatLastOpened) return true; // this user has never opened the chat so must be unread

    const lastMessage = calendar.chatHistory[calendar.chatHistory.length - 1];
    if (
      new moment(lastMessage.createdAt) > new moment(chatLastOpened.timestamp)
    )
      return true; // newest msg happened after the last time the user opened this chat so must be unread
  };

  updateUnreadMessages = () => {
    const { calendars } = this.state;
    const unread = [];

    for (let i = 0; i < calendars.length; i++) {
      unread.push(this.calendarHasUnreadMessages(calendars[i]));
    }

    this.setState({ unread });
  };

  render() {
    const {
      collapsed,
      activeChatIndex,
      calendars,
      inputText,
      unread
    } = this.state;

    if (collapsed) {
      // just render a small Chat rectangle in the bottom right of the page
      const notifyUnread = unread.findIndex(tmp => tmp === true) !== -1;
      return (
        <div
          className="chat-btn"
          onClick={() => this.setState({ collapsed: false })}
        >
          Chat
          {notifyUnread && <FontAwesomeIcon icon={faCircle} color="red" />}
        </div>
      );
    } else {
      // chat is open
      if (activeChatIndex !== undefined) {
        // render the chat history of calendars[activeChatIndex]
        return (
          <div className="chat-calendar">
            <div className="chat-calendar-header">
              {calendars[activeChatIndex].calendarName}
              <div className="chat-calendar-header-btns">
                <div
                  className="chat-calendar-header-back-btn"
                  onClick={() =>
                    this.setState({ activeChatIndex: undefined, inputText: "" })
                  }
                >
                  <FontAwesomeIcon icon={faAngleRight} size="1x" />
                </div>
                <div
                  className="chat-calendar-header-close-btn"
                  onClick={() =>
                    this.setState({
                      activeChatIndex: undefined,
                      inputText: "",
                      collapsed: true
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes} size="1x" />
                </div>
              </div>
            </div>
            {this.getChatHistoryDiv()}
            <div className="chat-calendar-input">
              <TextArea
                value={inputText}
                onChange={event => {
                  this.setState({ inputText: event.target.value });
                }}
                className="chat-calendar-text-input"
              />
              <button
                className="chat-calendar-send-btn"
                onClick={e => {
                  e.preventDefault();
                  this.sendMessage();
                }}
              >
                Send
              </button>
            </div>
          </div>
        );
      } else {
        // render a list of all calendars
        return (
          <div className="chat-calendar-list-and-header">
            <div className="chat-calendar-list-header">
              Your Calendars
              <div
                className="chat-calendar-list-back-btn"
                onClick={() => this.setState({ collapsed: true })}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </div>
            <div className="chat-calendar-list">
              {calendars.map((calendar, index) => {
                const notifyUnread = unread[index];

                return (
                  <div
                    className="chat-calendar-btn"
                    key={`calendar-btn-${index}`}
                    onClick={() => this.setActiveChatIndex(index)}
                  >
                    {calendar.calendarName}
                    {notifyUnread && (
                      <FontAwesomeIcon icon={faCircle} color="red" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(CalendarChat);
