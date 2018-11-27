import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";
import faCheck from "@fortawesome/fontawesome-free-solid/faCheck";

import NonEditableAttribute from "./NonEditableAttribute";
import EditableAttribute from "./EditableAttribute";
import DropdownAttribute from "./DropdownAttribute";
import "./styles/";

class ObjectEditTable extends Component {
  state = {
    updatedObject: undefined
  };
  constructor(props) {
    super(props);

    this.updateObject = this.updateObject.bind(this);
  }

  updateObject(index, value, id) {
    let object = this.props.clickedObject;
    if (id) {
      object[index].id = id;
      object[index].name = value;
    } else {
      object[index] = value;
    }
    this.setState({ updatedObject: object });
  }

  render() {
    const { editting, objectArray } = this.props;
    let attributes = [];
    for (let index in objectArray) {
      if (objectArray[index].dropdown && editting) {
        attributes.push(
          <DropdownAttribute
            key={index}
            label={objectArray[index].index}
            value={
              objectArray[index].value
                ? objectArray[index].value
                : objectArray[index].id
            }
            dropdownList={objectArray[index].dropdownList}
            updateParentState={this.updateObject}
          />
        );
      } else if (objectArray[index].canEdit && editting) {
        attributes.push(
          <EditableAttribute
            key={index}
            label={objectArray[index].index}
            value={objectArray[index].value}
            updateParentState={this.updateObject}
          />
        );
      } else {
        attributes.push(
          <NonEditableAttribute
            key={index}
            label={objectArray[index].index}
            value={objectArray[index].value}
          />
        );
      }
    }
    let buttons;
    if (this.props.clickedObject) {
      buttons = (
        <div>
          {!editting && (
            <FontAwesomeIcon
              icon={faEdit}
              size="2x"
              className="button py4"
              style={{ color: "var(--seven-primary-color" }}
              onClick={this.props.editObject}
            />
          )}

          {editting && (
            <div className="flex">
              <FontAwesomeIcon
                icon={faCheck}
                size="2x"
                onClick={() => this.props.saveObject(this.state.updatedObject)}
                className="button py4 mr8"
                style={{ color: "var(--seven-primary-color" }}
              />
              <FontAwesomeIcon
                icon={faTimes}
                size="2x"
                onClick={this.props.editObject}
                className="button py4"
                style={{ color: "var(--red-theme-color" }}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="clicked-user-options">
        {attributes}
        {buttons}
      </div>
    );
  }
}
export default ObjectEditTable;
