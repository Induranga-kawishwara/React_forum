const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { add, listByComment } = require("../controllers/replyController");

router.post("/", add);
router.get("/:commentId", listByComment);

module.exports = router;
