const incident = require("../models/incidentModel");
const org = require("../models/organizationModel");

exports.getDash = async (req, res) => {
  try {
    const [incidentCount, charityCount, verifiedCharityCount] =
      await Promise.all([
        incident.countDocuments(),
        org.countDocuments({ role: "charity" }),
        org.countDocuments({ role: "charity", isVerified: false }),
      ]);

    res.status(200).json({
      incidentCount: incidentCount,
      allCharity: charityCount,
      pendingCharity: verifiedCharityCount,
    });
  } catch (error) {}
};
