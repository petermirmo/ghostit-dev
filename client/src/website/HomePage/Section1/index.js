import React, { Component } from "react";

let { mobileAndTabletcheck } = require("../../../componentFunctions");

class Section1 extends Component {
  constructor(props) {
    super(props);
    this.state = this.createState();
  }
  componentDidMount() {
    this.interval = setInterval(() => this.setState(this.createState), 8000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  createState = () => {
    return {
      randomInt1: ~~(Math.random() * 200) + 20,
      randomInt2: ~~(Math.random() * 200) + 20,
      randomInt3: ~~(Math.random() * 200) + 20,
      randomInt4: ~~(Math.random() * 200) + 20,
      randomInt5: ~~(Math.random() * 200) + 20,
      randomInt6: ~~(Math.random() * 200) + 20
    };
  };
  render() {
    const {
      randomInt1,
      randomInt2,
      randomInt3,
      randomInt4,
      randomInt5,
      randomInt6
    } = this.state;
    return (
      <div
        className="section common-container-center"
        style={{ height: "100vh" }}
      >
        <h1
          className="big-h1 mx16 tac"
          style={{ color: "var(--primary-text-color)" }}
        >
          Create. Customize. Convert.
        </h1>
        <h3 className="mx16 tac unimportant-text">
          Organize your marketing process with an all-in-one solution for
          unified content promotion.
        </h3>
        <div
          className="circle absolute bounce slow"
          style={{ bottom: randomInt1 + "px", left: randomInt2 + "px" }}
        />
        {!mobileAndTabletcheck() && (
          <div
            className="triangle absolute bottom triangle-bottom-change-color fast"
            style={{ bottom: randomInt3 + "px", right: randomInt4 + "px" }}
          />
        )}
        <div
          className="rectangle absolute rotate slow "
          style={{ top: randomInt5 + 50 + "px", left: randomInt6 + "px" }}
        />
      </div>
    );
  }
}

export default Section1;
