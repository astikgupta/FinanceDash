const express = require("express");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const verifyJWT = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.use(verifyJWT);

/**
 * @swagger
 * /api/v1/records:
 *   get:
 *     summary: Get all financial records with filters
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [income, expense] }
 *     responses:
 *       200:
 *         description: List of records
 */
router.get("/", authorize("Viewer", "Analyst", "Admin"), getRecords);

/**
 * @swagger
 * /api/v1/records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category]
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [income, expense] }
 *               category: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Record created successfully
 */
router.post("/", authorize("Analyst", "Admin"), createRecord);

router.patch("/:id", authorize("Analyst", "Admin"), updateRecord);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   delete:
 *     summary: Soft delete a record
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record deleted successfully
 */
router.delete("/:id", authorize("Admin"), deleteRecord);

module.exports = router;
