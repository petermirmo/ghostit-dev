import React, { Component } from "react";

import GIContainer from "../../containers/GIContainer";

class NavigationLayout extends Component {
  state = {
    active: 0
  };
  setActive = index => {
    this.setState({ active: index });
  };

  render() {
    const { className, data, testMode } = this.props;
    const { active } = this.state;

    return (
      <GIContainer className={className} testMode={testMode}>
        {data.map((reactElement, index) => {
          let className = reactElement.props.className;
          if (index === active) className += " active";
          return React.cloneElement(reactElement, {
            key: index,
            className,
            onClick: () => {
              reactElement.props.onClick();
              this.setActive(index);
            }
          });
        })}
      </GIContainer>
    );
  }
}

export default NavigationLayout;
