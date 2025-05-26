const CharityAd = require("../models/charityadModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

// Create a new charity ad
exports.createCharityAd = async (req, res) => {
  try {
    const data = { ...req.body };
    console.log("Received data:", data);

    // Required field validations
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

    // Duration validation and conversion
    if (data.duration) {
      const duration = parseInt(data.duration);
      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({
          success: false,
          message: "duration must be a positive number",
        });
      }
      data.duration = duration * 24 * 60 * 60 * 1000; // Convert to milliseconds
      data.expiresAt = new Date(Date.now() + data.duration);
    }

    // Image upload handling
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "charityAd",
      });
      data.image = result.secure_url;
      data.cloudinaryId = result.public_id;
      await fs.unlink(req.file.path);
    }

    // Parse categories and requirements if provided
    if (data.categories) {
      data.categories = Array.isArray(data.categories)
        ? data.categories
        : JSON.parse(data.categories);
    }
    // if (data.requirements) {
    //   data.requirements = Array.isArray(data.requirements)
    //     ? data.requirements
    //     : JSON.parse(data.requirements);
    // }

    const charityAd = new CharityAd(data);
    const savedAd = await charityAd.save();

    res.status(201).json({
      success: true,
      message: "advertisement created",
      data: savedAd,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get all charity ads
exports.getAllCharityAds = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { categories: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const charityAds = await CharityAd.find(searchFilter)
      .populate("charity", "_id organizationName")
      .populate({
        path: "volunteers",
        select: "fullName email phone contribution expertise",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      totalCount: await CharityAd.countDocuments(),
      searchCount: await CharityAd.countDocuments(searchFilter),
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid charity ad id",
        error: "invalid param",
      });
    }
    const charityAd = await CharityAd.findById(id)
      .populate("charity", "name description")
      .populate({
        path: "volunteers",
        select: "fullName email phone age sex contribution expertise",
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
      message: "charity ad fetched",
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid charity ad id",
        error: "invalid param",
      });
    }
    const updates = { ...req.body };

    const charAd = await CharityAd.findById(id);

    if (!charAd) {
      return res.status(404).json({
        success: false,
        message: "Charity ad not found",
      });
    }

    // Duration validation and conversion
    if (updates.duration) {
      const duration = parseInt(updates.duration);
      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({
          success: false,
          message: "duration must be a positive number",
        });
      }
      updates.duration = duration * 24 * 60 * 60 * 1000;
      updates.expiresAt = new Date(Date.now() + updates.duration);
    }

    // Image upload handling
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

    // Parse categories and requirements if provided
    if (updates.categories) {
      updates.categories = Array.isArray(updates.categories)
        ? updates.categories
        : JSON.parse(updates.categories);
    }
    if (updates.requirements) {
      updates.requirements = Array.isArray(updates.requirements)
        ? updates.requirements
        : JSON.parse(updates.requirements);
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid charity ad id",
        error: "invalid param",
      });
    }
    const charityAd = await CharityAd.findByIdAndDelete(id);

    if (!charAd) {
      return res.status(404).json({
        success: false,
        error: "document not found",
        message: "Charity ad not found",
      });
    }

    if (charityAd.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(charityAd.cloudinaryId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
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

// Delete all charity ads
exports.deleteAll = async (req, res) => {
  try {
    const deleteAll = await CharityAd.deleteMany({});

    try {
      await cloudinary.api.delete_resources_by_prefix("charityAd");
    } catch (error) {
      console.error("Failed to delete all charity images", error);
    }

    res.status(200).json({
      success: true,
      message: "All charity ads deleted",
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
