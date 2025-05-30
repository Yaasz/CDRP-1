const mongoose = require("mongoose");
const REPORT_THRESHOLD = process.env.REPORT_THRESHOLD || 5;
const validator = require("validator");
const opencage = require("opencage-api-client");
const axios = require("axios");
const categoryToPriority = {
  Urgent: "high",
  Medium: "medium",
  "Not Urgent": "low",
  Unknown: null,
};

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
    status: {
      type: String,
      enum: [
        "pending",
        "validated",
        "assigned",
        "in progress",
        "critical",
        "resolved",
      ],
      default: "pending",
    },
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
incidentSchema.index({ location: "2dsphere" });
// Pre-save hook to update status
incidentSchema.pre("save", async function (next) {
  // Check if reports were modified and if the status should change to validated
  if (this.isModified("reports")) {
    if (this.reports.length >= REPORT_THRESHOLD) {
      this.status = "validated";
    } else {
      this.status = "pending";
    }
  }

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

  // Call FastAPI when status changes to validated
  if (this.isModified("status") && this.status === "validated") {
    try {
      const [lng, lat] = this.location.coordinates;
      const fastApiPayload = {
        incidents: [
          {
            disaster_type: this.type,
            latitude: lat,
            longitude: lng,
          },
        ],
      };
      console.log("Calling FastAPI with payload:", fastApiPayload);
      const fastApiResponse = await axios.post(
        `${process.env.FAST_API}/categorize-incidents-gps/`,
        fastApiPayload,
        { timeout: 10000 }
      );
      console.log("FastAPI response:", fastApiResponse.data);

      const category = fastApiResponse.data?.categories?.[0] || {
        category: "Unknown",
        wereda: "Unknown",
      };
      const mappedPriority = categoryToPriority[category.category];

      if (mappedPriority) {
        this.priority = mappedPriority;
        console.log("Priority set to:", mappedPriority);
      }
      if (category.wereda !== "Unknown") {
        this.location.name = category.wereda;
      }
    } catch (error) {
      console.error("FastAPI categorization failed:", error.message);
      // Do not block save if FastAPI fails
    }
  }
  next();
});

// Create the Incident model
const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
