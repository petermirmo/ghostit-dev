const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const calendarSchema = new Schema(
  {
    adminID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    userIDs: [
      {
        type: Schema.Types.ObjectId
      }
    ],
    emailsInvited: [
      // when a user invites someone to the calendar, they invite the person's email.
      // when a user is logged in with that email, they will be presented with a notification offering to join the calendar
      // when they accept the invite, their userID will be added to the userIDs array and their email will be removed from this array
      // this allows emails to be invited and treated the same whether they have an account already or not
      {
        type: String
      }
    ],
    calendarName: {
      type: String,
      required: true
    },
    accountIDs: [
      {
        type: Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("calendars", calendarSchema);
