export const changePage = activePage => {
	return {
		type: "TAB_SELECTED",
		payload: activePage
	};
};
export const setUser = user => {
	return {
		type: "CURRENT_USER",
		payload: user
	};
};
export const openClientSideBar = value => {
	return {
		type: "CLIENT_SIDE_BAR",
		payload: value
	};
};

export const updateAccounts = value => {
	return {
		type: "SOCIAL_ACCOUNTS",
		payload: value
	};
};
