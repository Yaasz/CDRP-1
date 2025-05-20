const mongoose = require("mongoose");
const REPORT_THRESHOLD = process.env.REPORT_THRESHOLD || 5;
const validator = require("validator");
// Define the Incident schema
const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "type must be text",
      },
      minlength: [4, "type must be at least 4 characters "],
      //enum: ["earthquake", "flood", "fire", "storm", "other"],
    },
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "title must be text",
      },
      minlength: [4, "title must be at least 4 characters "],
    },
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "description must be text",
      },
      minlength: [4, "description must be at least 4 characters "],
      maxlength: [300, "description too long"],
    },
    dateOccurred: {
      type: Date,
      default: Date.now,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "validated", "assigned", "in progress", "critical", "resolved"],
      default: "pending",
    },
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
incidentSchema.index({ location: "2dsphere" });
// Pre-save hook to update status
incidentSchema.pre("save", async function (next) {
  if (this.isModified("reports") && this.reports.length >= REPORT_THRESHOLD) {
    this.status = "validated";
  }
  next();
});
// Create the Incident model
const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
