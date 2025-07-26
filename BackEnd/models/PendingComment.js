const mongoose = require("mongoose");

const pendingSchema = new mongoose.Schema(
  {
    user: String,
    email: String,
    comment: String,
  },
  {
    collection: "pandincomments",
    timestamps: { createdAt: "createdAt" },
  }
);

module.exports = mongoose.model("PendingComment", pendingSchema);
