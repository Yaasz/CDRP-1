const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  createOrganization,
  getAllOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationsByRole,
  deleteAll,
  login,
} = require("../controllers/organizationController");

router
  .route("/")
  .get(authToken, authRoles("admin"), getAllOrganizations)
  .post(upload.single("image"), createOrganization)
  .delete(authToken, authRoles("government", "admin"), deleteAll);

router.post("/login", upload.none(), login);

router
  .route("/:id")
  .get(authToken, getOrganization)
  .put(
    authToken,
    authRoles("charity", "government"),
    upload.single("image"),
    updateOrganization
  )
  .delete(authToken, authRoles("charity", "government"), deleteOrganization);

router
  .route("/:type")
  .get(authToken, authRoles("admin"), getOrganizationsByRole);

module.exports = router;
