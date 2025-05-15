const Volunteer = require("../models/volunteerModel");
const mongoose = require("mongoose");
const CharityAd = require("../models/charityadModel");
const User = require("../models/userModel");
//create a volunteer
const registerVolunteer = async (req, res) => {
  const data = { ...req.body };

  try {
    if (!data.charityAdId) {
      return res.status(400).json({
        success: false,
        message: "volunteer can only register to a charity ad",
        error: "missing field",
      });
    }
    const charityAd = await CharityAd.findById(data.charityAdId);
    if (!charityAd) {
      // If CharityAd not found, delete the volunteer and return error
      return res.status(404).json({
        message: "CharityAd not found, volunteer registration cancelled",
      });
    }
    if (charityAd.status && charityAd.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "The Ad is closed, volunteer registration cancelled",
      });
    }
    const existingVolunteer = await charityAd.volunteers.some((volunteerId) =>
      volunteerId.equals(data.user)
    );
    if (existingVolunteer) {
      return res.status(400).json({ message: "You have already registered" });
    }
    // Create new volunteer
    const volunteer = new Volunteer(data);
    const saved = await volunteer.save();

    // Link volunteer to CharityAd

    charityAd.volunteers.push(volunteer._id);
    await charityAd.save();

    res.status(201).json({
      success: true,
      message: "Volunteer registered successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
//fetch one
const getVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid volunteer id",
        error: "invalid id",
      });
    }
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
        error: "document not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "internal server error",
      error: error.message,
    });
  }
};
//update
const updateVolunteer = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  try {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid volunteer id",
        error: "invalid id",
      });
    }
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
        error: "document not found",
      });
    }
    const charityAd = await CharityAd.find({ _id: charityAdId });
    if (
      (data.phone && data.phone !== volunteer.phone) ||
      (data.email && data.email !== volunteer.email)
    ) {
      const volunteer = await Volunteer.findOne({
        $or: [{ phone: data.phone }, { email: data.email }],
      });

      const existingVolunteer = volunteer
        ? charityAd.volunteers.some((id) => id.equals(volunteer._id))
        : false;
      if (existingVolunteer) {
        return res.status(400).json({
          success: false,
          message: "Phone number/ email already registered",
          error: "duplicate entry",
        });
      }
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: updatedVolunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//delete
const deleteVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid volunteer id",
        error: "invalid id",
      });
    }
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Remove volunteer from CharityAd
    await CharityAd.updateMany(
      { volunteers: id },
      { $pull: { volunteers: id } }
    );

    await volunteer.deleteOne({ _id: id });
    res
      .status(200)
      .json({ success: true, message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//fetch all
const getAllVolunteers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    console.log(search);
    const searchFilter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { sex: { $regex: search, $options: "i" } },
            { expertise: { $regex: search, $options: "i" } },
            { contribution: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const volunteers = await Volunteer.find(searchFilter)
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      page: parseInt(page),
      data: volunteers,
      totalCount: await Volunteer.countDocuments(),
      searchCount: await Volunteer.countDocuments(searchFilter),
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "internal server error",
      error: error.message,
    });
  }
};

//delete all
const deleteAllVolunteers = async (req, res) => {
  try {
    const result = await Volunteer.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No volunteers found to delete",
      });
    }
    res.status(200).json({
      success: true,
      message: "All reports deleted successfully",
      count: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  registerVolunteer,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getAllVolunteers,
  deleteAllVolunteers,
};
