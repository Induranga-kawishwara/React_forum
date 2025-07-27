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
    const pending = await PendingComment.findById(req.params.id);
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

exports.getOwn = async (req, res, next) => {
  try {
    const { name, email, isapprove } = req.query;
    let comments = [];
    if (isapprove === "Approve") {
      comments = await ConfirmedComment.find({ user: name, email });
    } else {
      comments = await PendingComment.find({ user: name, email });
    }
    res.json({ status: "ok", data: comments });
  } catch (err) {
    next(err);
  }
};

exports.deleteOwnApproved = async (req, res, next) => {
  try {
    await ConfirmedComment.deleteOne({ _id: req.body.commentId });
    res.json({ status: "ok", data: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.deleteOwnPending = async (req, res, next) => {
  try {
    await PendingComment.deleteOne({ _id: req.body.commentId });
    res.json({ status: "ok", data: "Deleted" });
  } catch (err) {
    next(err);
  }
};
