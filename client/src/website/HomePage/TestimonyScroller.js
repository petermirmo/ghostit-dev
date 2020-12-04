import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltLeft } from "@fortawesome/pro-regular-svg-icons/faArrowAltLeft";
import { faArrowAltRight } from "@fortawesome/pro-regular-svg-icons/faArrowAltRight";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class TestimonyScroller extends Component {
  state = {
    activeTestimonyIndex: 0,
    direction: "right",
    testimonies: [
      {
        companyName: "North Digital",
        link: "https://www.north.digital/",
        photo:
          "https://res.cloudinary.com/ghostit-co/image/upload/v1592513270/pasted_image_0_1.png",
        review:
          "\"Repeatedly running digital campaigns for multiple clients can get both cumbersome and at times confusing. Ghostit's platform lets me schedule all of my client's marketing initiatives unlike any other platform and keep them all organized.\""
      },
      {
        companyName: "Dodd's Furniture",
        link: "https://doddsfurniture.com/",
        photo:
          "https://res.cloudinary.com/ghostit-co/image/upload/v1592513270/pasted_image_0.png",
        review:
          '"Since we started working with you and your team the blog posts and social content have improved tremendously. We are proud of our content and extremely pleased that Ghostit was able to produce everything so quickly."'
      },
      {
        companyName: "Bennefield Construction",
        link: "http://bennefieldconstruction.ca/",
        photo:
          "https://res.cloudinary.com/ghostit-co/image/upload/v1592513270/Bennefield-Construction-Social-Profile_rectangle.png",
        review:
          '"Ghostit has been an incredible company to deal with! They’re super flexible, accessible, and they REALLY know the ins and outs of content strategy! It’s incredible how many leads we’ve gained who then converted to customers since they started doing our content."'
      }
    ]
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  moveTestimony = (amountToMoveBy, direction) => {
    const { activeTestimonyIndex, testimonies } = this.state;
    const amountOfTestimonies = testimonies.length;

    if (amountToMoveBy + activeTestimonyIndex < 0)
      return this.handleChange({
        activeTestimonyIndex: amountOfTestimonies - 1,
        direction
      });
    else if (amountToMoveBy + activeTestimonyIndex > amountOfTestimonies - 1)
      return this.handleChange({ activeTestimonyIndex: 0, direction });
    else
      return this.handleChange({
        activeTestimonyIndex: activeTestimonyIndex + amountToMoveBy,
        direction
      });
  };
  render() {
    const { activeTestimonyIndex, direction, testimonies } = this.state;

    return (
      <GIContainer className="bg-blue-fade-2 x-fill relative">
        <GIContainer
          className={
            "clickable full-center " + (isMobileOrTablet() ? "px4" : "px64")
          }
          onClick={() => this.moveTestimony(-1, "left")}
        >
          <FontAwesomeIcon icon={faArrowAltLeft} size="2x" />
        </GIContainer>
        {testimonies.map((activeTestimony, index) => {
          if (activeTestimonyIndex === index)
            return (
              <GIContainer
                className={"flex-fill column full-center " + direction}
                key={index}
              >
                <GIText
                  className="tac white muli fs-26 mt32"
                  text="Here's What"
                  type="h2"
                />
                <GIText
                  className="tac white muli"
                  text="Our Customers Are Saying"
                  type="h2"
                />
                <GIContainer
                  className="ov-hidden bg-white mt32"
                  style={{ width: "180px" }}
                >
                  <a href={activeTestimony.link} target="_blank">
                    <img
                      alt=""
                      className="x-fill"
                      src={activeTestimony.photo}
                    />
                  </a>
                </GIContainer>
                <GIText
                  className={`white tac mt32 ${
                    isMobileOrTablet() ? "x-fill px8" : "container-box large "
                  }`}
                  text={activeTestimony.review}
                  type="p"
                />
                <a
                  href={activeTestimony.link}
                  style={{ zIndex: 2 }}
                  target="_blank"
                >
                  <GIText
                    className="bold white tac mt8 mb32"
                    text={activeTestimony.companyName}
                    type="p"
                  />
                </a>
              </GIContainer>
            );
        })}
        <GIContainer
          className={
            "clickable full-center " + (isMobileOrTablet() ? "px4" : "px64")
          }
        >
          <FontAwesomeIcon
            icon={faArrowAltRight}
            onClick={() => this.moveTestimony(1, "right")}
            size="2x"
            style={{ backgroundColor: "transparent" }}
          />
        </GIContainer>
        <img
          alt=""
          className="absolute bottom-0 x-fill"
          src={require("../../svgs/home-8.svg")}
        />
      </GIContainer>
    );
  }
}
export default TestimonyScroller;
