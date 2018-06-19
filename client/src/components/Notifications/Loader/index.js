import React, { Component } from "react";
import "./styles/";

class Loader extends Component {
	render() {
		return (
			<div className="lds-css ng-scope">
				<div style={{ width: "100%", height: "100%" }} className="lds-pacman">
					<div>
						<div />
						<div />
						<div />
					</div>
					<div>
						<div />
						<div />
					</div>
				</div>
			</div>
		);
	}
}
export default Loader;
