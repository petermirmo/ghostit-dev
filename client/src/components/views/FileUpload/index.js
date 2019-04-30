import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faUpload from "@fortawesome/fontawesome-free-solid/faUpload";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import GIContainer from "../../containers/GIContainer";

import { isImage, isVideo, showFiles, removeFile } from "./util";
import "./style.css";

class FileUpload extends Component {
  render() {
    const { handleParentChange } = this.props; // Functions
    const {
      className = "br8",
      canEdit = true,
      currentFiles = [],
      fileIcon = faUpload,
      fileLimit = 4,
      filesToDelete = [],
      hideUploadButton = false,
      id = String(Math.random()),
      imageClassName,
      imageContainerClassName,
      imageOnly
    } = this.props; // Variables

    return (
      <GIContainer className="align-center">
        {!hideUploadButton && currentFiles.length < fileLimit && canEdit && (
          <GIContainer>
            <label
              htmlFor={id}
              className={`custom-file-upload pa16 clickable full-center flex ${className}`}
            >
              <FontAwesomeIcon icon={fileIcon} className="px4" />
            </label>

            <input
              id={id}
              type="file"
              onChange={event =>
                showFiles(
                  event,
                  currentFiles,
                  fileLimit,
                  handleParentChange,
                  imageOnly
                )
              }
              multiple
            />
          </GIContainer>
        )}

        {currentFiles.map((file, index) => {
          return (
            <GIContainer
              key={index}
              className={`relative ml8 uploaded-file ${imageContainerClassName}`}
            >
              {isImage(file) && (
                <img
                  alt="error"
                  className={imageClassName}
                  src={file.file ? file.file : file.url}
                />
              )}
              {isVideo(file) && (
                <video
                  alt="error"
                  className={imageClassName}
                  src={file.file ? file.file : file.url}
                />
              )}
              {canEdit && (
                <FontAwesomeIcon
                  icon={faTimes}
                  className="icon-x-hover"
                  onClick={() =>
                    removeFile(
                      currentFiles,
                      filesToDelete,
                      handleParentChange,
                      index
                    )
                  }
                  size="3x"
                />
              )}
            </GIContainer>
          );
        })}
      </GIContainer>
    );
  }
}

export default FileUpload;
