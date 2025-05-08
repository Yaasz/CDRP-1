const CharityAd = require("../models/charityadModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

// Create a new charity ad
exports.createCharityAd = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.charity) {
      return res.status(400).json({
        success: false,
        message: "charity is required",
      });
    }
    if (!data.title) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }
    if (!data.description) {
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }
    if (data.duration) {
      const duration = parseInt(data.duration);
      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({
          success: false,
          message: "duration must be a positive number",
        });
      }
      data.duration = duration * 24 * 60 * 60 * 1000; // Convert to milliseconds
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "charityAd",
      });
      data.image = result.secure_url;
      data.cloudinaryId = result.public_id;
      await fs.unlink(req.file.path);
    }
    console.log("data", data);

    const charityAd = new CharityAd({
      data,
    });

    const savedAd = await charityAd.save();
    res.status(201).json({
      success: true,
      message: "advertisement created",
      response: savedAd,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "internal server",
      error: error.message,
    });
  }
};

// Get all charity ads
exports.getAllCharityAds = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: i } },
            { status: { $regex: search, $options: i } },
            { charity: { $regex: search, $options: i } },
          ],
        }
      : {};

    const charityAds = await CharityAd.find(searchFilter)
      .populate("charity", "name")
      .populate({
        path: "volunteers",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: await CharityAd.countDocuments(),
      page: parseInt(page),
      data: charityAds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get single charity ad by ID
exports.getCharityAd = async (req, res) => {
  try {
    const charityAd = await CharityAd.findById(req.params.id)
      .populate("charityId", "name description")
      .populate({
        path: "volunteers",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    if (!charityAd) {
      return res.status(404).json({
        success: false,
        message: "Charity ad not found",
        error: "document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: charityAd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Update charity ad
exports.updateCharityAd = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const charAd = await CharityAd.findById(id);

    if (!charAd) {
      return res.status(404).json({
        success: false,
        message: "Charity ad not found",
      });
    }
    if (updates.duration) {
      const duration = parseInt(updates.duration);
      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({
          success: false,
          message: "duration must be a positive number",
        });
      }
      updates.duration = duration * 24 * 60 * 60 * 1000; // Convert to milliseconds
    }
    if (req.file) {
      if (charAd.cloudinaryId) {
        await cloudinary.uploader.destroy(charAd.cloudinaryId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "charityAd",
      });
      updates.image = result.secure_url;
      updates.cloudinaryId = result.public_id;

      await fs.unlink(req.file.path);
    }
    const charityAd = await CharityAd.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "ad updated successfully",
      data: charityAd,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Delete charity ad
exports.deleteCharityAd = async (req, res) => {
  try {
    const charityAd = await CharityAd.findByIdAndDelete(req.params.id);

    if (!charityAd) {
      return res.status(404).json({
        success: false,
        error: "document not found",
        message: "Charity ad not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity ad deleted successfully",
      data: charityAd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const delete_all = await CharityAd.deleteMany({});
    res.status(200).json({
      success: true,
      message: "all charity ads are deleted",
      count: delete_all.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
