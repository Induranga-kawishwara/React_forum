const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    commentID: String,
    username: String,
    email: String,
    reply: String,
  },
  {
    collection: "replyies",
  }
);

module.exports = mongoose.model("Reply", replySchema);
