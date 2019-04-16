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
      canEdit = true,
      currentFiles = [],
      fileIcon = faUpload,
      fileLimit = 4,
      filesToDelete = [],
      hideUploadButton = false,
      id = String(Math.random())
    } = this.props; // Variables

    return (
      <GIContainer className="align-center">
        {!hideUploadButton && currentFiles.length < fileLimit && canEdit && (
          <GIContainer>
            <label
              htmlFor={id}
              className="custom-file-upload pa16 br8 clickable"
            >
              <FontAwesomeIcon icon={fileIcon} className="px4" />
            </label>

            <input
              id={id}
              type="file"
              onChange={event =>
                showFiles(event, currentFiles, fileLimit, handleParentChange)
              }
              multiple
            />
          </GIContainer>
        )}

        {currentFiles.map((file, index) => {
          return (
            <GIContainer key={index} className="relative ml8 uploaded-file">
              {isImage(file) && (
                <img
                  alt="error"
                  className="flex image tiny"
                  src={file.previewUrl ? file.previewUrl : file.url}
                />
              )}
              {isVideo(file) && (
                <video
                  alt="error"
                  className="flex image tiny"
                  src={file.previewUrl ? file.previewUrl : file.url}
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
