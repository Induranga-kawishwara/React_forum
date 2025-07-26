const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  add,
  listPending,
  confirm,
  deletePending,
} = require("../controllers/commentController");

// public add comment
router.post("/", add);

// admin routes
router.use(protect);
router.get("/", listPending);
router.post("/:id/ok", confirm);
router.delete("/:id", deletePending);

module.exports = router;
