const User = require("../models/userModel");
const Report = require("../models/reportModel"); //usage commented out
const Volunteer = require("../models/volunteerModel");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

// Create a new public user
exports.createUser = async (req, res) => {
  try {
    const data = { ...req.body };
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile",
        });
        data.image = result.secure_url;
        data.cloudinaryId = result.public_id;
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error("failed to upload image to cloudinary", error.message);
        return res.status(400).json({
          success: false,
          message: "image upload failed try again later",
        });
      }
    }
    const user = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      image: data.image || "default-profile.png",
      cloudinaryId: data.cloudinaryId,
    });

    const savedUser = await user.save();
    //cleanup local temp file

    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all public users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single public user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update public user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const data = { ...req.body };
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.file) {
      if (user.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(user.cloudinaryId);
        } catch (error) {
          console.log(
            "Old image not removed if Cloudinary ID is invalid ",
            error.message
          );
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile",
      });
      data.image = result.secure_url;
      data.cloudinaryId = result.public_id;
      await fs.unlink(req.file.path);
    }
    if (!req.file) {
      data.image = user.image;
      data.cloudinaryId = user.cloudinaryId;
    }
    //cleanup local temp file
    await fs.unlink(req.file.path);

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

// Delete public user and remove from all references
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    {
      /*
    // Remove user from Reports (set reportedBy to null)
    await Report.updateMany(
      { reportedBy: user._id },
      { $set: { reportedBy: null } }
    );

    // Remove user from Volunteers (delete volunteer records referencing this user)
    const volunteers = await Volunteer.find({ userId: user._id });
    for (const volunteer of volunteers) {
      // Remove volunteer from CharityAd
      await CharityAd.updateMany(
        { volunteers: volunteer._id },
        { $pull: { volunteers: volunteer._id } }
      );
      // Delete the volunteer record
      await Volunteer.findByIdAndDelete(volunteer._id);
    }
*/
    }
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete all users
exports.deleteAll = async (req, res) => {
  try {
    const delAll = await User.deleteMany({});
    res.status(200).json({
      success: true,
      message: "all users deleted",
      count: delAll.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Identifier and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "incorrect password" });
    }

    const token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
