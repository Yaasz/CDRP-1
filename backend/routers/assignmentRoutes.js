const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignmentStatus,
  getAssignmentsForIncident
} = require("../controllers/assignmentController");

// Routes for assignments
router
  .route("/")
  .get(authToken, authRoles("admin", "government", "charity"), getAllAssignments)
  .post(authToken, authRoles("government"), createAssignment);

router
  .route("/:id")
  .get(authToken, authRoles("admin", "government", "charity"), getAssignmentById)
  .patch(authToken, authRoles("government", "charity"), updateAssignmentStatus);

// Get assignments for a specific incident
router
  .route("/incident/:incidentId")
  .get(authToken, authRoles("admin", "government"), getAssignmentsForIncident);

module.exports = router; 