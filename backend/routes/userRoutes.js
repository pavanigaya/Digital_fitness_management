const express = require("express");
const { protect, requireAdmin } = require("../middleware/auth");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");

const router = express.Router();


router.use(protect);

router.get("/", requireAdmin, getUsers);           // admin list
router.get("/:id", getUserById);                   // self or admin
router.put("/:id", updateUser);                    // self or admin
router.delete("/:id", requireAdmin, deleteUser);   // admin

module.exports = router;
