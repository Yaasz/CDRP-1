const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
// Define the Public User schema
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "name must be text",
      },
      minlength: [3, "name must be at least 3 characters "],
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.matches(value.trim(), /^[A-Za-z0-9\s.,!?'"&()-]+$/);
        },
        message: "name must be text",
      },
      minlength: [3, "name must be at least 3 characters "],
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
      unique: true,
    },
    password: {
      type: String,
      required: true,
      //note: this is commented out to allow for easier testing of the password field
      /*validate:{
        validator:validator.isStrongPassword,
        message: "password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
      }*/
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    image: {
      type: String, // URL of the profile image (optional)
      required: false,
      validate: {
        validator: function (value) {
          return !value || validator.isURL(value); //note:allows empty string for image or valid URL
        },
        message: "image must be a valid URL",
      },
    },
    cloudinaryId: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
//
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Create the Public User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
