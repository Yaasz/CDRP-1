const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
// Define the Organization schema
const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "name must be text",
      },
      minlength: [5, "name must be at least 5 characters "],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    taxId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isAlphanumeric(value);
        },
        message: "taxId must be alphanumeric",
      },
    },
    image: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          return !value || validator.isURL(value);
        },
        message: "image must be a valid URL",
      },
    },
    cloudinaryId: {
      type: String,
      required: false,
    },
    mission: {
      type: String, // A brief description of the organization's mission
      default: "",
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "mission must be text",
      },
      minlength: [5, "mission must be at least 5 characters "],
      maxlength: [100, "mission too long"],
    },
    // Differentiating between two types of organizations
    role: {
      type: String,
      enum: ["charity", "government"], // Define the types of organizations
      default: "charity",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Define the types of organizations
      default: "active",
      required: true,
    },
    verificationToken: {
      type: String,
      default: null, // Token for email verification
    },
    emailVerified: {
      type: Boolean,
      default: false, // Flag to check if email is verified
    },
  },
  { timestamps: true }
);
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Create the Organization model
const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
