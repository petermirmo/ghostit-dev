import React, { Component } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import "./styles/";

class ManagePage extends Component {
  state = {
    userTable: true
  };

  switchDivs = event => {
    this.setState({ userTable: !this.state.userTable });
  };

  render() {
    return (
      <div className="flex column vc">
        <div className="manage-navigation flex vc py8 px16 mb16 common-shadow">
          <button
            className="test3 px32 py8 mx8 moving-border"
            onClick={event => this.switchDivs(event)}
          >
            Users
          </button>

          <button
            className="test3 px32 py8 mx8 moving-border"
            onClick={event => this.switchDivs(event)}
          >
            Plans
          </button>
        </div>
        <div className="test6">
          {this.state.userTable ? <UsersTable /> : <PlansTable />}
        </div>
      </div>
    );
  }
}

export default ManagePage;
