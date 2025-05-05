const mongoose = require("mongoose");
const validator = require("validator");
// Define the Report schema
const reportSchema = new mongoose.Schema(
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
    },
    title: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "title must be text",
      },
      minlength: [10, "title must be at least 4 characters "],
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
      minlength: [4, "description must be atleast 4 characters "],
      maxlength: [300, "description too long"],
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

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
