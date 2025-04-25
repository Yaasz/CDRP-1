const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  getAllNews,
  createNews,
  getNews,
  updateNews,
  deleteNews,
  getNewsByIncident,
  deleteAll,
} = require("../controllers/newsController");

router
  .route("/")
  .get(getAllNews)
  .post(upload.single("image"), createNews)
  .delete(deleteAll);

router
  .route("/:id")
  .get(getNews)
  .delete(deleteNews)
  .put(upload.single("image"), updateNews)
  .patch(upload.single("image"), updateNews);

module.exports = router;
