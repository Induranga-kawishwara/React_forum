const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  add,
  listPending,
  confirm,
  deletePending,
  getOwn,
  deleteOwnApproved,
  deleteOwnPending,
} = require("../controllers/commentController");

// public
router.post("/", add);

// admin protected
router.get("/", protect, listPending);
router.post("/:id/ok", protect, confirm);
router.delete("/:id", protect, deletePending);

// own comments
router.get("/own", getOwn);
router.post("/own/delete", deleteOwnPending);
router.post("/own/approved/delete", deleteOwnApproved);

module.exports = router;
