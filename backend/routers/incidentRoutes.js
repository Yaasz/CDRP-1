const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  getAllIncidents,
  getIncidentById,
  getIncidentImages,
  updateIncident,
  deleteIncident,
  deleteAllIncidents,
} = require("../controllers/incidentController");
const { createAssignment, getAssignmentsForIncident } = require("../controllers/assignmentController");

router
  .route("/")
  .get(authToken, authRoles("admin", "government"), getAllIncidents)
  .delete(authToken, authRoles("admin", "government"), deleteAllIncidents);

router
  .route("/:id")
  .get(authToken, authRoles("admin", "government"), getIncidentById)
  .put(authToken, authRoles("admin", "government"), updateIncident)
  .delete(authToken, authRoles("admin", "government"), deleteIncident);

router
  .route("/images/:id")
  .get(authToken, authRoles("admin", "government"), getIncidentImages);

// Assign an incident to a charity
router
  .route("/:id/assign")
  .post(authToken, authRoles("government"), (req, res) => {
    req.body.incidentId = req.params.id;
    return createAssignment(req, res);
  });

// Get assignments for a specific incident
router
  .route("/:id/assignments")
  .get(authToken, authRoles("admin", "government"), (req, res) => {
    req.params.incidentId = req.params.id;
    return getAssignmentsForIncident(req, res);
  });

module.exports = router;
