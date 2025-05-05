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
    console.log(data);
    //todo:check for existing phone number
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
        return res.status(400).json({
          success: false,
          message: "failed to upload image. try again later",
          error: error.message,
        });
      }
    }
    console.log(data);
    const user = new User(data);

    const savedUser = await user.save();
    //cleanup local temp file

    res.status(201).json({
      success: true,
      message: "registered successfully",
      data: savedUser,
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
    console.log(search);
    const searchFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    console.log("search filter", JSON.stringify(searchFilter, null, 2));
    const users = await User.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "all users",
      page: parseInt(page),
      count: await User.countDocuments(), //todo:use model.countDocuments() for every controller
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
    const user = await User.findById(id);
    const data = { ...req.body };
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
    if (!req.file) {
      data.image = user.image;
      data.cloudinaryId = user.cloudinaryId;
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
    if (data.role) {
      return res.status(400).json({
        success: false,
        message: "role change is not allowed",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
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
    //todo:decide to delete or not
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
    //todo:check what happens to the image in cloudinary use in all
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
        full_name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
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
//todo:add email and phone number verification firebase and nodemailer
