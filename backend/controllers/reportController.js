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
    if (!data.title) empty.push("title");
    if (!data.description) empty.push("description");
    if (!data.reportedBy) empty.push("reportedBy");
    if (!data.latitude) empty.push("latitude");
    if (!data.longitude) empty.push("longitude");

    const user = await User.findById(data.reportedBy);
    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" });
    }
    if (empty.length > 0) {
      return res
        .status(400)
        .json({ error: `${empty.join(", ")} fields must be provided.`, empty });
    }

    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);
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
        console.error(error.message);
        return res.status(400).json({ message: "image upload failed" });
      }
    } else {
      data.image = "";
    }

    // Check for existing report
    const existingReport = await Report.findOne({
      reportedBy: data.reportedBy,
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

    const newReport = new Report({
      title: data.title,
      description: data.description,
      image: data.image,
      cloudinaryId: data.cloudinaryId,
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
      reportedBy: data.reportedBy,
    });

    const disasterTypes = ["earthquake", "flood", "fire", "storm", "other"];
    const reportTitleLower = data.title.toLowerCase();
    const disasterType =
      disasterTypes.find((type) => reportTitleLower.includes(type)) || "other";

    // Look for matching incidents with pending status
    const matchingIncidents = await Incident.find({
      type: disasterType,
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
        message: "Report created and added to existing incident",
        report: newReport,
        incident: {
          id: incident._id,
          status: incident.status,
          reportCount: incident.reports.length,
        },
      });
    } else {
      const newIncident = new Incident({
        type: disasterType,
        title: data.title,
        description: `Auto-generated from report: ${data.description}`,
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
        report: newReport,
        incident: {
          id: newIncident._id,
          status: newIncident.status,
          reportCount: newIncident.reports.length,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a report
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const existingReport = await Report.findById(id);

    if (!existingReport) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (String(existingReport.reportedBy) !== data.reportedBy) {
      return res
        .status(403)
        .json({ error: "You can only update your own reports" });
    }

    if (req.file) {
      try {
        if (existingReport.cloudinaryId) {
          await cloudinary.uploader.destroy(existingReport.cloudinaryId);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "report",
        });
        data.image = result.secure_url;
        data.cloudinaryId = result.public_id;
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Image upload failed" });
      }
    }

    const updates = {};
    if (data.title) updates.title = data.title;
    if (data.description) updates.description = data.description;
    if (data.image !== undefined) updates.image = data.image;
    if (data.cloudinaryId) updates.cloudinaryId = data.cloudinaryId;

    if (data.latitude && data.longitude) {
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ error: "Invalid latitude value" });
      }
      if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({ error: "Invalid longitude value" });
      }

      updates.location = {
        type: "Point",
        coordinates: [lon, lat],
      };
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if ((data.latitude && data.longitude) || data.title) {
      const disasterTypes = ["earthquake", "flood", "fire", "storm", "other"];
      const reportTitleLower = (
        data.title || updatedReport.title
      ).toLowerCase();
      const disasterType =
        disasterTypes.find((type) => reportTitleLower.includes(type)) ||
        "other";

      if (updatedReport.incident) {
        const incident = await Incident.findById(updatedReport.incident);
        if (incident) {
          if (data.latitude && data.longitude) {
            incident.location = updates.location;
          }
          if (data.title) {
            incident.title = data.title;
            incident.type = disasterType;
          }
          await incident.save();
        }
      } else {
        const lat = data.latitude
          ? parseFloat(data.latitude)
          : updatedReport.location.coordinates[1];
        const lon = data.longitude
          ? parseFloat(data.longitude)
          : updatedReport.location.coordinates[0];

        const matchingIncidents = await Incident.find({
          type: disasterType,
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [lon, lat],
              },
              $maxDistance: 1000,
            },
          },
          status: "active",
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
            description: `Auto-generated from report: ${
              data.description || updatedReport.description
            }`,
            location: updates.location || existingReport.location,
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
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other functions remain unchanged
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find(); //.populate("reportedBy", "name email");
    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "reportedBy",
      "name email"
    );
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Remove report ID from the associated Incident's reports array
    await Incident.findByIdAndUpdate(
      { _id: report.incident },
      { $pull: { reports: report._id } }
    );

    res.status(200).json({
      message: "Report deleted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAllReports = async (req, res) => {
  try {
    const result = await Report.deleteMany({});
    res.status(200).json({
      message: "All reports deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
