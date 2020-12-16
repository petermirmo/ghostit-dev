import React from "react";
import GIContainer from "../../components/containers/GIContainer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";

function test() {
  return (
    <GIContainer className="flex-fill align-start column bg-five-blue pa32 br8">
      <h4 className="white mb16">Contact Information</h4>
      <a className="flex full-center gap8" href="mailto: hello@ghostit.co">
        <FontAwesomeIcon className="white" icon={faEnvelope} />
        <p className="white">hello@ghostit.co</p>
      </a>
    </GIContainer>
  );
}

export default test;
