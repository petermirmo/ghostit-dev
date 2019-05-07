import React from "react";
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./redux/reducers/";
import { GIProvider } from "./context";

import Routes from "./pages";
require("../public/favicon.ico");

import "./theme.css";

function logger({ getState }) {
  return next => action => {
    const returnValue = next(action);
    return returnValue;
  };
}
const store = createStore(reducers, applyMiddleware(logger));

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  hydrate(
    <GIProvider>
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    </GIProvider>,
    rootElement
  );
} else {
  render(
    <GIProvider>
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    </GIProvider>,
    rootElement
  );
}
