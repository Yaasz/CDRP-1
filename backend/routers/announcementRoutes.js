const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const requireVerification = require("../middleware/requireVerification");
const upload = require("../config/multer");
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
  .get(
    authToken,
    authRoles("admin", "charity", "government"),
    requireVerification,
    getAllAnnouncements
  )
  .post(authToken, authRoles("government"), upload.none(), createAnnouncement);

router
  .route("/:id")
  .get(
    authToken,
    authRoles("admin", "charity", "government"),
    getAnnouncementById
  )
  .put(authToken, authRoles("government"), upload.none(), updateAnnouncement)
  .delete(authToken, authRoles("government", "admin"), deleteAnnouncement);

module.exports = router;
