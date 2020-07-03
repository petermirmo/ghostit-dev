import React from "react";
import { Link } from "react-router-dom";

import GIText from "../../components/views/GIText";
import GIContainer from "../../components/containers/GIContainer";

import { isMobileOrTablet } from "../../util";
import { createLinkFromNameAndJob } from "../../components/ghostitBlog/ViewGhostitBlog/util";

export const teamMemberDiv = (index, teamMember) => (
  <Link
    className={
      "flex container column bg-white shadow-3 common-border button-2 fill-flex pa16 mb64 br16 common-transition " +
      (isMobileOrTablet() ? "x-fill" : "mx16 small")
    }
    key={index}
    to={createLinkFromNameAndJob(
      teamMember._id,
      teamMember.name,
      teamMember.title
    )}
  >
    <div className="container-box xy-200px round blue-shadow-fade mb32">
      <img alt="" className="x-200px" src={teamMember.image} />
    </div>
    <GIText className="muli ellipsis mb4" text={teamMember.name} type="h3" />
    <GIText className="bold ellipsis mb8" text={teamMember.title} type="p" />
    <GIText
      text={teamMember.description.substring(0, 100) + "... Read More"}
      type="p"
    />
  </Link>
);
