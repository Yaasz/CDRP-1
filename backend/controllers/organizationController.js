const Organization = require("../models/organizationModel");
const CharityAd = require("../models/charityadModel");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// Create a new organization
exports.createOrganization = async (req, res) => {
  try {
    const data = { ...req.body };
    // Remove empty fields
    Object.keys(data).forEach((key) => {
      if (data[key] === "") delete data[key];
    });
    if (
      !data.organizationName ||
      !data.email ||
      !data.phone ||
      !data.password
    ) {
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
    const nameExists = await Organization.findOne({
      organizationName: data.organizationName,
    });
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

    const verificationToken = crypto.randomBytes(32).toString("hex");
    data.verificationToken = verificationToken;

    const organization = new Organization(data);
    const savedOrganization = await organization.save();
    const verifyLink = `${process.env.FRONTEND_URL}/verify-org-email/?token=${verificationToken}`;

    await transporter
      .sendMail({
        from: `"Organization email verification" <${process.env.EMAIL}>`,
        to: data.email,
        subject: `verify your email`,
        html: `
          <p>Hi ${savedOrganization.organizationName},</p>
          <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
          <a href="${verifyLink}">Verify Email</a>
          `,
      })
      .catch(async (error) => {
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email",
          error: error.message,
        });
      });

    res.status(201).json({
      success: true,
      message:
        "Registered successfully. Please check your email to verify your account.",
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
    const { page = 1, limit = 5, search = "" } = req.query;
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const organizations = await Organization.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      totalCount: await Organization.countDocuments(),
      searchCount: await Organization.countDocuments(searchFilter),
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

    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid organization id",
        error: "invalid param",
      });
    }
    const exists = await Organization.findById(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }
    if (data.role && data.role == "government") {
      if (req.user.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "government organization can only be created by admin",
        });
      }
    }
    if (
      data.organizationName &&
      data.organizationName !== exists.organizationName
    ) {
      const nameExists = await Organization.findOne({
        organizationName: data.organizationName,
      });
      if (nameExists && nameExists._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "organization name taken",
        });
      }
    }

    //check for phone number
    if (data.phone && data.phone !== exists.phone) {
      const phoneExists = await Organization.findOne({
        phone: data.phone,
      });
      if (phoneExists && phoneExists._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Organization with the same phone number already exists",
        });
      }
    }
    //check for email
    if (data.email && data.email !== exists.email) {
      const emailExists = await Organization.findOne({
        email: data.email,
      });
      if (emailExists && emailExists._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Organization with the same email already exists",
        });
      }
      const verificationToken = crypto.randomBytes(32).toString("hex");
      data.verificationToken = verificationToken;
      const verifyLink = `${process.env.FRONTEND_URL}/verify-org-email/?token=${verificationToken}`;
      await transporter
        .sendMail({
          from: `"Organization email verification" <${process.env.EMAIL}>`,
          to: data.email,
          subject: `verify your email`,
          html: `
          <p>Hi ${exists.organizationName},</p>
          <p>Your email has been updated. Please click the link below to verify your new email address:</p>
          <a href="${verifyLink}">Verify Email</a>
          `,
        })
        .catch(async (error) => {
          return res.status(500).json({
            success: false,
            message: "Failed to send verification email",
            error: error.message,
          });
        });
      data.emailVerified = false; // Reset email verification status
      // Convert email to lowercase
      data.email = data.email.toLowerCase();
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
      if (exists.image !== "" || undefined) {
        data.image = exists.image;
        data.cloudinaryId = exists.cloudinaryId;
      }
    }

    Object.keys(data).forEach((key) => {
      if (data[key] === "") delete data[key];
    });

    const organization = await Organization.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Organization updated and verification email sent successfully",
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
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid organization id",
        error: "invalid param",
      });
    }
    const organization = await Organization.findByIdAndDelete(id);
    const charityAds = await CharityAd.find({ charity: id });
    for (const charityAd of charityAds) {
      await charityAd.deleteOne();
    }
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
        error: "document not found",
      });
    }

    if (organization.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(organization.cloudinaryId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
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
    try {
      await cloudinary.api.delete_resources_by_prefix("orgProfile");
    } catch (error) {
      console.error("failed to delete all report images", error);
    }
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
        id: org._id,
        email: org.email,
        role: org.role,
        phone: org.phone,
        organizationName: org.organizationName,
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
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid organization id",
        error: "invalid param",
      });
    }
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

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const org = await Organization.findOne({ verificationToken: token });

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

    org.emailVerified = true;
    org.verificationToken = null; // Clear the verification token after successful verification
    await org.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
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
        message: "old and new password must be provided",
      });
    }
    const org = await Organization.findById(id);
    const passwordMatches = await bcrypt.compare(oldPassword, org.password);
    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }

    org.password = newPassword;
    await org.save();

    res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
    console.log(error);
  }
};
