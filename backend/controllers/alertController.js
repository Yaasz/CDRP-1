// controllers/alert.controller.js
const Alert = require("../models/alertModel");

// Create a new alert
exports.createAlert = async (req, res) => {
  try {
    const { title, description, safetyGuide } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "missing field",
      });
    }
    const alert = new Alert({ title, description, safetyGuide });
    await alert.save();

    res.status(201).json({
      success: true,
      message: "alert created successfully",
      alert: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts." });
  }
};

// Get a single alert by ID
exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alert." });
  }
};

// Update an alert by ID
exports.updateAlert = async (req, res) => {
  try {
    const { title, description } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: "Failed to update alert." });
  }
};

// Delete an alert by ID
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }

    res.json({ message: "Alert deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete alert." });
  }
};
