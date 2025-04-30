const News = require("../models/newsModel");
const cloudinary = require("../config/cloudinary");

const fs = require("fs").promises;

// Create a new news announcement
exports.createNews = async (req, res) => {
  //upload.single("image") // removed and put in the router
  try {
    const { title, content } = req.body;
    if (!req.file) {
      res.status(400).json({ error: "image is required" });
    }
    //upload
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "news",
    });
    await fs.unlink(req.file.path);
    const newsAnnouncement = new News({
      title,
      content,
      image: result.secure_url || "", // Default to empty string if not provided
      cloudinaryId: result.public_id,
    });

    const savedAnnouncement = await newsAnnouncement.save();
    res.status(201).json({
      success: true,
      data: savedAnnouncement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all news announcements
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [{ title: { $regex: search, $options: i } }],
        }
      : {};

    const newsAnnouncements = await News.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      count: newsAnnouncements.length,
      data: newsAnnouncements,
      page: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single news announcement by ID
exports.getNews = async (req, res) => {
  try {
    const newsAnnouncement = await News.findById(req.params.id);

    if (!newsAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "News announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: newsAnnouncement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update news announcement
exports.updateNews = async (req, res) => {
  const updates = { ...req.body };
  const { id } = req.params;
  try {
    const newsAnnouncement = await News.findById(id);
    if (!newsAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "News announcement not found",
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
      data: news,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete news announcement
exports.deleteNews = async (req, res) => {
  try {
    const newsAnnouncement = await News.findByIdAndDelete(req.params.id);

    if (!newsAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "News announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get news announcements by related incident
exports.getNewsByIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;

    const newsAnnouncements = await News.find({
      relatedIncident: incidentId,
    });

    res.status(200).json({
      success: true,
      count: newsAnnouncements.length,
      data: newsAnnouncements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete all
exports.deleteAll = async (req, res) => {
  try {
    const deleteAll = await News.deleteMany({});
    res.status(200).json({ messages: "all news have been deleted", deleteAll });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
