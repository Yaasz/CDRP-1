const mongoose = require("mongoose");
const validator = require("validator");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "title must be text",
      },
      required: true,
      minlength: [4, "title must be at least 4 characters "],
      trim: true,
    },
    description: {
      type: String,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "description must be text",
      },
      minlength: [4, "description must be at least 4 characters "],
      maxlength: [300, "description too long"],
      required: true,
    },
    charities: [
      {
        charity: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Organization",
          required: true,
          validate: {
            validator: async function (value) {
              const Organization = mongoose.model("Organization");
              const org = await Organization.findById(value);
              return org && org.organizationType === "charity";
            },
            message:
              "The referenced organization must have organizationType 'charity'.",
          },
        },
        response: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
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
  },
  { timestamps: true }
);
AnnouncementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model("Announcement", AnnouncementSchema);
