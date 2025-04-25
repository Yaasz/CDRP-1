const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
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
  .get(getAllReports)
  .post(upload.single("image"), createReport)
  .delete(deleteAllReports);

router
  .route("/:id")
  .get(getReportById)
  .put(upload.single("image"), updateReport)
  .delete(deleteReport);

/*router
  .route("/:id/assign-incident")
  .put(reportController.assignReportToIncident);*/

module.exports = router;
