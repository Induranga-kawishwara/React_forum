const Reply = require("../models/Reply");

exports.add = async (req, res, next) => {
  try {
    await Reply.create(req.body);
    res.status(201).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

exports.listByComment = async (req, res, next) => {
  try {
    const replies = await Reply.find({ commentID: req.params.commentId });
    res.json({ status: "ok", data: replies });
  } catch (err) {
    next(err);
  }
};
