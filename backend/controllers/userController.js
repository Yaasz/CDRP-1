const User = require("../models/userModel");
const mongoose = require("mongoose");
const Volunteer = require("../models/volunteerModel");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

// Create a new public user
exports.createUser = async (req, res) => {
  try {
    const data = { ...req.body };
    //console.log(data);
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    const existingPhone = await User.find({ phone: data.phone });
    if (existingPhone.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
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
        console.error(
          "failed to upload user image to cloudinary",
          error.message
        );
        res.status(400).json({
          success: false,
          message: "failed to upload image. try again later",
          error: error.message,
        });
      }
    }
    const user = new User(data);
    const savedUser = await user.save();
    const token = await jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("saved user", savedUser);
    res.status(201).json({
      success: true,
      message: "registered successfully",
      data: savedUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get all public users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "all users",
      page: parseInt(page),
      totalCount: await User.countDocuments(),
      searchCount: await User.countDocuments(searchFilter),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
        error: "document not found",
      });
    }

    res.status(200).json({
      message: "user fetched by id",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Update public user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: "invalid param",
      });
    }
    const user = await User.findById(id);
    const data = { ...req.body };
    // Allow admins to edit any profile, but regular users can only edit their own
    // if (req.user.role !== 'admin' && req.user.id.toString() !== id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "you can only update your own profile",
    //     error: "unauthorized access",
    //   });
    // }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "document not found",
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
    if (data.email) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }
    if (data.phone) {
      const existingUser = await User.findOne({ phone: data.phone });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
    }
    // if (data.role) {
    //   if (req.user.role !== "admin") {
    //     return res.status(400).json({
    //       success: false,
    //       message: "only admin can update user role",
    //     });
    //   }
    // }
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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

    const deletedUser = await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//delete all users
exports.deleteAll = async (req, res) => {
  try {
    const delAll = await User.deleteMany({});
    try {
      await cloudinary.api.delete_resources_by_prefix("profile");
    } catch (error) {
      console.error("failed to delete all profile images", error);
    }
    res.status(200).json({
      success: true,
      message: "all users deleted",
      count: delAll.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Identifier and password required",
        error: "missing fields",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "user with email/password not found  " });
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
        full_name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password required",
        error: "missing fields",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "document not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "incorrect password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.forceResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.params;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
        error: "missing fields",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "document not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully by admin",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};