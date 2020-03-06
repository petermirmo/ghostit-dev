import React, { Component } from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import { getTextFromHtmlTag, isAdmin } from "../../util";

class Blog extends Component {
  findFirstImage = images => {
    let location = images[0].location;
    let indexOfSmallestLocation = 0;
    for (let index in images) {
      if (images[index].location < location) indexOfSmallestLocation = index;
    }
    return indexOfSmallestLocation;
  };
  render() {
    const { ghostitBlog, user } = this.props; // Variables

    const { contentArray, createdAt, images } = ghostitBlog;
    const ghostitBlogDate = new moment(createdAt);

    let temp = document.createElement("div");
    if (contentArray[1])
      temp.innerHTML =
        "<div   dangerouslySetInnerHTML={{__html: " + contentArray[1].html + "";

    const metaDescription = temp.textContent || temp.innerText || "";

    return (
      <GIContainer className="x-fill relative">
        <Link
          className="x-fill column common-border one-blue shadow-3 button relative br16"
          to={"/blog/" + ghostitBlog.url}
        >
          <GIContainer className="column pa32">
            <GIContainer
              className="image-cover x-fill relative br8"
              style={
                images[0]
                  ? {
                      backgroundImage:
                        "url(" + images[this.findFirstImage(images)].url + ")"
                    }
                  : {}
              }
            ></GIContainer>
            {ghostitBlog.contentArray[0] && (
              <GIContainer className="column pt16">
                <GIText
                  className="muli"
                  text={getTextFromHtmlTag(ghostitBlog.contentArray[0].html)}
                  type="h4"
                />
                {ghostitBlog.contentArray[1] && (
                  <GIText
                    className="pt8"
                    text={
                      getTextFromHtmlTag(
                        ghostitBlog.contentArray[1].html
                      ).substring(0, 150) + "... Read More"
                    }
                    type="p"
                  />
                )}
              </GIContainer>
            )}
          </GIContainer>
          <GIContainer className="absolute bottom--16 left-0 right-0 round-icon common-border four-blue margin-hc round bg-white shadow-blue-2 full-center">
            <FontAwesomeIcon icon={faAngleRight} />
          </GIContainer>
        </Link>
        {isAdmin(user) && (
          <Link to={"/manage/" + ghostitBlog._id}>
            <FontAwesomeIcon
              className="icon-regular-button absolute bottom right"
              icon={faEdit}
            />
          </Link>
        )}
      </GIContainer>
    );
  }
}

export default Blog;
