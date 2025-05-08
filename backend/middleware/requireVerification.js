const Organization = require("../models/organizationModel");

const requireVerification = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.user.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (organization.status !== "active") {
      return res.status(403).json({ message: "Organization is not verified" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = requireVerification;
