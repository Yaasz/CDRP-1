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
  .get(authToken, authRoles("admin", "charity"), getAllAnnouncements)
  .post(authToken, authRoles("government"), createAnnouncement);

router
  .route("/:id")
  .get(authToken, getAnnouncementById)
  .put(authToken, authRoles("government"), updateAnnouncement)
  .delete(authToken, authRoles("government", "admin"), deleteAnnouncement);

module.exports = router;
