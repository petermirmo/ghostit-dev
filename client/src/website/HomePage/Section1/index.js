import React, { Component } from "react";

class Section1 extends Component {
  constructor(props) {
    super(props);
    this.state = this.createState();
  }
  componentDidMount() {
    setInterval(() => this.setState(this.createState), 8000);
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
      <div className="section flex vc hc column">
        <h1 className="silly-font">Ghostit is the best marketing software.</h1>
        <h4>Something about Ghostit is the best</h4>
        <div
          className="circle absolute bounce slow"
          style={{ bottom: randomInt1 + "px", left: randomInt2 + "px" }}
        />
        <div
          className="triangle absolute bottom triangle-bottom-change-color fast"
          style={{ bottom: randomInt3 + "px", right: randomInt4 + "px" }}
        />
        <div
          className="rectangle absolute rotate slow "
          style={{ top: randomInt5 + 50 + "px", left: randomInt6 + "px" }}
        />
      </div>
    );
  }
}

export default Section1;
