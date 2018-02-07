import React, { Component } from "react";
import "../css/theme.css";

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("myModal");

    if (event.target === modal) {
        modal.style.display = "none";
    }
};
class Modal extends Component {
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
                        <textarea rows="10" />
                    </div>
                    <button>Save Post</button>
                </div>
            </div>
        );
    }
}

export default Modal;
