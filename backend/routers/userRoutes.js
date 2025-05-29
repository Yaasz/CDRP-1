const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  deleteAll,
  login,
  changePassword,
  forceResetPassword,
  verifyUser,
} = require("../controllers/userController");

router
  .route("/")
  .get(authToken, getAllUsers)
  .post(upload.single("image"), createUser)
  .delete(authToken, authRoles("admin"), deleteAll);

router.post("/login", login);
router.get("/verify", verifyUser);

router
  .route("/:id")
  .get(authToken, getUser)
  .patch(
    authToken,
    authRoles("user", "admin"),
    upload.single("image"),
    updateUser
  )
  .delete(authToken, authRoles("user", "admin"), deleteUser);

// Password change routes
router
  .route("/changePassword/:id")
  .patch(authToken, authRoles("user", "admin"), changePassword);

// Force reset password (admin only)
router
  .route("/forceResetPassword/:id")
  .patch(authToken, authRoles("admin"), forceResetPassword);

module.exports = router;
