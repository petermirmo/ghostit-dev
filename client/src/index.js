import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./redux/reducers/";
require("../public/favicon.ico");

function logger({ getState }) {
	return next => action => {
		const returnValue = next(action);
		return returnValue;
	};
}
const store = createStore(reducers, applyMiddleware(logger));

ReactDOM.render(
	<Provider store={store}>
		<Routes />
	</Provider>,
	document.getElementById("root")
);
