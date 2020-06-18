import React from "react";
import { Link } from "react-router-dom";

import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";

import { teamMembers } from "../../../website/TeamPage/teamMembers";

export const createLinkFromNameAndJob = (id, name, title) => {
  return (
    "/team-member/" +
    (title.replace(/[^a-zA-Z ]/g, "") + "/" + name.replace(/[^a-zA-Z ]/g, ""))
      .replace(/ /g, "-")
      .toLowerCase() +
    "/" +
    id
  );
};
const getTeamMember = authorID => {
  const foundMember = teamMembers.find(something => something._id === authorID);

  if (!foundMember) return undefined;

  return { title: foundMember.title, name: foundMember.name };
};

export const createBlogDivs = (authorID, contentImagesArray) => {
  const blogDivs = [];
  for (let index = 0; index < contentImagesArray.length; index++) {
    if (index === 1 && authorID && getTeamMember(authorID)) {
      blogDivs.push(
        <GIContainer className="mb8" key="1ts">
          <GIText className="grey" text="By&nbsp;" type="p" />
          <Link
            to={createLinkFromNameAndJob(
              authorID,
              getTeamMember(authorID).name,
              getTeamMember(authorID).title
            )}
          >
            <GIText
              className="five-blue"
              text={getTeamMember(authorID).name}
              type="p"
            />
          </Link>
        </GIContainer>
      );
    }
    const contentOrImage = contentImagesArray[index];
    if (!contentOrImage) continue;
    if (!contentOrImage.html) {
      if (contentOrImage.size === "small") {
        blogDivs.push(createSmallDiv(contentImagesArray, index));
        index += 1;
      } else {
        blogDivs.push(createRelevantImageDiv(contentImagesArray[index], index));
      }
    } else {
      blogDivs.push(
        <div
          className="mb8"
          dangerouslySetInnerHTML={{ __html: contentOrImage.html }}
          key={index}
        />
      );
    }
  }
  return blogDivs;
};

export const createContentImagesArray = (contentArray, images) => {
  const contentImagesArray = [];

  for (let index in images) {
    const image = images[index];
    if (!image) continue;
    contentImagesArray[image.location] = image;
  }
  for (let index in contentArray) {
    const content = contentArray[index];
    if (!content) continue;
    contentImagesArray[content.location] = content;
  }

  return contentImagesArray;
};

const createRelevantImageDiv = (image, index) => {
  return (
    <img
      alt="Blog"
      className={
        "float-left ov-hidden image mb8 br8 " +
        image.size +
        (image.size === "medium" ? "" : " mr16")
      }
      key={index + "image"}
      src={image.file || image.url}
    />
  );
};

const createSmallDiv = (contentImagesArray, index) => {
  const imageDiv = createRelevantImageDiv(contentImagesArray[index], index);
  let text;
  if (
    contentImagesArray[Number(index) + 1] &&
    contentImagesArray[Number(index) + 1].html
  )
    text = (
      <div
        className="mb8"
        key={index}
        dangerouslySetInnerHTML={{
          __html: contentImagesArray[Number(index) + 1].html
        }}
      />
    );
  return (
    <GIContainer key={index}>
      <GIContainer className="block container-box large">
        {imageDiv}
        {text}
      </GIContainer>
    </GIContainer>
  );
};
