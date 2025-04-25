const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
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
  .get(getAllUsers)
  .post(upload.single("image"), createUser)
  .delete(deleteAll);

// Explicitly handle form data and JSON for login
router.post("/login", login);

router
  .route("/:id")
  .get(getUser)
  .put(upload.single("image"), updateUser)
  .delete(deleteUser);

module.exports = router;
