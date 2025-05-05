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
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "incident",
      required: false,
    }, //todo remove this to enable ads unrelated to incidents
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "title must be text",
      },
      minlength: [4, "title must be at least 4 characters "],
      maxlength: [50, "title too long"],
    },

    image: {
      type: String,
      default: "",
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
    status: {
      type: String,
      enum: ["open", "completed"],
      default: "open",
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CharityAd", CharityAdSchema);
