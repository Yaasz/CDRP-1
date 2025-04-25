const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    charities: [
      {
        charityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Charity",
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        responseMessage: {
          type: String,
          default: "",
        },
        respondedAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", AnnouncementSchema);
