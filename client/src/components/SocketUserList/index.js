import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

import "./styles/";

class SocketUserList extends Component {
  render() {
    console.log(`socketUserList ${this.props.userList.length} users`);
    const { userList } = this.props; // Variable
    let userDivs = [];
    for (let index = 0; index < userList.length; index++) {
      userDivs.push(
        <div className="socket-user" key={`socket-user-${index}`} id={index}>
          {userList[index]}
        </div>
      );
    }

    return (
      <div className="calendars-container">
        <div className="dropdown-title pa8">
          {`${userList.length} users connected to calendar`}
          <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: "6px" }} />
        </div>
        <div className="dropdown">{userDivs}</div>
      </div>
    );
  }
}

export default SocketUserList;
