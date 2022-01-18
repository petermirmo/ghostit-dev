import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";

import { Link, withRouter } from "react-router-dom";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Page from "../../components/containers/Page";

import { isMobileOrTablet } from "../../util";

class ThankYouPage extends Component {
  componentDidMount() {
    const script = document.createElement("script");

    script.src = `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '331605847504957');
fbq('track', 'PageView');
fbq('track', 'Schedule');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=331605847504957&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->`;
    script.async = true;

    document.body.appendChild(script);
  }
  render() {
    return (
      <Page
        className="website-page align-center"
        description=""
        hideForm={true}
        keywords="content creators"
        title=""
      >
        <GIContainer
          className={`justify-center x-fill ${
            isMobileOrTablet() ? "column mb32 " : "reverse"
          }`}
          style={{ minHeight: "90vh" }}
        >
          {isMobileOrTablet() && (
            <img
              alt="blob"
              id="blob-under-login"
              src={require("../../svgs/blob-under-login.svg")}
              style={{ width: "95vw" }}
            />
          )}

          <GIContainer
            className={`column full-center px32 pb64 mb32 ${
              isMobileOrTablet() ? "x-fill pt64 " : "container-box extra-large"
            }`}
          >
            <GIText className="tac bold muli mb16" type="h2">
              Thank you for getting in touch with us! We look forward to
              speaking with you and will reach out to you within one business
              day.
            </GIText>
            <GIText
              className="fs-18 tac mb32"
              text="Ghostit is an all-in-one content marketing solution that blends the benefits of real people with strategy-based technology. Our goal: to create compelling content that increases your web traffic and converts visitors into customers."
              type="h4"
            />
            <Link
              className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
              to="/blog"
            >
              Head to Our Blog
            </Link>
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default ThankYouPage;
