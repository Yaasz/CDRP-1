const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");

// Import controller functions
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController"); // Adjust path to your controller file

// Define routes
router
  .route("/")
  .get(authToken, authRoles("government", "admin"), getAllAnnouncements)
  .post(authToken, authRoles("government"), createAnnouncement);

router
  .route("/:id")
  .get(authToken, getAnnouncementById)
  .put(authToken, authRoles("government"), updateAnnouncement)
  .delete(authToken, authRoles("government"), deleteAnnouncement);

module.exports = router;
