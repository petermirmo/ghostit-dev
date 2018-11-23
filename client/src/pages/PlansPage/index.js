import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";

import PlanTable from "./PlanTable";
import "./styles/";

class PlansPage extends Component {
  state = {
    usersPlan: false
  };
  constructor(props) {
    super(props);

    this.getUsersAssignedPlan();
  }
  getUsersAssignedPlan = () => {
    axios.get("/api/user/plan").then(res => {
      let { loggedIn } = res.data;
      if (loggedIn === false) this.props.history.push("/sign-in");

      this.setState({ usersPlan: res.data });
    });
  };
  increaseHeaderPadding = () => {
    this.setState({ padding: { paddingTop: "70px" } });
  };
  render() {
    return (
      <div className="wrapper plans-page-background">
        <p className="plan-page-title center">
          Get Started With Ghostit{" "}
          <span className="plan-title-emphasis">Now</span>
        </p>
        <div className="pricing-container">
          <p className="plan-page-description">
            <span className="plan-description-title">
              What are you waiting for?{" "}
            </span>
            <br />
            Click the plus and minus buttons to customize your plan!
          </p>
          <PlanTable usersPlan={this.state.usersPlan} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(PlansPage);
