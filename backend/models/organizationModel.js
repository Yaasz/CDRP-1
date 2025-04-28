const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// Define the Organization schema
const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    image: {
      type: String, // URL of the organization's logo or profile image (optional)
      default: "default-logo.png",
    },
    mission: {
      type: String, // A brief description of the organization's mission
      default: "",
    },
    // Differentiating between two types of organizations
    role: {
      type: String,
      enum: ["charity", "government"], // Define the types of organizations
      default: "charity",
      required: true,
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
