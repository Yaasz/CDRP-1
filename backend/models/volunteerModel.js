const mongoose = require("mongoose");
const validator = require("validator");

const VolunteerSchema = new mongoose.Schema({
  charityAdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CharityAd",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
      },
      message: "full name must be text",
    },
    minlength: [5, "full name must be at least 5 characters "],
  },
  sex: {
    type: String,
    enum: ["male", "female"],
  },
  age: {
    type: Number,
    required: true,
    min: [1, "age must be at least 1"],
    max: [120, "age must be at most 120"],
    validate: {
      validator: function (value) {
        return Number.isInteger(value);
      },
      message: "age must be an integer",
    },
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number"], // E.164 format validation
  },
  expertise: {
    type: String,
    required: true,
  },
  contribution: {
    type: String,
    required: true,
    // enum: ["skill", "material donation", "financial aid"],
  },
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);
