import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage } from "../../../../redux/actions/";
import "./style.css";

class BookCall extends Component {
	constructor(props) {
		super(props);
		props.setHeaderMessage(props.title);
	}
	render() {
		const { className, value, link } = this.props;
		return (
			<form action={link} target="_blank" method="get">
				<button
					className={className}
					onClick={() => {
						this.props.changePage("strategy");
					}}
				>
					{value}
				</button>
			</form>
		);
	}
}

function mapStateToProps(state) {
	return {};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ changePage: changePage }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(BookCall);
