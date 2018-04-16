import React, { Component } from "react";

import "./style.css";

class ObjectEditTable extends Component {
	componentDidMount = () => {
		const timeOut = 5000;
		if (timeOut !== 0) {
			this.timer = setTimeout(this.requestHide, timeOut);
		}
	};

	componentWillUnmount = () => {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	};
	requestHide = () => {
		const { callback } = this.props;
		if (callback) {
			callback();
		}
	};

	render() {
		const { title, message, notificationType } = this.props;

		return (
			<div className={"notification " + notificationType}>
				<span className="closebtn" onClick={this.requestHide}>
					&times;
				</span>
				<strong>{title}</strong>
				{message}
			</div>
		);
	}
}
export default ObjectEditTable;
