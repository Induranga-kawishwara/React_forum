const PendingComment = require("../models/PendingComment");
const ConfirmedComment = require("../models/ConfirmedComment");

exports.add = async (req, res, next) => {
  try {
    await PendingComment.create(req.body);
    res.status(201).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

exports.listPending = async (req, res, next) => {
  try {
    const comments = await PendingComment.find({});
    res.json({ status: "ok", data: comments });
  } catch (err) {
    next(err);
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pending = await PendingComment.findById(id);
    if (!pending) return res.status(404).json({ error: "Not found" });

    await ConfirmedComment.create({
      user: pending.user,
      email: pending.email,
      comment: pending.comment,
      createdAt: pending.createdAt,
    });
    await pending.deleteOne();
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

exports.deletePending = async (req, res, next) => {
  try {
    await PendingComment.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};
