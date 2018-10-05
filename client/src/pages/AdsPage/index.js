import React, { Component } from "react";
import axios from "axios";

import "./styles/";

class AdsPage extends Component {
  test = () => {
    axios.get("/api/test").then(res => console.log(res));
  };
  render() {
    return (
      <div>
        <div onClick={this.test} className="test">
          Click me!
        </div>
      </div>
    );
  }
}

export default AdsPage;
