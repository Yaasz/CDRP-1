// CharityAd model
const mongoose = require("mongoose");

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
          return org && org.organizationType === "charity";
        },
        message:
          "The referenced organization must have organizationType 'charity'.",
      },
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "incident",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
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

module.exports =
  mongoose.models.CharityAd || mongoose.model("CharityAd", CharityAdSchema);
