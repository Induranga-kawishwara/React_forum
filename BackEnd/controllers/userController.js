const User = require("../models/User");

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({ status: "ok", data: users });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.userEmail });
    res.json({ status: "ok", data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.json({ status: "ok", message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
