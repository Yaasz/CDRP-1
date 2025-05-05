const Report = require("../models/reportModel");
const Incident = require("../models/incidentModel"); // Add this import
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
// Create a new report
exports.createReport = async (req, res) => {
  try {
    const data = { ...req.body };
    const empty = [];
    if (!data.type) empty.push("type");
    if (!data.description) empty.push("description");
    if (!data.reportedBy) empty.push("reportedBy");
    if (!data.latitude || !data.longitude) empty.push("location");

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

    // Handle image upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "report",
        });
        data.image = result.secure_url;
        data.cloudinaryId = result.public_id;
        await fs.unlink(req.file.path);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "image upload failed",
          error: error.message,
        });
      }
    }

    // Check for existing report
    const existingReport = await Report.findOne({
      reportedBy: data.reportedBy,
      type: data.type,
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          $maxDistance: 1000,
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
    console.log("report data", data);
    const newReport = new Report(data);

    // Look for matching incidents with pending status
    const matchingIncidents = await Incident.find({
      type: data.type, //todo:check this works
      status: "pending", // Only match pending incidents
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          $maxDistance: 1000,
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
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Update a report

const MAX_DISTANCE = 1000;
const CLOUDINARY_FOLDER = "report";

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existingReport = await Report.findById(id);
    if (!existingReport) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    if (String(existingReport.reportedBy) !== data.reportedBy) {
      return res.status(403).json({
        success: false,
        message: "only the owner can update a report",
      });
    }

    if (req.file) {
      try {
        if (existingReport.cloudinaryId) {
          await cloudinary.uploader.destroy(existingReport.cloudinaryId);
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: CLOUDINARY_FOLDER,
        });
        data.image = result.secure_url;
        data.cloudinaryId = result.public_id;
        await fs.unlink(req.file.path);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
          error: error.message,
        });
      }
    }

    const updates = {};
    if (data.type) updates.type = data.type;
    if (data.description) updates.description = data.description;
    if (data.image !== undefined) updates.image = data.image;
    if (data.cloudinaryId) updates.cloudinaryId = data.cloudinaryId;
    updates.reportedBy = existingReport.reportedBy;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    //todo:test create two incidents of the same type and location and then change the type of one of them
    if (data.type) {
      const disasterType = data.type; // TODO: Validate disasterType

      if (updatedReport.incident) {
        const incident = await Incident.findById(updatedReport.incident);
        if (incident && incident.type !== disasterType) {
          // Type mismatch: Unlink from current incident
          incident.reports = incident.reports.filter(
            (reportId) => String(reportId) !== String(updatedReport._id)
          );
          await incident.save();
          updatedReport.incident = null;
          await updatedReport.save();

          // Find matching incident
          const matchingIncidents = await Incident.find({
            type: disasterType,
            status: "pending",
            location: {
              $near: {
                $geometry: existingReport.location,
                $maxDistance: MAX_DISTANCE,
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
              type: disasterType,
              title: data.title || updatedReport.title,
              description: `Auto-generated from report: ${
                data.description || updatedReport.description
              }`,
              location: existingReport.location,
              status: "active",
              reports: [updatedReport._id],
            });
            await newIncident.save();
            updatedReport.incident = newIncident._id;
            await updatedReport.save();
          }
        }
      } else {
        // No incident: Find or create one
        const matchingIncidents = await Incident.find({
          type: disasterType,
          status: "active",
          location: {
            $near: {
              $geometry: existingReport.location,
              $maxDistance: MAX_DISTANCE,
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
            type: disasterType,
            title: data.title || updatedReport.title,
            description: data.description || updatedReport.description,
            location: existingReport.location,
            status: "active",
            reports: [updatedReport._id],
          });
          await newIncident.save();
          updatedReport.incident = newIncident._id;
          await updatedReport.save();
        }
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
            { title: { $regex: search, $options: i } },
            { status: { $regex: search, $options: i } },
            { type: { $regex: search, $options: i } },
            { date: { $regex: search, $options: i } },
          ],
        }
      : {};
    const reports = await Report.find(searchFilter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    //todo:test the pagination
    console.log("limit", limit);
    res.status(200).json({
      success: true,
      page: parseInt(page),
      count: reports.length,
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
    const report = await Report.findById(req.params.id).populate(
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

    // Remove report ID from the associated Incident's reports array
    await Incident.findByIdAndUpdate(
      { _id: report.incident },
      { $pull: { reports: report._id } }
    );

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
    res.status(200).json({
      success: true,
      message: "All reports deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
  }
};
