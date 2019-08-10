import React from "react";

export const createColorDivs = (campaign, colors, handleChange) => {
  const colorDivs = [];

  for (let index in colors) {
    let isActive;
    if (colors[index].color === campaign.color) isActive = "active";
    colorDivs.push(
      <div
        className={"color-border mx4 pa4 round button " + isActive}
        style={{
          borderColor: colors[index].color
        }}
        onClick={() => {
          handleChange(colors[index].color, "color");
        }}
        key={index}
      >
        <div
          className="color round"
          style={{
            backgroundColor: colors[index].color
          }}
        />
      </div>
    );
  }

  return colorDivs;
};
