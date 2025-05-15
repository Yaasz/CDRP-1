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

router
  .route("/")
  .get(authToken, authRoles("admin", "charity"), getAllVolunteers)
  .delete(authToken, authRoles("admin"), deleteAllVolunteers)
  .post(authToken, authRoles("user"), registerVolunteer);

// routers tied to a charityad
router
  .route("/:id")
  .get(authToken, authRoles("user", "charity"), getVolunteer)
  .put(authToken, authRoles("user"), updateVolunteer)
  .delete(authToken, authRoles("user"), deleteVolunteer);

module.exports = router;
