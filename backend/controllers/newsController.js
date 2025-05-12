const News = require("../models/newsModel");
const cloudinary = require("../config/cloudinary");

const fs = require("fs").promises;

// Create a new news
exports.createNews = async (req, res) => {
  //upload.single("image") // removed and put in the router
  try {
    const data = { ...req.body };
    if (!data.incident) {
      return res.status(400).json({
        success: false,
        message: "news must be about incident",
        error: "incident is required",
      });
    }
    if (!data.title || data.description) {
      return res.status(400).json({
        success: false,
        message: "title and description are required",
        error: "missing fields",
      });
    }
    if (!data.images.length > 0) {
      return res.status(400).json({
        success: false,
        message: "news must have at least one image",
        error: "missing fields",
      });
    }
    const images = data.images;
    images.map((img) => {
      if (!img.url || !img.cloudinaryId) {
        return res.status(400).json({
          success: false,
          message: "image must be url and cloudinaryId ",
          error: "missing fields",
        });
      }
    });
    console.log("data", data);
    const newsAnnouncement = new News(data);

    const savedAnnouncement = await newsAnnouncement.save();
    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: savedAnnouncement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }],
        }
      : {};

    const newsAnnouncements = await News.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      totalCount: await News.countDocuments(),
      searchCount: await News.countDocuments(searchFilter),
      data: newsAnnouncements,
      page: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get single news  by ID
exports.getNews = async (req, res) => {
  try {
    const newsAnnouncement = await News.findById(req.params.id);

    if (!newsAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "News announcement not found",
        error: "document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "news fetched",
      data: newsAnnouncement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  const updates = { ...req.body };
  const { id } = req.params;
  try {
    const newsAnnouncement = await News.findById(id);
    if (!newsAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "News not found",
        error: "document not found",
      });
    }

    if (req.file) {
      if (newsAnnouncement.cloudinaryId) {
        await cloudinary.uploader.destroy(newsAnnouncement.cloudinaryId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "news",
      });
      updates.image = result.secure_url;
      updates.cloudinaryId = result.public_id;

      await fs.unlink(req.file.path);
    }
    const news = await News.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Delete news by ID
exports.deleteNews = async (req, res) => {
  try {
    const newsAnnouncement = await News.findByIdAndDelete(req.params.id);

    if (!newsAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "News not found",
        error: "document not found",
      });
    }
    if (newsAnnouncement.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(newsAnnouncement.cloudinaryId);
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "News  deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//delete all
exports.deleteAll = async (req, res) => {
  try {
    const deleteAll = await News.deleteMany({});
    res.status(200).json({
      success: true,
      messages: "all news have been deleted",
      count: deleteAll.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
