const mongoose = require("mongoose");

const pandin = new mongoose.Schema(
  {
    user: String,
    email : String,
    comment: String,
    // createdat : Date,
    createdAt: {
      type: Date,
      default: Date.now
    }

  },
  {
    collection: "pandincomments",
  }
);

mongoose.model("pandincomments", pandin);