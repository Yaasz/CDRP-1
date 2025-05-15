const mongoose = require("mongoose");
const validator = require("validator");
const opencage = require("opencage-api-client");

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
      minlength: [4, "type must be at least 4 characters"],
    },
    title: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          return (
            !value ||
            validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/)
          );
        },
        message: "title must be text",
      },
      minlength: [4, "title must be at least 4 characters"],
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
      minlength: [4, "description must be at least 4 characters"],
      maxlength: [300, "description must not exceed 300 characters"],
    },
    image: [
      {
        url: {
          type: String,
          required: false,
          validate: {
            validator: function (value) {
              return !value || validator.isURL(value);
            },
            message: "image must be a valid URL",
          },
        },
        cloudinaryId: {
          type: String,
          required: false,
        },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
      name: {
        type: String,
        required: false,
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      default: null,
    },
  },
  { timestamps: true }
);

// Create 2dsphere index for geospatial queries
reportSchema.index({ location: "2dsphere" });

// Pre-save middleware to geocode coordinates to location name
reportSchema.pre("save", async function (next) {
  const coords = this.location?.coordinates;

  // Run only if coordinates were modified and are valid
  if (
    this.isModified("location") &&
    Array.isArray(coords) &&
    coords.length === 2 &&
    coords.every((coord) => typeof coord === "number" && isFinite(coord))
  ) {
    try {
      const [lng, lat] = coords;

      // Check for OpenCage API key
      if (!process.env.OPENCAGE_API_KEY) {
        throw new Error("OpenCage API key is missing");
      }

      const result = await opencage.geocode({
        q: `${lat},${lng}`,
        key: process.env.OPENCAGE_API_KEY,
      });

      if (result?.results?.length > 0) {
        this.location.name = result.results[0].formatted || "Unknown location";
      } else {
        this.location.name = "Unknown location";
      }
    } catch (error) {
      console.error("OpenCage geocoding error:", error.message);
      this.location.name = "Geocoding failed";
    }
  }

  next();
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
