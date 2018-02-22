import React, { Component } from "react";
import "../../css/theme.css";
import DatePicker from "../DatePickerComponent.js";
import TimePicker from "../TimePickerComponent.js";

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    // Turn off posting modal
    var postingModal = document.getElementById("myModal");
    if (event.target === postingModal) {
        postingModal.style.display = "none";
        return;
    }

    // Turn off facebook pages modal
    var facebookModal = document.getElementById("FacebookModal");
    if (event.target === facebookModal) {
        facebookModal.style.display = "none";
        return;
    }
};
function savePost() {
    //var content = document.getElementById("contentPostingTextarea").value;
    var date = document
        .getElementById("contentDatePickerPopUp")
        .getAttribute("getdate");
    var time = document
        .getElementById("contentTimePickerPopUp")
        .getAttribute("gettime");

    var postingDate = new Date(date);
    var postingTime = new Date(time);
    postingDate.setTime(postingTime.getTime());
}

class Modal extends Component {
    componentDidMount() {}
    render() {
        return (
            <div id="myModal" className="modal">
                <div className="modal-content" style={{ textAlign: "center" }}>
                    <div className="modal-header">
                        <span className="close" onClick={() => closeModal()}>
                            &times;
                        </span>
                        <h2>New Post</h2>
                    </div>

                    <div className="modal-body">
                        <textarea
                            id="contentPostingTextarea"
                            className="postingTextArea"
                            rows="10"
                            placeholder="Success doesn't write itself!"
                        />
                        <DatePicker
                            clickedCalendarDate={this.props.clickedCalendarDate}
                        />
                        <TimePicker timeForPost={this.props.timeForPost} />
                    </div>

                    <div className="modal-footer">
                        <button onClick={() => savePost()}>Save Post</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
