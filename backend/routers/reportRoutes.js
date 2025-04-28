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
  .post(authToken, authRoles("user"), upload.single("image"), createReport)
  .delete(
    authToken,
    authRoles("admin"),
    upload.single("image"),
    deleteAllReports
  );

router
  .route("/:id")
  .get(authToken, getReportById)
  .put(authToken, authRoles("user"), upload.single("image"), updateReport)
  .delete(authToken, authRoles("user", "admin"), deleteReport);

/*router
  .route("/:id/assign-incident")
  .put(reportController.assignReportToIncident);*/

module.exports = router;
