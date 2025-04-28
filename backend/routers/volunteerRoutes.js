const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  registerVolunteer,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getAllVolunteers,
  deleteAllVolunteers,
} = require("../controllers/volunteerController");

// Routes tied to a specific CharityAd
router
  .route("/")
  .get(authToken, authRoles("admin", "charity"), getAllVolunteers)
  .delete(authToken, authRoles("admin"), deleteAllVolunteers)
  .post(authToken, authRoles("user"), registerVolunteer);
router
  .route("/:id")
  .get(authToken, getVolunteer)
  .post(authToken, authRoles("user"), updateVolunteer)
  .delete(authToken, deleteVolunteer);

module.exports = router;
