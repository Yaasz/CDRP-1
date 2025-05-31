const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const requireVerification = require("../middleware/requireVerification");
// Import controller functions
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  updateCharityResponse,
} = require("../controllers/announcementController"); // Adjust path to your controller file

// Define routes
router
  .route("/")
  .get(
    authToken,
    authRoles("admin", "charity"),
    requireVerification,
    getAllAnnouncements
  )
  .post(authToken, authRoles("government"), createAnnouncement);

router
  .route("/:id")
  .get(authToken, getAnnouncementById)
  .put(authToken, authRoles("government"), updateAnnouncement)
  .delete(authToken, authRoles("government", "admin"), deleteAnnouncement);

// Route for charity responses to announcements
router
  .route("/:id/respond")
  .patch(
    authToken,
    authRoles("charity"),
    requireVerification,
    updateCharityResponse
  );

module.exports = router;
