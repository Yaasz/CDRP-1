const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const {
  createOrganization,
  getAllOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationsByType,
  deleteAll,
  login,
} = require("../controllers/organizationController");

router
  .route("/")
  .get(getAllOrganizations)
  .post(upload.single("image"), createOrganization)
  .delete(deleteAll);

router.post("/login", upload.none(), login);

router
  .route("/:id")
  .get(getOrganization)
  .put(upload.single("image"), updateOrganization)
  .delete(deleteOrganization);

router.route("/type/:type").get(getOrganizationsByType);

module.exports = router;
