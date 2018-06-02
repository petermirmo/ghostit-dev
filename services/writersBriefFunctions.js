const User = require("../models/User");
const Blog = require("../models/Blog");
const WritersBrief = require("../models/WritersBrief");

module.exports = {
	saveWritersBrief: function(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}

		let { writersBrief } = req.body;
		writersBrief.userID = userID;
		if (writersBrief._id) {
			WritersBrief.findOne({ _id: writersBrief._id }, function(err, foundWritersBrief) {
				if (err) {
					handleError(res, err);
					return;
				} else if (foundWritersBrief) {
					foundWritersBrief.cycleStartDate = writersBrief.cycleStartDate;
					foundWritersBrief.cycleEndDate = writersBrief.cycleEndDate;
					foundWritersBrief.socialPostsDescriptions = writersBrief.socialPostsDescriptions;
					foundWritersBrief.userID = userID;

					foundWritersBrief.save().then(result => {
						if (result === foundWritersBrief) {
							res.send({ success: true });
						} else {
							handleError(res, "Could not save your writers brief!");
							return;
						}
					});
				} else {
					handleError(res, "No writers brief found.");
					return;
				}
			});
		} else {
			let newWritersBrief = new WritersBrief(writersBrief);
			newWritersBrief.save().then(result => {
				if (result === newWritersBrief) {
					res.send({ success: true });
				} else {
					handleError(res, "Could not save your writers brief!");
					return;
				}
			});
		}
	},
	getWritersBriefs: function(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}
		WritersBrief.find({ userID: userID }, function(err, writersBriefs) {
			if (err) {
				res.send({ success: false, errorMessage: err });
			}
			res.send({ success: true, writersBriefs: writersBriefs });
		});
	},
	getBlogsInBriefs(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}
		let { cycleStartDate, cycleEndDate } = req.body;
		Blog.find({ postingDate: { $lt: cycleEndDate }, postingDate: { $gt: cycleStartDate }, userID: userID }, function(
			err,
			blogs
		) {
			if (err) {
				handleError(res, err);
				return;
			} else {
				res.send({ success: true, blogs: blogs });
			}
		});
	}
};

function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send({ success: false, errorMessage: errorMessage });
	return;
}
