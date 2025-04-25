const Volunteer = require("../models/volunteerModel"); // Adjust path to your model
const CharityAd = require("../models/charityadModel"); // Adjust path to your CharityAd model

//create a volunteer
const registerVolunteer = async (req, res) => {
  const { user, name, phone, expertise, contribution, charityAdId } = req.body;

  try {
    /*change this to check if the same volunteer exits twice with in the volunteers list of the same charity ad*/
    const existingVolunteer = await Volunteer.findOne({ phone });
    if (existingVolunteer) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }
    // Create new volunteer
    const volunteer = new Volunteer({
      user,
      name,
      phone,
      expertise,
      contribution,
    });
    await volunteer.save();

    // Link volunteer to CharityAd
    const charityAd = await CharityAd.findById(charityAdId);
    if (!charityAd) {
      // If CharityAd not found, delete the volunteer and return error
      await Volunteer.findByIdAndDelete(volunteer._id);
      return res.status(404).json({
        message: "CharityAd not found, volunteer registration cancelled",
      });
    }
    charityAd.volunteers.push(volunteer._id);
    await charityAd.save();

    res
      .status(201)
      .json({ message: "Volunteer registered successfully", volunteer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering volunteer", error: error.message });
  }
};
//fetch one
const getVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    const volunteer = await Volunteer.findById(id); //.populate("user", "email");
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(200).json(volunteer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching volunteer", error: error.message });
  }
};
//update
const updateVolunteer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, expertise, contributionType } = req.body;

  try {
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Check if new phone number is unique (if provided and different)
    if (phone && phone !== volunteer.phone) {
      const existingVolunteer = await Volunteer.findOne({ phone });
      if (existingVolunteer) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }

    volunteer.name = name || volunteer.name;
    volunteer.phone = phone || volunteer.phone;
    volunteer.expertise = expertise || volunteer.expertise;
    volunteer.contributionType = contributionType || volunteer.contributionType;
    await volunteer.save();

    res
      .status(200)
      .json({ message: "Volunteer updated successfully", volunteer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating volunteer", error: error.message });
  }
};

//delete
const deleteVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Remove volunteer from CharityAd
    await CharityAd.updateMany(
      { volunteers: id },
      { $pull: { volunteers: id } }
    );

    await volunteer.deleteOne();
    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting volunteer", error: error.message });
  }
};

//fetch all
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate("userId", "email");
    res.status(200).json(volunteers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching volunteers", error: error.message });
  }
};

//delete all
const deleteAllVolunteers = async (req, res) => {
  try {
    const result = await Volunteer.deleteMany({});
    res.status(200).json({
      message: "All reports deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
