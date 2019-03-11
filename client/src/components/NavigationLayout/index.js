import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";

class NavigationLayout extends Component {
  state = {
    active: 0
  };
  mySuperCoolFunction = index => {
    this.setState({ active: index });
  };
  render() {
    const { data } = this.props;
    const { active } = this.state;

    return (
      <GIContainer className="x-wrap">
        {data.map((value, index) => {
          let className = "";
          if (active === index) className = "test-mode";

          return (
            <GIContainer
              key={index}
              onMouseClick={() => this.mySuperCoolFunction(index)}
              className={className}
            >
              {value}
            </GIContainer>
          );
        })}
      </GIContainer>
    );
  }
}

export default NavigationLayout;
