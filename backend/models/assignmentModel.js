const mongoose = require("mongoose");
const validator = require("validator");

// Define the Assignment schema
const assignmentSchema = new mongoose.Schema(
  {
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      validate: {
        validator: async function (value) {
          const Organization = mongoose.model("Organization");
          const org = await Organization.findById(value);
          return org && org.role === "charity";
        },
        message: "The assigned organization must have role 'charity'.",
      },
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      validate: {
        validator: async function (value) {
          const Organization = mongoose.model("Organization");
          const org = await Organization.findById(value);
          return org && org.role === "government";
        },
        message: "Only government organizations can assign incidents.",
      },
    },
    notes: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          return !value || validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "Notes must contain valid text",
      },
      maxlength: [500, "Notes too long"],
    },
    priorityLevel: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Create the Assignment model
const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment; 