import React from "react";
import GIText from "../../components/views/GIText";
import GIContainer from "../../components/containers/GIContainer";

import { isMobileOrTablet } from "../../util";

export const teamMemberDiv = (index, teamMember) => (
  <GIContainer key={index} className="fill-flex mb64">
    <div
      className={`container ${
        isMobileOrTablet() ? "x-fill" : "small"
      } pa16 br8 common-transition`}
    >
      <div className="container-box xy-200px round blue-shadow-fade mb32">
        <img alt="" className="x-200px" src={teamMember.image} />
      </div>
      <GIText className="muli ellipsis mb4" text={teamMember.name} type="h3" />
      <GIText className="bold ellipsis mb8" text={teamMember.title} type="p" />
      <GIText text={teamMember.description} type="p" />
    </div>
  </GIContainer>
);
