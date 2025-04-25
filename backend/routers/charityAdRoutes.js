const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

// Import controller functions
const {
  createCharityAd,
  getAllCharityAds,
  getCharityAd,
  updateCharityAd,
  deleteCharityAd,
  deleteAll,
} = require("../controllers/charityAdController"); // Adjust path to your controller file

// Define routes
router
  .route("/")
  .get(getAllCharityAds)
  .post(upload.single("image"), createCharityAd)
  .delete(deleteAll);
router
  .route("/:id")
  .get(getCharityAd)
  .put(upload.single("image"), updateCharityAd)
  .delete(deleteCharityAd);

module.exports = router;
