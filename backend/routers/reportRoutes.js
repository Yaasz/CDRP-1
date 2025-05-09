const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  getAllReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
  deleteAllReports,
} = require("../controllers/reportController");

router
  .route("/")
  .get(authToken, authRoles("admin", "government"), getAllReports)
  //allow multiple uploads image and video
  .post(authToken, authRoles("user"), upload.array("image", 10), createReport)
  .delete(authToken, authRoles("admin"), deleteAllReports);

router
  .route("/:id")
  .get(authToken, getReportById)
  .put(authToken, authRoles("user"), upload.single("image"), updateReport)
  .delete(authToken, authRoles("user", "admin"), deleteReport);

module.exports = router;
