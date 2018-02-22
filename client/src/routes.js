import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Content from "./pages/ContentPage";
import Profile from "./pages/Profile";

class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact={true} component={LoginPage} />
                    <Route path="/content" exact={true} component={Content} />
                    <Route path="/profile" exact={true} component={Profile} />
                </div>
            </BrowserRouter>
        );
    }
}

export default Routes;
