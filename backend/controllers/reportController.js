const Report = require("../models/reportModel");
const Incident = require("../models/incidentModel"); // Add this import
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const distanceMap = {
  fire: 5000,
  "wild fire": 5000,
  "earth quake": 50000,
  drought: 100000,
  "land slide": 2000,
  flood: 5000,
  "locust swarm": 20000,
  sinkhole: 500,
  volcano: 50000,
  "hail storm": 10000,
};
//note:allowed types of disasters
const allowedTypes = [
  "Drought",
  "Earthquake",
  "Flood",
  "Hailstorm",
  "landslideDisaster",
  "locuswarm",
  "sinkhole",
  "volcano",
  "wildefire",
];
// Create a new report
exports.createReport = async (req, res) => {
  try {
    const data = { ...req.body };
    const empty = [];
    //check if the required fields are provided
    if (!data.type) empty.push("type");
    if (!data.description) empty.push("description");
    if (!data.reportedBy) empty.push("reportedBy");
    if (!data.latitude || !data.longitude) empty.push("location");
    const isValidId = await mongoose.Types.ObjectId.isValid(data.reportedBy);
    if (!isValidId) {
      return res.status(400).json({
        success: false,
        message: "invalid user id",
      });
    }

    const user = await User.findById(data.reportedBy);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user with id does not exist",
        error: "document not found",
      });
    }
    if (empty.length > 0) {
      return res
        .status(400)
        .json({ error: `${empty.join(", ")} fields must be provided.`, empty });
    }

    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);
    data.location = {
      type: "Point",
      coordinates: [lon, lat],
    };
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ error: "Invalid latitude value" });
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return res.status(400).json({ error: "Invalid longitude value" });
    }
    if (data.type) {
      const disasterType = data.type;

      const match = allowedTypes.some(
        (type) =>
          type.trim().replace(/\s+/g, " ").toLowerCase() ===
          disasterType.trim().replace(/\s+/g, " ").toLowerCase()
      );
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Invalid disaster type",
          error: `disaster type must be one of the following: ${allowedTypes.join(
            ", "
          )}`,
        });
      }
    }
    // Handle image upload
    if (req.files && req.files.length > 0) {
      const files = req.files;
      data.image = [];
      try {
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "report",
          });
          data.image.push({
            url: result.secure_url,
            cloudinaryId: result.public_id,
          });
          try {
            //note:delete temp file
            console.log("file path", file.path);
            await fs.unlink(file.path);
            console.log("temp File deleted successfully");
          } catch (error) {
            console.error("Error deleting temp file:", error);
          }
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          message: "image upload failed",
          error: error.message,
        });
      }
    }

    // Check for existing report
    const normalizedType = data.type.trim().replace(/\s+/g, " ").toLowerCase();
    const max_distance = distanceMap[normalizedType] || 1000; // Default to 1000 if type not found
    //console.log("max_distance", max_distance);
    const existingReport = await Report.findOne({
      reportedBy: data.reportedBy,
      type: data.type,
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          $maxDistance: max_distance,
        },
      },
    });

    if (existingReport) {
      return res.status(400).json({
        message: "You have already reported a similar incident in this area",
        existingReport: {
          id: existingReport._id,
          title: existingReport.title,
          createdAt: existingReport.createdAt,
        },
      });
    }
    //console.log("report data", data);
    const newReport = new Report(data);

    // Look for matching incidents with pending status
    const matchingIncidents = await Incident.find({
      type: data.type,
      status: "pending", // Only match pending incidents
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          $maxDistance: max_distance,
        },
      },
    }).limit(1);

    if (matchingIncidents.length > 0) {
      const incident = matchingIncidents[0];
      incident.reports.push(newReport._id);
      await incident.save(); // The pre-save hook will handle status update
      newReport.incident = incident._id;
      await newReport.save();

      res.status(201).json({
        success: true,
        message: "Report created and added to existing incident",
        data: newReport,
        incident: {
          id: incident._id,
          status: incident.status,
          reportCount: incident.reports.length,
        },
      });
    } else {
      const newIncident = new Incident({
        type: data.type,
        title: data.title,
        description: data.description,
        dateOccurred: new Date(),
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
        status: "pending", // Start as pending
        reports: [newReport._id],
      });
      await newIncident.save();
      newReport.incident = newIncident._id;
      await newReport.save();

      res.status(201).json({
        message: "Report and new incident created successfully",
        data: newReport,
        incident: {
          type: newIncident.type,
          status: newIncident.status,
        },
      });
    }
  } catch (error) {
    console.log("error", error.message);
    if (error.name === "ValidationError") {
      const fieldErrors = {};
      for (let field in error.errors) {
        fieldErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: fieldErrors,
      });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
// Update a report
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "the report id invalid ",
        error: "invalid param",
      });
    }
    const existingReport = await Report.findById(id);
    if (!existingReport) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    if (existingReport.reportedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "only the owner can update a report",
      });
    }
    if (data.type) {
      const disasterType = data.type;

      const match = allowedTypes.some(
        (type) =>
          type.toLowerCase().trim().replace(/\s+/g, " ") ===
          disasterType.toLowerCase().trim().replace(/\s+/g, " ")
      );
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Invalid disaster type",
          error: `disaster type must be one of the following:${allowedTypes.join(
            ", "
          )}`,
        });
      }
    }
    if (req.files && req.files.length > 0) {
      const files = req.files;
      data.image = [];
      try {
        if (existingReport.image.length > 0) {
          for (const image of existingReport.image) {
            await cloudinary.uploader.destroy(image.cloudinaryId);
          }
        }
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "report",
          });
          console.log("data", data);

          data.image.push({
            url: result.secure_url,
            cloudinaryId: result.public_id,
          });
          try {
            await fs.unlink(file.path);
            console.log("temp File deleted successfully");
          } catch (error) {
            console.error("Error deleting temp file:", error);
          }
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "image upload failed",
          error: error.message,
        });
      }
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === "") delete data[key];
    });
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (updatedReport.incident) {
      const incident = await Incident.findById(updatedReport.incident);
      if (incident && incident.type !== data.type) {
        // Type mismatch: Unlink from current incident
        incident.reports = incident.reports.filter(
          (reportId) => String(reportId) !== String(updatedReport._id)
        );
        await incident.save();
        updatedReport.incident = null;
        await updatedReport.save();

        // Find matching incident
        const normalizedType = data.type
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase();
        const max_distance = distanceMap[normalizedType] || 1000;
        const matchingIncidents = await Incident.find({
          type: disasterType,
          status: "pending",
          location: {
            $near: {
              $geometry: existingReport.location,
              $maxDistance: max_distance,
            },
          },
        }).limit(1);

        if (matchingIncidents.length > 0) {
          const newIncident = matchingIncidents[0];
          newIncident.reports.push(updatedReport._id);
          await newIncident.save();
          updatedReport.incident = newIncident._id;
          await updatedReport.save();
        } else {
          const newIncident = new Incident({
            type: data.type || updatedReport.type,
            title: data.title || updatedReport.title,
            description: `Auto-generated from report: ${
              data.description || updatedReport.description
            }`,
            location: existingReport.location,
            reports: [updatedReport._id],
          });
          await newIncident.save();
          updatedReport.incident = newIncident._id;
          await updatedReport.save();
        }
      }
    } else {
      // No incident: Find or create one
      const normalizedType = data.type
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
      const max_distance = distanceMap[normalizedType] || 1000;
      const matchingIncidents = await Incident.find({
        type: data.type,
        location: {
          $near: {
            $geometry: existingReport.location,
            $maxDistance: max_distance,
          },
        },
      }).limit(1);

      if (matchingIncidents.length > 0) {
        const incident = matchingIncidents[0];
        incident.reports.push(updatedReport._id);
        await incident.save();
        updatedReport.incident = incident._id;
        await updatedReport.save();
      } else {
        const newIncident = new Incident({
          type: data.type || updatedReport.type,
          title: data.title || updatedReport.title,
          description: data.description || updatedReport.description,
          location: existingReport.location,
          reports: [updatedReport._id],
        });
        await newIncident.save();
        updatedReport.incident = newIncident._id;
        await updatedReport.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { date: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const reports = await Report.find(searchFilter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      page: parseInt(page),
      totalCount: await Report.countDocuments(),
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "the report id invalid ",
        error: "invalid param",
      });
    }
    const report = await Report.findById(id).populate(
      "reportedBy",
      "name email"
    );
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
        error: "document not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "report fetched",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
        error: "document not found",
      });
    }
    if (report.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(report.cloudinaryId);
      } catch (error) {
        console.error("Cloudinary deletion error:", error);
      }
    }

    // Remove report ID from the associated Incident's reports array
    const incident = await Incident.findOne({ _id: report.incident });
    incident.reports.pull(report._id);
    await incident.save();
    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.deleteAllReports = async (req, res) => {
  try {
    const result = await Report.deleteMany({});
    await Incident.deleteMany({});
    try {
      await cloudinary.api.delete_resources_by_prefix("report");
    } catch (error) {
      console.error("failed to delete all report images", error);
    }
    res.status(200).json({
      success: true,
      message: "All reports deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
exports.getUserReports = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    console.log("user id", req.user.id);
    const reports = await Report.find({ reportedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      page: parseInt(page),
      totalCount: await Report.countDocuments({ reportedBy: req.user.id }),
      reports: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
