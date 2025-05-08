const mongoose = require("mongoose");
const Announcement = require("../models/announcementModel");
const createAnnouncement = async (req, res) => {
  try {
    const { title, description, charities } = req.body;
    const empty = [];
    if (!title) {
      empty.push("title");
    }
    if (!description) {
      empty.push("description");
    }

    if (empty.length > 0) {
      return res.status(400).json({
        success: false,
        message: "missing fields",
        error: `${empty.join(", ")} fields are required`,
      });
    }

    const response = await Announcement.create({
      title,
      description,
      charities: charities || [],
    });
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error creating announcement",
      error: error.message,
    });
    console.error(error.message);
  }
};
const getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const searchFilter = search
      ? { $or: [{ title: { $regex: search, $options: i } }] }
      : {};
    const announcements = await Announcement.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      count: await Announcement.countDocuments(),
      page: parseInt(page),
      success: true,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching announcements",
      error: error.message,
    });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid announcement ID" });
    }
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        error: "document not found",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "user fetched", data: announcement });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      success: false,
      error: error.message,
    });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, charities } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid announcement ID" });
    }
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    announcement.title = title || announcement.title;
    announcement.description = description || announcement.description;
    if (charities) announcement.charities = charities;
    const updatedAnnouncement = await announcement.save();
    res.status(200).json({
      success: true,
      message: "update successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
        error: "invalid param",
      });
    }
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        error: "document not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
