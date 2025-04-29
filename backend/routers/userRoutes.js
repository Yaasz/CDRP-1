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
} = require("../controllers/userController");

router
  .route("/")
  .get(authToken, getAllUsers)
  .post(upload.single("image"), createUser)
  .delete(authToken, authRoles("admin"), deleteAll);

// Explicitly handle form data and JSON for login
router.post("/login", login);

router
  .route("/:id")
  .get(authToken, getUser)
  .put(authToken, authRoles("user"), upload.single("image"), updateUser)
  .delete(authToken, authRoles("user", "admin"), deleteUser);

module.exports = router;
