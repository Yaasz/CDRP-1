const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  sex: {
    type: String,
    enum: ["male", "female"],
  },
  email: {
    type: String,
    trim: true,
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
