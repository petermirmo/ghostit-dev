import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faUsers from "@fortawesome/fontawesome-free-solid/faUsers";

import { capitolizeWordsInString } from "../../componentFunctions";

import "./style.css";

class SocketUserList extends Component {
  render() {
    const { userList, left } = this.props; // Variable
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
        <div
          className={
            left
              ? "dropdown left common-shadow br4"
              : " dropdown common-shadow br4"
          }
        >
          {userDivs}
        </div>
      </div>
    );
  }
}

export default SocketUserList;
