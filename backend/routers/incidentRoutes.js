const express = require("express");
const router = express.Router();
const {
  getAllIncidents,
  getIncidentById,
  deleteIncident,
  deleteAllIncidents,
} = require("../controllers/incidentController");

router.route("/").get(getAllIncidents).delete(deleteAllIncidents);

router
  .route("/:id")
  .get(getIncidentById) // Assumed method
  .delete(deleteIncident); // Assumed method

module.exports = router;
