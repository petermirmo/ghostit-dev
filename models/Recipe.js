const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipe = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			required: true
		},
		length: Number,
		hour: Number,
		minute: Number,
		name: String,
		image: {
			url: String,
			publicID: String
		},
		posts: [
			{
				socialType: String,
				instructions: String,
				postingDate: String
			}
		]
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("recipes", recipe);
