import React, { Component } from "react";

import CollapsibleMenu from "../../../components/views/CollapsibleMenu";
import GIButton from "../../../components/views/GIButton";
import GIInput from "../../../components/views/GIInput";
import GIText from "../../../components/views/GIText";
import GIContainer from "../../../components/containers/GIContainer";

class CalendarSideBar extends Component {
  state = { collapseMenu: false };
  render() {
    const { calendars } = this.props;

    return (
      <GIContainer>
        <CollapsibleMenu />
      </GIContainer>
    );
  }
}

export default CalendarSideBar;
