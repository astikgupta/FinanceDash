const express = require("express");
const { getStats } = require("../controllers/dashboardController");
const verifyJWT = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.use(verifyJWT);

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get dashboard statistics and overview
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard stats successfully fetched
 */
router.get("/", authorize("Analyst", "Admin"), getStats);

module.exports = router;
