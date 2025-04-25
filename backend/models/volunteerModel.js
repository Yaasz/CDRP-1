const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number"], // E.164 format validation
  }, //add email field
  expertise: {
    type: String,
    required: true,
  },
  contribution: {
    type: String,
    required: true,
    enum: ["skill", "material donation", "financial aid"],
  },
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);
