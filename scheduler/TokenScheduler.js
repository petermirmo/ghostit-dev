const Account = require("../models/Account");

var facebook = require("./facebook");
var linkedin = require("./linkedin");
module.exports = {
	main: function() {
		// Get all accounts that have not been updated in 21 days
		Account.find({ lastRenewed: { $lt: new Date() - 1814400000 }, socialType: "facebook" }, function(err, oldAccounts) {
			let arrayOfUniqueSocialIDs = getRidOfDuplicateSocialIDs(oldAccounts);

			// Loop through all accounts
			for (let index in arrayOfUniqueSocialIDs) {
				let account = arrayOfUniqueSocialIDs[index];
				// Make sure it has a socialID
				// Find all accounts with the same socialID becuase they will use the same auth token
				Account.find({ socialID: account.socialID }, function(err, accountsOfSameSocialID) {
					if (accountsOfSameSocialID[0].socialType === "facebook") {
						if (accountsOfSameSocialID[0].accountType === "profile") {
							facebook.renewAuthToken(accountsOfSameSocialID);
						} else if (accountsOfSameSocialID[0].accountType === "page")
							facebook.renewPageToken(accountsOfSameSocialID);
					}
				});
			}
		});
	}
};
function getRidOfDuplicateSocialIDs(oldAccounts) {
	oldAccounts.sort(compareSocialIDs);
	let arrayOfUniqueAccounts = [];
	for (let i = 0; i < oldAccounts.length; i++) {
		if (oldAccounts[i].socialID) {
			if (oldAccounts[i + 1]) {
				if (oldAccounts[i + 1].socialID !== oldAccounts[i].socialID) {
					arrayOfUniqueAccounts.push(oldAccounts[i]);
				}
			} else {
				arrayOfUniqueAccounts.push(oldAccounts[i]);
			}
		}
	}
	return arrayOfUniqueAccounts;
}
function compareSocialIDs(a, b) {
	if (a.socialID < b.socialID) return -1;
	if (a.socialID > b.socialID) return 1;
	return 0;
}
