const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaign = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			required: true
		},
		startDate: Date,
		endDate: Date,
		color: String,
		name: String,
		recipeID: {
			type: Schema.Types.ObjectId
		},
		posts: [
			{
				id: Schema.Types.ObjectId
			}
		]
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("campaigns", campaign);
