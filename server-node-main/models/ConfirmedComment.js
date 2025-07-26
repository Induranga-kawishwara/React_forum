const mongoose = require("mongoose");

const confirmedSchema = new mongoose.Schema(
  {
    user: String,
    email: String,
    comment: String,
    createdAt: Date,
  },
  {
    collection: "conformcomments",
  }
);

module.exports = mongoose.model("ConfirmedComment", confirmedSchema);
