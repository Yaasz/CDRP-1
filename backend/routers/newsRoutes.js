const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const authToken = require("../middleware/auth");
const authRoles = require("../middleware/authorize");
const {
  getAllNews,
  createNews,
  getNews,
  updateNews,
  deleteNews,
  deleteAll,
} = require("../controllers/newsController");

router
  .route("/")
  .get(authToken, getAllNews)
  .post(authToken, authRoles("government"), upload.none(), createNews)
  .delete(authToken, authRoles("admin", "government"), deleteAll);

router
  .route("/:id")
  .get(authToken, getNews)
  .delete(authToken, authRoles("government", "admin"), deleteNews)
  .put(authToken, authRoles("government"), upload.none(), updateNews)
  .patch(authToken, upload.none(), authRoles("government"), updateNews);

module.exports = router;
