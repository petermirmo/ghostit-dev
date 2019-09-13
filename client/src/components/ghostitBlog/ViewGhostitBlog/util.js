import React from "react";
import GIContainer from "../../containers/GIContainer";

export const createBlogDivs = contentImagesArray => {
  const blogDivs = [];
  for (let index = 0; index < contentImagesArray.length; index++) {
    const contentOrImage = contentImagesArray[index];
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
          key={index}
          dangerouslySetInnerHTML={{ __html: contentOrImage.html }}
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
        "ov-hidden image my8 br8 " +
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
        key={index}
        dangerouslySetInnerHTML={{
          __html: contentImagesArray[Number(index) + 1].html
        }}
      />
    );
  return (
    <GIContainer key={index}>
      {imageDiv}
      {text}
    </GIContainer>
  );
};
