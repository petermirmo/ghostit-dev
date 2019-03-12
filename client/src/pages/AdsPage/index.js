import React, { Component } from "react";
import axios from "axios";


import { connect } from "react-redux";

import "./style.css";

class AdsPage extends Component {
  state = {
    navigationOptions: {
      facebook: {
        name: "Facebook",
        active: true
      },
      linkedin: {
        name: "LinkedIn (Coming Soon)",
        active: false
      }
    }
  };
  componentDidMount() {
    
  }

  headerClick = activeOption => {
    let { navigationOptions } = this.state;
    for (let index in navigationOptions) {
      navigationOptions[index].active = false;
    }
    navigationOptions[activeOption].active = true;
    this.setState({ navigationOptions });
  };
  createHeader = () => {
    let { navigationOptions } = this.state;
    let navigationDivs = [];

    for (let index in navigationOptions) {
      let navigationOption = navigationOptions[index];
      navigationDivs.push(
        <div
          className={
            navigationOption.active
              ? "ads-tab mx4 pa8 button active"
              : "ads-tab mx4 pa8 button"
          }
          onClick={() => this.headerClick(index)}
          key={index}
        >
          {navigationOption.name}
        </div>
      );
    }
    return (
      <div className="ads-navigation mb8 px32 pt16">
        <MetaTags>
          <title>Ghostit | Ads</title>
        </MetaTags>
        {navigationDivs}
      </div>
    );
  };
  render() {
    return <div>{this.createHeader()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(AdsPage);
