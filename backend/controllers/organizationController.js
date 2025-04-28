const Organization = require("../models/organizationModel");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
// Create a new organization
exports.createOrganization = async (req, res) => {
  try {
    const data = { ...req.body };
    const exists = await Organization.findOne({ email: data.email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Organization with the same email exists",
      });
    }
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "orgProfile",
        });
        data.image = result.secure_url;
        data.cloudinaryId = result.public_id;
        await fs.unlink(req.file.path);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "image upload failed" });
      }
    } else {
      data.image = "default org profile";
    }
    const organization = new Organization({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      image: data.image || "",
      mission: data.mission,
      role: data.role,
      cloudinaryId: data.cloudinaryId || "",
    });

    const savedOrganization = await organization.save();
    res.status(201).json({
      success: true,
      data: savedOrganization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message, // Will catch unique constraint errors for name/email
    });
  }
};

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single organization by ID
exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const exists = await Organization.findById(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (req.file) {
      if (exists.cloudinaryId) {
        await cloudinary.uploader.destroy(exists.cloudinaryId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "orgProfile",
      });
      data.image = result.secure_url;
      data.cloudinaryId = result.public_id;
      await fs.unlink(req.file.path);
    } else {
      data.image = exists.image;
      data.cloudinaryId = exists.cloudinaryId;
      await fs.unlink(req.file.path);
    }
    const organization = await Organization.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error", // Will catch unique constraint or validation errors
    });
  }
};

// Delete organization
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get organizations by type (charity or government)
exports.getOrganizationsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!["charity", "government"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization type. Must be "charity" or "government"',
      });
    }

    const organizations = await Organization.find({ role: role });

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const delAll = await Organization.deleteMany({});
    res.status(200).json({
      success: true,
      message: "all organizations deleted",
      count: delAll.deletedCount,
    });
  } catch (error) {
    console.error("delete all orgs", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "the fields are required" });
    }

    const org = await Organization.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!org) {
      return res.status(401).json({ message: "user doesn't exist" });
    }

    const match = await bcrypt.compare(password, org.password);
    if (!match) {
      return res.status(400).json({ message: "password incorrect" });
    }

    const token = await jwt.sign(
      { id: org._id, role: org.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      success: true,
      token,
      data: {
        id: org._id,
        email: org.email,
        type: org.type,
        phone: org.phone,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
