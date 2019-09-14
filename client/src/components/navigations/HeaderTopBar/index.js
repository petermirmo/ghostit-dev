import React, { Component } from "react";

import Logo from "../WebsiteHeader/Logo";

import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import Consumer, { NotificationContext } from "../../../context";

class HeaderTopBar extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <GIContainer className="pb4">
            <GIContainer className="full-center mt4" style={{ width: "100px" }}>
              <Logo
                className="x-40"
                displayText={false}
                style={{ minWidth: "40px" }}
              />
            </GIContainer>
            <GIContainer className="fill-flex align-end justify-end">
              {context.user && context.user.image.url && (
                <GIContainer className="relative mx16">
                  <img
                    className="ov-hidden xy-48px round"
                    src={context.user.image.url}
                  />
                  <GIContainer
                    className="absolute round"
                    style={{
                      top: "-6px",
                      right: "-6px",
                      bottom: "-6px",
                      left: "-6px",
                      opacity: "0.14",
                      backgroundColor: "#1a1919"
                    }}
                  />
                </GIContainer>
              )}
            </GIContainer>
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

export default HeaderTopBar;
