const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const authToken = require("../middleware/auth");
const requireVerification = require("../middleware/requireVerification");
const authRoles = require("../middleware/authorize");
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
  .get(authToken, getAllCharityAds)
  .post(
    authToken,
    authRoles("charity"),
    requireVerification,
    upload.single("image"),
    createCharityAd
  )
  .delete(authToken, authRoles("admin"), deleteAll);
router
  .route("/:id")
  .get(authToken, getCharityAd)
  .patch(
    authToken,
    authRoles("charity"),
    requireVerification,
    upload.single("image"),
    updateCharityAd
  )
  .delete(
    authToken,
    authRoles("charity"),
    requireVerification,
    deleteCharityAd
  );

module.exports = router;
