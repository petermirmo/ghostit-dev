import React, { Component } from "react";

import io from "socket.io-client";

import "./style.css";

class CalendarChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      collapsed: true,
      activeChatIndex: undefined
    };
  }
  componentDidMount() {
    this._ismounted = true;

    this.initSocket();
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  initSocket = () => {
    let socket;

    if (process.env.NODE_ENV === "development")
      socket = io("http://localhost:5000");
    else socket = io();

    this.setState({ socket });
  };

  render() {
    const { collapsed, activeChatIndex } = this.state;
    const { calendars } = this.props;

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
      if (activeChatIndex) {
        // render the chat history of calendars[activeChatIndex]
      } else {
      }
    }
  }
}
