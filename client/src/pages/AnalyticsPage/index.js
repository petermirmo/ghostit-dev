import React, { Component } from "react";

import OptionModal from "../../components/OptionModal";
import "./styles/";

class Analytics extends Component {
	state = {
		optionalModal: false
	};
	openSomething = boolean => {
		this.setState({ optionalModal: boolean });
	};
	render() {
		const { optionalModal } = this.state;
		return (
			<div className="wrapper" style={this.props.margin}>
				<div className="coming-soon center">Coming Soon!!!</div>
				<button className="activate-test-button" onClick={() => this.openSomething(true)}>
					Click Here!
				</button>
				{optionalModal && <OptionModal something={this.openSomething} />}
			</div>
		);
	}
}
export default Analytics;
