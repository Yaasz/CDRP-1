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
  verify,
  deleteAll,
  login,
} = require("../controllers/organizationController");

router
  .route("/")
  .get(authToken, authRoles("admin", "government"), getAllOrganizations)
  .post(upload.single("image"), createOrganization)
  .delete(authToken, authRoles("admin"), deleteAll);

router.post("/login", upload.none(), login);

router
  .route("/:id")
  .get(authToken, getOrganization)
  .patch(
    authToken,
    authRoles("charity", "government"),
    upload.single("image"),
    updateOrganization
  )
  .delete(
    authToken,
    authRoles("charity", "government", "admin"),
    deleteOrganization
  );
router.route("/verify/:id").patch(authToken, authRoles("admin"), verify);

module.exports = router;
