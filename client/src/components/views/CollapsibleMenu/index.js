import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import GIContainer from "../../containers/GIContainer";
import GIText from "../GIText";
import Dropdown from "../Dropdown";

class CollapsibleMenu extends Component {
  state = {
    showMenu: true
  };
  render() {
    const { showMenu } = this.state;
    const {
      activeIcon,
      activeIndex,
      list,
      listObjKey,
      options,
      testMode,
      title,
      titleIcon
    } = this.props; // Variables
    const { handleParentChange } = this.props; // Functions

    return (
      <GIContainer className="column" testMode={testMode}>
        <GIContainer
          className="x-fill align-center justify-between clickable bg-blue-grey px16 py8"
          onClick={() => {
            this.setState({ showMenu: !showMenu });
          }}
        >
          <GIContainer className="align-center mr16">
            <FontAwesomeIcon className="white mr8" icon={titleIcon} />
            <GIText className="white" text={title} type="h6" />
          </GIContainer>
          <FontAwesomeIcon
            className="white"
            icon={showMenu ? faAngleDown : faAngleUp}
            size="2x"
          />
        </GIContainer>
        {showMenu && (
          <GIContainer className="column">
            {list.map((obj, index) => (
              <GIContainer
                className={`${
                  activeIndex === index ? "bg-blue-fade-2" : ""
                } justify-between align-center px16 py8`}
                key={index}
              >
                <GIText
                  className={activeIndex === index ? "white" : ""}
                  text={listObjKey ? list[index][listObjKey] : list[index]}
                  type="p"
                />
                <GIContainer>
                  {activeIndex === index && activeIcon && (
                    <FontAwesomeIcon className="white mr8" icon={activeIcon} />
                  )}
                  {options && (
                    <Dropdown
                      className=""
                      dontShowFaAngleDown={true}
                      dropdownActiveDisplayClassName=""
                      dropdownClassName="right common-border five-blue br8"
                      dropdownItems={options.map((obj, index) => obj.name)}
                      dropdownTextClassName="fs-13"
                      handleParentChange={dropdownClickedItemObj => {}}
                      noTopBorder={true}
                      title={<FontAwesomeIcon icon={faEllipsisV} />}
                    />
                  )}
                </GIContainer>
              </GIContainer>
            ))}
          </GIContainer>
        )}
      </GIContainer>
    );
  }
}
export default CollapsibleMenu;
