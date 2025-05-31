const express = require("express");
const router = express.Router();
const {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
} = require("../controllers/alertController");

router.post("/", createAlert);
router.get("/", getAllAlerts);
router.get("/:id", getAlertById);
router.patch("/:id", updateAlert);
router.delete("/:id", deleteAlert);

module.exports = router;
