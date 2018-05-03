import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducers/";

const store = createStore(reducers);

ReactDOM.render(
	<Provider store={store}>
		<Routes />
	</Provider>,
	document.getElementById("root")
);
