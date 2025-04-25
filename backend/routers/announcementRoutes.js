const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController"); // Adjust path to your controller file

// Define routes
router.route("/").get(getAllAnnouncements).post(createAnnouncement);

router
  .route("/:id")
  .get(getAnnouncementById)
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

module.exports = router;
