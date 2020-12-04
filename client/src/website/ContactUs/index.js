import React, { useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

import Consumer, { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import AgencyForm from "../../components/forms/AgencyForm";

import { isMobileOrTablet } from "../../util";

function ContactUsPage() {
  return (
    <Page
      className="website-page align-center mt32"
      description="Contact Ghostit."
      hideForm={true}
      keywords="contact"
      title="Ghostit Marketing Solution and Agency"
    >
      <GIContainer
        className={
          "column " + (isMobileOrTablet() ? "x-fill" : "container-box large")
        }
      >
        <h2 className={"tac px32 " + (isMobileOrTablet() ? "mb32" : "mb64")}>
          Content Marketing Plans For
        </h2>
      </GIContainer>
      <GIContainer
        className={
          "x-fill flex-fill full-center " + (isMobileOrTablet() ? "py32" : "")
        }
      >
        <AgencyForm />
      </GIContainer>
    </Page>
  );
}

export default ContactUsPage;
