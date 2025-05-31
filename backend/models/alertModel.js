const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  safetyGuide: [
    {
      type: String,
      required: false,
    },
  ],
});

module.exports = mongoose.model("alert", alertSchema);
