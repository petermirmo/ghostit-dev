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
        <div
          className="item px16 py8"
          key={`socket-user-${index}`}
          style={{ cursor: "default" }}
        >
          {userList[index]}
        </div>
      );
    }

    return (
      <div className="active-users-count relative flex button">
        <div className="dropdown-title px16 py8">
          {userList.length}
          <FontAwesomeIcon icon={faUsers} style={{ marginLeft: "8px" }} />
        </div>
        <div className="dropdown common-shadow br4">{userDivs}</div>
      </div>
    );
  }
}

export default SocketUserList;
