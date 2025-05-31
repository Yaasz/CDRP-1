const mongoose = require("mongoose");
const validator = require("validator");
// Define the News Announcement schema
const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&():;.+-]+$/);
        },
        message: "title must be text with allowed special characters",
      },
      minlength: [4, "title must be at least 4 characters "],
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
    images: [
      {
        url: {
          type: String,
          required: false,
          validate: {
            validator: function (value) {
              return !value || validator.isURL(value);
            },
            message: "Image must be a valid URL",
          },
        },
        cloudinaryId: {
          type: String,
          required: false,
        },
      },
    ],
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
    },
  },
  { timestamps: true }
);

// Create the News Announcement model
const NewsAnnouncement = mongoose.model("News", newsSchema);

module.exports = NewsAnnouncement;
