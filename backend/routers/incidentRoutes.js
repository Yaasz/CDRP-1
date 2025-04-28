const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  getAllIncidents,
  getIncidentById,
  deleteIncident,
  deleteAllIncidents,
} = require("../controllers/incidentController");

router
  .route("/")
  .get(authToken, authRoles("admin", "goverment"), getAllIncidents)
  .delete(authToken, authRoles("admin", "goverment"), deleteAllIncidents);

router
  .route("/:id")
  .get(authToken, getIncidentById) // Assumed method
  .delete(authToken, authRoles("admin", "goverment"), deleteIncident); // Assumed method

module.exports = router;
