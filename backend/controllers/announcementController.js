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
      return res
        .status(400)
        .json({ error: `${empty.join(", ")} fields are required` });
    }

    const response = await Announcement.create({
      title,
      description,
      charities: charities || [],
    });
    res
      .status(201)
      .json({ message: "Announcement created successfully", response });
  } catch (error) {
    res.status(500).json({ message: "error creating announcement" });
    console.error(error);
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
      count: announcements.length,
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
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching announcement with given id",
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
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating announcement", error: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid announcement ID" });
    }
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting announcement", error: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
