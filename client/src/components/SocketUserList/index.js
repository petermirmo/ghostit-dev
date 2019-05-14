import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from "@fortawesome/free-solid-svg-icons";

import { capitolizeWordsInString } from "../../componentFunctions";

import "./style.css";

class SocketUserList extends Component {
  render() {
    const { userList, style } = this.props; // Variable
    let userDivs = [];
    for (let index = 0; index < userList.length; index++) {
      userDivs.push(
        <div
          className="item flex hc vc px16 py8"
          key={`socket-user-${index}`}
          style={{ cursor: "default" }}
        >
          <div className="green-dot mr4" />
          {capitolizeWordsInString(userList[index].name)}
        </div>
      );
    }

    return (
      <div className="active-users-count relative flex button">
        <div className="dropdown-title px16 py8">
          {userList.length}
          <FontAwesomeIcon icon={faUsers} className="ml8" />
        </div>
        <div style={style} className="dropdown common-shadow br4">
          {userDivs}
        </div>
      </div>
    );
  }
}

export default SocketUserList;
