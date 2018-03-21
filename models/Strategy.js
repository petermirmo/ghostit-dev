const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const strategySchema = new Schema({
	userID: String,
	questionnaire: String,
	audience: String,
	styleAndStructure: String,
	brandVoice: String,
	content: String,
	notes: String,
	competitors: []
});

module.exports = mongoose.model("strategys", strategySchema);
