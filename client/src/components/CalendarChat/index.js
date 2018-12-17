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
  componentWillReceiveProps(props) {
    const { calendars } = this.state;
    if (calendars.length !== props.calendars.length) {
      this.setState({ calendars: props.calendars });
      console.log("detected calendar change");
    }
  }

  initSocket = () => {
    let socket;

    if (process.env.NODE_ENV === "development")
      socket = io("http://localhost:5000");
    else socket = io();

    this.setState({ socket });
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
    chatHistory = [
      {
        userID: 11111,
        content: "hi",
        edited: true,
        createdAt: "2018-12-15T00:30:03.455Z",
        updatedAt: "2018-12-15T00:35:00.937Z"
      },
      {
        userID: 22222,
        content: "hello",
        edited: false,
        createdAt: "2018-12-15T00:36:03.455Z",
        updatedAt: "2018-12-15T00:36:03.455Z"
      },
      {
        userID: 33333,
        content: "bye",
        edited: false,
        createdAt: "2018-12-15T00:41:03.455Z",
        updatedAt: "2018-12-15T00:41:03.455Z"
      }
    ];

    return (
      <div className="chat-calendar-history">
        {chatHistory.map((chatObj, index) => {
          return (
            <div
              className="chat-calendar-history-message"
              key={`message-${index}`}
              title={new moment(chatObj.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            >
              {`${chatObj.userID}: ${chatObj.content}`}
            </div>
          );
        })}
      </div>
    );
  };

  sendMessage = () => {
    const { calendars, activeChatIndex, inputText } = this.state;

    if (!inputText || !/\S/.test(inputText)) {
      // second clause is to catch a full white-space string
      return;
    }

    /*
      socket.emit("calendar_chat_message_send")
    */
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
