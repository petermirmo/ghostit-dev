import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faUsers from "@fortawesome/fontawesome-free-solid/faUsers";

import "./styles/";

class SocketUserList extends Component {
  render() {
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
          {userList.length}
          <FontAwesomeIcon icon={faUsers} style={{ marginLeft: "6px" }} />
        </div>
        <div className="dropdown">{userDivs}</div>
      </div>
    );
  }
}

export default SocketUserList;
