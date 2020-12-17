import React, { useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

import Consumer, { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import AgencyForm from "../../components/forms/AgencyForm";
import AgencyContactactInformation from "./AgencyContactactInformation";

import { isMobileOrTablet } from "../../util";

function ContactUsPage({ history }) {
  return (
    <Page
      className="website-page pb32"
      description="Contact Ghostit."
      hideForm={true}
      keywords="contact"
      title="Ghostit Marketing Solution and Agency"
    >
      <GIContainer className="column align-center px32 pt32 pb64">
        <GIContainer className="column mb32">
          <h1 className="primary-font tac mb8">Contact Us</h1>
          <p className="tac">We can't wait to hear from you!</p>
        </GIContainer>

        <GIContainer
          className={
            "justify-center wrap reverse bg-white shadow br8 " +
            (isMobileOrTablet() ? "" : "")
          }
        >
          <AgencyForm history={history} />
          <AgencyContactactInformation />
        </GIContainer>
      </GIContainer>
    </Page>
  );
}

export default ContactUsPage;
