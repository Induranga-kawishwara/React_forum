const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { getAll, getMe, deleteUser } = require("../controllers/userController");

router.get("/", protect, getAll);
router.get("/me", protect, getMe);
router.delete("/:id", protect, deleteUser);

module.exports = router;
