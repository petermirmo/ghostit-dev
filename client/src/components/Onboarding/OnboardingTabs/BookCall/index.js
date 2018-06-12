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
			<form>
				<button
					className={className}
					onClick={() => {
						window.open(link);
						this.props.changePage("strategy");
					}}
					type="submit"
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
