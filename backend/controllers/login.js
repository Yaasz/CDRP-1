const Organization = require("../models/organizationModel");
const org = require("../models/organizationModel");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
  console.log("common login");
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
    });
  }
  const isUser = await user.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  const isOrg = await org.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!isOrg && !isUser) {
    return res.status(404).json({
      success: false,
      message: "no user with email/phone",
      error: "document not found",
    });
  }

  if (isUser) {
    const matchs = await bcrypt.compare(password, isUser.password);
    if (!matchs) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }
    const token = jwt.sign(
      { id: isUser._id, role: isUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      success: true,
      message: "login successful",
      token: token,
      user: isUser,
    });
  }
  if (isOrg) {
    const matchs = await bcrypt.compare(password, isOrg.password);
    if (!matchs) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }
    const token = jwt.sign(
      { id: isOrg._id, role: isOrg.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      success: true,
      message: "login successful",
      token: token,
      Organization: {
        email: isOrg.email,
        phone: isOrg.phone,
        Name: isOrg.organizationName,
      },
    });
  }
};
