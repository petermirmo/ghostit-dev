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

function headerSideBar(state = false, action) {
	switch (action.type) {
		case "HEADER_SIDE_BAR":
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

function campaignDateLowerBound(state = null, action) {
	switch (action.type) {
		case "CAMPAIGN_DATE_LOWER_BOUND":
			return action.payload;
		default:
			return state;
	}
}

function campaignDateUpperBound(state = null, action) {
	switch (action.type) {
		case "CAMPAIGN_DATE_UPPER_BOUND":
			return action.payload;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	user: currentUser,
	account: accountReducer,
	activePage,
	clientSideBar,
	headerSideBar,
	accounts,
	campaignDateLowerBound,
	campaignDateUpperBound
});

export default rootReducer;
