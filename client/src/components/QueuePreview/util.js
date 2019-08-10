import React from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FileUpload from "../views/FileUpload/";

import { getPostIcon, getPostColor } from "../../componentFunctions";

export const createQueuePostDiv = (index, onSelectPost, post) => {
  let content = post.content;
  if (post.socialType === "custom") content = post.instructions;
  if (post.socialType === "newsletter") content = post.notes;
  if (post.socialType === "blog") content = post.title;

  return (
    <div
      key={index}
      className="queue-post-container flex py8 button"
      onClick={() => onSelectPost(post)}
    >
      <div className="queue-post-attribute flex">
        {getPostIcon(post.socialType) && (
          <FontAwesomeIcon
            icon={getPostIcon(post.socialType)}
            size="2x"
            style={{ color: getPostColor(post.socialType) }}
          />
        )}
        {!getPostIcon(post.socialType) && <div>{post.socialType}</div>}
      </div>

      <div className="queue-post-attribute">
        {new moment(post.postingDate).format("LLL")}
      </div>
      <div className="queue-post-attribute important">{content}</div>
      <div className="queue-post-attribute">
        <FileUpload
          currentFiles={post.files ? post.files : []}
          hideUploadButton={true}
          id="xyz"
          imageClassName="flex image tiny"
        />
      </div>
    </div>
  );
};
