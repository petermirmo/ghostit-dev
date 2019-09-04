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
    const { activeIndex, className, data, testMode } = this.props;
    let { active } = this.state;
    if (activeIndex) active = activeIndex;

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
