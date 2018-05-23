import { combineReducers } from "redux";

function accountReducer() {
	return [];
}
function activePage(state = "", action) {
	switch (action.type) {
		case "TAB_SELECTED":
			return action.payload;
		default:
			return state;
	}
}
function currentUser(state = null, action) {
	switch (action.type) {
		case "CURRENT_USER":
			return action.payload;
		default:
			return state;
	}
}
function clientSideBar(state = false, action) {
	switch (action.type) {
		case "CLIENT_SIDE_BAR":
			return action.payload;
		default:
			return state;
	}
}

function accounts(state = [], action) {
	switch (action.type) {
		case "SOCIAL_ACCOUNTS":
			return action.payload;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	user: currentUser,
	account: accountReducer,
	activePage: activePage,
	clientSideBar: clientSideBar,
	accounts: accounts
});

export default rootReducer;
