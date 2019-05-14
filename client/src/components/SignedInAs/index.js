import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { signOutOfUsersAccount } from "./util";
import "./style.css";

class SignedInAs extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="signed-in-as pa16">
        Logged in as: {user.signedInAsUser.fullName}
        <FontAwesomeIcon
          icon={faTimes}
          onClick={() => signOutOfUsersAccount()}
          className="sign-out-of-clients-account"
        />
      </div>
    );
  }
}

export default SignedInAs;
