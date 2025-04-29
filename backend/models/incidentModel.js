const mongoose = require("mongoose");
const REPORT_THRESHOLD = 3;
// Define the Incident schema
const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      //enum: ["earthquake", "flood", "fire", "storm", "other"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
      enum: ["pending", "validated"],
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
