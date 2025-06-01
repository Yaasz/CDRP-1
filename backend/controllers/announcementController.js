const mongoose = require("mongoose");
const Announcement = require("../models/announcementModel");
const createAnnouncement = async (req, res) => {
  try {
    const { incident, title, description, charities } = req.body;
    const empty = [];
    if (!title) {
      empty.push("title");
    }
    if (!description) {
      empty.push("description");
    }
    if (!incident || !mongoose.Types.ObjectId.isValid(incident)) {
      return res.status(400).json({
        success: false,
        message: "incident is required and must be an id",
        error: "missing/invalid fields",
      });
    }

    if (empty.length > 0) {
      return res.status(400).json({
        success: false,
        message: "missing fields",
        error: `${empty.join(", ")} fields are required`,
      });
    }

    // Handle charities array - if empty or not provided, fetch all active charities
    let targetCharities = [];
    
    if (!charities || charities.length === 0) {
      // Fetch all active charities
      const Organization = mongoose.model("Organization");
      const allCharities = await Organization.find({
        organizationType: "charity",
        isVerified: true,
        // Add any other criteria for active charities
      }).select('_id');
      
      targetCharities = allCharities.map(charity => ({
        charity: charity._id,
        response: "Pending"
      }));
    } else {
      // Validate provided charity IDs
      for (const charity of charities) {
        if (!mongoose.Types.ObjectId.isValid(charity)) {
          return res.status(400).json({
            success: false,
            message: "Invalid charity ID",
            error: "invalid data",
          });
        }
      }
      
      // Map provided charities to the expected format
      targetCharities = charities.map(charityId => ({
        charity: charityId,
        response: "Pending"
      }));
    }

    const response = await Announcement.create({
      incident,
      title,
      description,
      charities: targetCharities,
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
      ? { $or: [{ title: { $regex: search, $options: "i" } }] }
      : {};
    const announcements = await Announcement.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      totalCount: await Announcement.countDocuments(),
      searchCount: await Announcement.countDocuments(searchFilter),
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
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
        error: "invalid param",
      });
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

// Update charity response to announcement
const updateCharityResponse = async (req, res) => {
  try {
    const { id } = req.params; // announcement ID
    const { charityId, response } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
        error: "invalid param",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(charityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid charity ID",
        error: "invalid param",
      });
    }

    if (!response || !["Accepted", "Rejected"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Response must be either 'Accepted' or 'Rejected'",
        error: "invalid response",
      });
    }

    // Find the announcement
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        error: "document not found",
      });
    }

    // Find the charity in the charities array
    const charityIndex = announcement.charities.findIndex(
      (charityObj) => charityObj.charity.toString() === charityId
    );

    if (charityIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Charity not found in announcement",
        error: "charity not invited",
      });
    }

    // Check if charity has already responded (not pending)
    if (announcement.charities[charityIndex].response !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Charity has already ${announcement.charities[charityIndex].response.toLowerCase()} this announcement`,
        error: "response already given",
      });
    }

    // Update the response
    announcement.charities[charityIndex].response = response;
    
    // Save the updated announcement
    const updatedAnnouncement = await announcement.save();

    res.status(200).json({
      success: true,
      message: `Announcement ${response.toLowerCase()} successfully`,
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating charity response:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
  updateCharityResponse,
};
