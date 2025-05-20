const mongoose = require("mongoose");
const Incident = require("../models/incidentModel");

// Get all incidents
exports.getAllIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { date: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const incidents = await Incident.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("reports", "title description image date");

    res.status(200).json({
      success: true,
      totalCount: await Incident.countDocuments(),
      searchCount: await Incident.countDocuments(searchFilter),
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
        error: "invalid param",
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

    // Get assignments for this incident if they exist
    let assignments = [];
    if (mongoose.models.Assignment) {
      const Assignment = mongoose.model('Assignment');
      assignments = await Assignment.find({ incident: id })
        .populate("organization", "organizationName email phone")
        .populate("assignedBy", "organizationName")
        .sort({ createdAt: -1 });
    }

    // Get news related to this incident
    let news = [];
    if (mongoose.models.News) {
      const News = mongoose.model('News');
      news = await News.find({ incident: id }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: incident,
      assignments,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Update an incident
exports.updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, description, status, location, dateOccurred } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID",
        error: "invalid param",
      });
    }

    // Find the incident
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
        error: "doc not found",
      });
    }

    // Prepare update data
    const updateData = {};
    
    if (type) updateData.type = type;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (dateOccurred) updateData.dateOccurred = new Date(dateOccurred);
    
    // Handle location update
    if (location) {
      if (typeof location === 'object' && location.coordinates && location.coordinates.length === 2) {
        updateData.location = {
          type: 'Point',
          coordinates: location.coordinates
        };
      } else if (typeof location === 'string') {
        // If location is passed as a string like "lat,lng"
        try {
          const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            updateData.location = {
              type: 'Point',
              coordinates: [lng, lat] // GeoJSON uses [longitude, latitude]
            };
          }
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid location format. Expected 'latitude,longitude'",
            error: "invalid param",
          });
        }
      }
    }

    // Update the incident
    const updatedIncident = await Incident.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate("reports", "title description image");

    res.status(200).json({
      success: true,
      message: "Incident updated successfully",
      data: updatedIncident,
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

//fetch all the images of the incident

const getIncidentImages = async (incidentId) => {
  try {
    const result = await Incident.aggregate([
      // Match the specific incident
      { $match: { _id: new mongoose.Types.ObjectId(incidentId) } },
      // Lookup reports associated with the incident
      {
        $lookup: {
          from: "reports",
          localField: "reports",
          foreignField: "_id",
          as: "reportData",
        },
      },
      // Unwind the reportData array
      { $unwind: { path: "$reportData", preserveNullAndEmptyArrays: true } },
      // Project only the images from reports
      {
        $project: {
          images: "$reportData.image",
        },
      },
      // Unwind the images array
      { $unwind: { path: "$images", preserveNullAndEmptyArrays: true } },
      // Group to collect all images
      {
        $group: {
          _id: null,
          images: { $push: "$images" },
        },
      },
      // Project to clean up output
      {
        $project: {
          _id: 0,
          images: 1,
        },
      },
    ]);

    // Return images or empty array if none found
    return result.length > 0
      ? result[0].images.filter((img) => img.url && img.cloudinaryId)
      : [];
  } catch (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
};

// Example usage in a controller
exports.getIncidentImages = async (req, res) => {
  try {
    const { id } = req.params;
    const images = await getIncidentImages(id);
    res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
