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
  .get(authToken, authRoles("admin", "government"), getAllIncidents)
  .delete(authToken, authRoles("admin", "government"), deleteAllIncidents);

router
  .route("/:id")
  .get(authToken, authRoles("admin", "government"), getIncidentById)
  .delete(authToken, authRoles("admin", "government"), deleteIncident);

module.exports = router;
