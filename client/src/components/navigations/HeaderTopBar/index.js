import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-solid-svg-icons";

import Logo from "../WebsiteHeader/Logo";

import GIButton from "../../views/GIButton";
import GIContainer from "../../containers/GIContainer";

import Consumer, { ExtraContext } from "../../../context";

class HeaderTopBar extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <GIContainer className="">
            <GIContainer className="full-center mt4" style={{ width: "100px" }}>
              <Logo
                className="x-40 pb4"
                displayText={false}
                style={{ minWidth: "40px" }}
              />
            </GIContainer>
            <GIContainer className="fill-flex justify-end">
              {context.user && context.user.image && context.user.image.url && (
                <Link
                  to="/profile"
                  className="flex button show-more-parent full-center border-left px16"
                >
                  <GIContainer className="relative">
                    <img
                      className="ov-hidden xy-36px round"
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
                    <GIContainer className="show-more bottom center-horizontally pa4">
                      <FontAwesomeIcon icon={faAngleDown} />
                    </GIContainer>
                  </GIContainer>
                </Link>
              )}
            </GIContainer>
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

export default HeaderTopBar;
