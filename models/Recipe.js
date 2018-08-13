const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipe = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			required: true
		},
		campaignLength: Number,
		name: String,
		image: {
			url: String,
			publicID: String
		},
		posts: [
			{
				socialType: String,
				instructions: String,
				customTask: Boolean
			}
		]
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("recipes", recipe);
