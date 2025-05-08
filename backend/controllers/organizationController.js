const Organization = require("../models/organizationModel");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
// Create a new organization
exports.createOrganization = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.name || !data.email || !data.phone || !data.password) {
      return res.status(400).json({
        success: false,
        message: "name, email, phone and password are required",
      });
    }
    if (data.role && data.role == "government") {
      if (!req.user || req.user.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "government organization can only be created by admin",
        });
      }
    }
    const nameExists = await Organization.findOne({ name: data.name });
    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: "organization name taken",
      });
    }
    const exists = await Organization.findOne({
      $or: [{ email: data.email }, { phone: data.phone }],
    });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Organization with the same email/phone already exists",
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
        return res.status(400).json({
          success: false,
          message: "image upload failed",
          error: error.message,
        });
      }
    }
    console.log("data", data);
    const organization = new Organization(data);

    const savedOrganization = await organization.save();
    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: savedOrganization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: i } },
            { role: { $regex: search, $options: i } },
          ],
        }
      : {};
    const organizations = await Organization.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      count: await Organization.countDocuments(), //todo:check if there is a way to access the tot count in db
      data: organizations,
      page: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
        error: "document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
    if (data.role && data.role == "government") {
      return res.status(400).json({
        success: false,
        message: "government organization can only be created by admin",
      });
    }

    if (
      data.name !== exists.name ||
      data.email !== exists.email ||
      data.phone !== exists.phone
    ) {
      const nameExists = await Organization.findOne({ name: data.name });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: "organization name taken",
        });
      }
      const exists = await Organization.findOne({
        $or: [{ email: data.email }, { phone: data.phone }],
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Organization with the same email/phone already exists",
        });
      }
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
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
        error: "document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
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
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
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
      return res.status(401).json({
        success: false,
        message: "user not found",
        error: "document not found",
      });
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
        email: org.email,
        role: org.role,
        phone: org.phone,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Organization.findById(id);
    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
        error: "document not found",
      });
    }
    if (org.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Organization already verified",
      });
    }
    org.isVerified = true;
    org.status = "active";
    await org.save();
    res.status(200).json({
      success: true,
      message: "Organization verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
