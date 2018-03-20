import React, { Component } from "react";

import "../css/theme.css";
import Header from "../components/HeaderComponent";
import StrategyForm from "../components/forms/StrategyForm";
import SideBar from "../components/SideBar";

class Content extends Component {
	render() {
		return (
			<div id="wrapper">
				<Header activePage="strategy" />
				<SideBar />

				<div className="center">
					<StrategyForm />
				</div>
			</div>
		);
	}
}

export default Content;
