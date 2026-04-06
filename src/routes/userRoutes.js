const express = require("express");
const {
  getUsers,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.use(verifyJWT);
router.use(authorize("Admin")); // Only Admin can manage users

router.get("/", getUsers);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;
