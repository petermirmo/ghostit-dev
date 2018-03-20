import React, { Component } from "react";

import "../css/theme.css";
import Header from "../components/HeaderComponent";
import StrategyForm from "../components/forms/StrategyForm";
import SideBar from "../components/SideBar";

class Content extends Component {
	render() {
		return (
			<div id="wrapper" style={{ backgroundColor: "var(--light-blue-theme-color)" }}>
				<Header activePage="strategy" />
				<SideBar />

				<div id="main">
					<div className="container-full center">
						<StrategyForm />
					</div>
				</div>
			</div>
		);
	}
}

export default Content;
