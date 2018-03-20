import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Content from "./pages/ContentPage";
import Profile from "./pages/Profile";
import Strategy from "./pages/StrategyPage";

class Routes extends Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					<Route path="/" exact={true} component={LoginPage} />
					<Route path="/content" exact={true} component={Content} />
					<Route path="/profile" exact={true} component={Profile} />
					<Route path="/strategy" exact={true} component={Strategy} />
				</div>
			</BrowserRouter>
		);
	}
}

export default Routes;
