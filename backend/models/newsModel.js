const mongoose = require("mongoose");

// Define the News Announcement schema
const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL of the image for the news announcement
      default: "",
    },
  },
  { timestamps: true }
);

// Create the News Announcement model
const NewsAnnouncement = mongoose.model("News", newsSchema);

module.exports = NewsAnnouncement;
