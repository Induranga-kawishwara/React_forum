const mongoose = require("mongoose");

const repl = new mongoose.Schema(
  {
    commentID : String,
    username: String,
    email: String,
    reply: String,
  },
  {
    collection: "replyies",
  }
);

mongoose.model("replyies", repl); 