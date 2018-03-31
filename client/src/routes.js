import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage/index";
import Content from "./pages/ContentPage/index";
import Profile from "./pages/ProfilePage/index";
import Strategy from "./pages/StrategyPage/index";
import Manage from "./pages/ManagePage/index";
import "./css/theme.css";

class Routes extends Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					<Route path="/" exact={true} component={LoginPage} />
					<Route path="/content" exact={true} component={Content} />
					<Route path="/profile" exact={true} component={Profile} />
					<Route path="/strategy" exact={true} component={Strategy} />
					<Route path="/manage" exact={true} component={Manage} />
				</div>
			</BrowserRouter>
		);
	}
}

export default Routes;
