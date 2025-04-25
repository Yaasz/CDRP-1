const mongoose = require("mongoose");
// Define the Report schema
const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL of the image uploaded with the report
      default: "",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Public User who reported it
      required: false,
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident", // Reference to the associated Incident (null if not grouped yet)
      default: null,
    },
  },
  { timestamps: true }
);

// Create 2dsphere index for geospatial queries
reportSchema.index({ location: "2dsphere" });

// Create the Report model
const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
