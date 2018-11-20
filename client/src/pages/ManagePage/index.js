import React, { Component } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import "./styles/";

class ManagePage extends Component {
  state = {
    userTable: true,
    categories: {
      users: { value: "Users", active: false, onClick: },
      plans: { value: "Plans", active: false },
      createBlog: { value: "Create a Blog", active: true }
    }
  };

  switchDivs = event => {
    this.setState({ userTable: !this.state.userTable });
  };

  render() {
    const { categories } = this.state;

    let buttonDivs = [];
    for (let index in categories) {
      let category = categories[index];
      let className = "px32 py8 mx8 moving-border";
      if (category.active) className += " active";

      buttonDivs.push(
        <button className={className} onClick={event => this.switchDivs(event)}>
          {category.value}
        </button>
      );
    }
    return (
      <div className="flex column vc">
        <div className="manage-navigation flex vc py8 px16 mb16 common-shadow">
          {buttonDivs}

          <button
            className="test3 px32 py8 mx8 moving-border"
            onClick={event => this.switchDivs(event)}
          >
            Plans
          </button>
        </div>
        <div className="width100">
          { <UsersTable /> }
          {categories. <PlansTable />}
        </div>
      </div>
    );
  }
}

export default ManagePage;
