const express = require("express");
const verifyJWT = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// All routes are protected and restricted to Admin
router.use(verifyJWT);
router.use(authorize("Admin"));

router.get("/", getAllUsers);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
