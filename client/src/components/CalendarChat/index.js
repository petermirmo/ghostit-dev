import React, { Component } from "react";

import io from "socket.io-client";
import moment from "moment-timezone";

import "./style.css";

class CalendarChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      collapsed: true,
      activeChatIndex: undefined,
      calendars: props.calendars,
      inputText: ""
    };
  }
  componentDidMount() {
    this._ismounted = true;

    this.initSocket();
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.calendars.length !== this.props.calendars.length) {
      this.setState({ calendars: this.props.calendars }, this.joinSocketRooms);
    }
  }

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
      const { calendarID, msgObj } = reqObj;
      const { calendars } = this.state;

      const index = calendars.findIndex(
        calObj => calObj._id.toString() === calendarID.toString()
      );
      if (index === -1) return;

      this.addMessageToChatHistory(msgObj, index);
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

  getChatHistoryDiv = () => {
    const { calendars, activeChatIndex } = this.state;

    if (
      !calendars ||
      activeChatIndex === undefined ||
      !calendars[activeChatIndex]
    )
      return undefined;

    let chatHistory = calendars[activeChatIndex].chatHistory;

    return (
      <div className="chat-calendar-history">
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

  addMessageToChatHistory = (msgObj, calendarIndex) => {
    const { calendars } = this.state;

    const newCalendarChatHistory = [
      ...calendars[calendarIndex].chatHistory,
      msgObj
    ];
    const newCalendar = {
      ...calendars[calendarIndex],
      chatHistory: newCalendarChatHistory
    };

    this.setState(prevState => {
      return {
        calendars: [
          ...prevState.calendars.slice(0, calendarIndex),
          newCalendar,
          ...prevState.calendars.slice(calendarIndex + 1)
        ]
      };
    });
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
      this.addMessageToChatHistory(msgObj, activeChatIndex);
      this.setState({ inputText: "" });
    });
  };

  render() {
    const { collapsed, activeChatIndex, calendars, inputText } = this.state;

    if (collapsed) {
      // just render a small Chat rectangle in the bottom right of the page
      return (
        <div
          className="chat-btn"
          onClick={() => this.setState({ collapsed: false })}
        >
          Chat
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
              <div
                className="chat-calendar-header-back-btn"
                onClick={() =>
                  this.setState({ activeChatIndex: undefined, inputText: "" })
                }
              >
                {"->"}
              </div>
            </div>
            {this.getChatHistoryDiv()}
            <div className="chat-calendar-input">
              <input
                type="text"
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
            <div
              className="chat-calendar-list-header"
              onClick={() => this.setState({ collapsed: true })}
            >
              {"x"}
            </div>
            <div className="chat-calendar-list">
              {calendars.map((calendar, index) => {
                return (
                  <div
                    className="chat-calendar-btn"
                    key={`calendar-btn-${index}`}
                    onClick={() =>
                      this.setState({ activeChatIndex: index, inputText: "" })
                    }
                  >
                    {calendar.calendarName}
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

export default CalendarChat;
