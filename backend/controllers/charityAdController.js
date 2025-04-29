const CharityAd = require("../models/charityadModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

// Create a new charity ad
exports.createCharityAd = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "charityAd",
      });
      data.image = result.secure_url;
      data.cloudinaryId = result.public_id;
      await fs.unlink(req.file.path);
    }

    const charityAd = new CharityAd({
      charity: data.charity,
      incident: data.incident,
      title: data.title,
      description: data.description,
      image: data.image,
      cloudinaryId: data.cloudinaryId,

      // volunteers field will be empty by default
    });

    const savedAd = await charityAd.save();
    res.status(201).json({
      success: true,
      data: savedAd,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
      count: charityAds.length,
      page: parseInt(page),
      data: charityAds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
      });
    }

    res.status(200).json({
      success: true,
      data: charityAd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
      data: charityAd,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
        message: "Charity ad not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity ad deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const delete_all = await CharityAd.deleteMany({});
    res
      .status(200)
      .json({ success: true, message: "all charity ads are deleted" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
