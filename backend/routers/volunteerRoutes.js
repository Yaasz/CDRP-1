const express = require("express");
const router = express.Router();
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
  .get(getAllVolunteers)
  .delete(deleteAllVolunteers)
  .post(registerVolunteer);
router
  .route("/:id")
  .get(getVolunteer)
  .post(updateVolunteer)
  .delete(deleteVolunteer);

module.exports = router;
