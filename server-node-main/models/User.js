const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
  },
  {
    collection: "UserInfo",
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
