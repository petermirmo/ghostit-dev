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

export const openHeaderSideBar = value => {
	return {
		type: "HEADER_SIDE_BAR",
		payload: value
	};
};

export const changeCampaignDateLowerBound = value => {
	return {
		type: "CAMPAIGN_DATE_LOWER_BOUND",
		payload: value
	};
};

export const changeCampaignDateUpperBound = value => {
	return {
		type: "CAMPAIGN_DATE_UPPER_BOUND",
		payload: value
	};
};
