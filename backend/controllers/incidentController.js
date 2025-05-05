const mongoose = require("mongoose");
const Incident = require("../models/incidentModel");

// Get all incidents
exports.getAllIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: i } },
            { status: { $regex: search, $options: i } },
            { type: { $regex: search, $options: i } },
            { date: { $regex: search, $options: i } },
          ],
        }
      : {};
    const incidents = await Incident.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("reports", "title description image date");

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
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

// Get a single incident by ID
exports.getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID",
      });
    }

    const incident = await Incident.findById(id).populate(
      "reports",
      "title description image"
    );

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
        error: "doc not found",
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Delete an incident
exports.deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID",
      });
    }

    const incident = await Incident.findByIdAndDelete(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
        error: "doc not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incident deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
//delete all incidents

exports.deleteAllIncidents = async (req, res) => {
  try {
    const result = await Incident.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All incidents deleted successfully",
      countCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
