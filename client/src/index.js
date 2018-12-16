import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ReactGA from "react-ga";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./redux/reducers/";

import Routes from "./pages";

import "./theme.css";

require("../public/favicon.ico");

ReactGA.initialize("UA-121236003-1");
ReactGA.pageview("/team");
ReactGA.pageview("/pricing");
ReactGA.pageview("/agency");
ReactGA.pageview("/blog");
ReactGA.pageview("/terms-of-service");
ReactGA.pageview("/privacy-policy");
ReactGA.pageview("/sign-in");
ReactGA.pageview("/sign-up");
ReactGA.pageview("/blog/how-to-pitch-like-steve-jobs");
ReactGA.pageview(
  "/blog/ghostit-founders-talk-content-marketing-and-their-start-up-journey"
);

function logger({ getState }) {
  return next => action => {
    const returnValue = next(action);
    return returnValue;
  };
}
const store = createStore(reducers, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById("root")
);
