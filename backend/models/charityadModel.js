// CharityAd model
const mongoose = require("mongoose");
const validator = require("validator");
const CharityAdSchema = new mongoose.Schema(
  {
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      validate: {
        validator: async function (value) {
          const Organization = mongoose.model("Organization");
          const org = await Organization.findById(value);
          return org && org.role === "charity";
        },
        message:
          "The referenced organization must have organizationType 'charity'.",
      },
    },
    /*incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "incident",
      required: false,
    }, */
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&():;.+-]+$/);
        },
        message: "title must be text with allowed special characters",
      },
      minlength: [4, "title must be at least 4 characters "],
      maxlength: [50, "title too long"],
    },
    image: {
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
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&():;.+-]+$/);
        },
        message: "description must be text with allowed special characters",
      },
      minlength: [4, "description must be at least 4 characters "],
      maxlength: [1000, "description too long"],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
        default: [],
      },
    ],
    duration: {
      type: Number,
      required: true,
      default: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + this.duration);
      },
    },
    categories: [
      {
        type: String,
        required: false,
      },
    ],
    requirements: {
      location: {
        type: String,
        required: false,
      },
      skills: [
        {
          type: String,
          required: false,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CharityAd", CharityAdSchema);
