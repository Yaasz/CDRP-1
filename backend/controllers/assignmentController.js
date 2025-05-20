const mongoose = require("mongoose");
const Assignment = require("../models/assignmentModel");
const Incident = require("../models/incidentModel");
const Organization = require("../models/organizationModel");

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { incidentId, organizationId, notes, priorityLevel } = req.body;

    // Validate required fields
    if (!incidentId || !organizationId) {
      return res.status(400).json({
        success: false,
        message: "Incident ID and organization ID are required",
        error: "missing fields",
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(incidentId) || !mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident or organization ID",
        error: "invalid params",
      });
    }

    // Check if incident exists
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
        error: "doc not found",
      });
    }

    // Check if organization exists and is charity
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
        error: "doc not found",
      });
    }

    if (organization.role !== "charity") {
      return res.status(400).json({
        success: false,
        message: "Organization must be a charity",
        error: "invalid organization type",
      });
    }

    // Get government organization from req.user
    const governmentId = req.user.organization;
    const government = await Organization.findById(governmentId);
    
    // if (!government || government.role !== "government") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Only government organizations can assign incidents",
    //     error: "unauthorized",
    //   });
    // }

    // Check if incident is already assigned
    const existingAssignment = await Assignment.findOne({
      incident: incidentId,
      status: "active",
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "Incident is already assigned to an organization",
        error: "already assigned",
      });
    }

    // Create assignment
    const assignment = new Assignment({
      incident: incidentId,
      organization: organizationId,
      assignedBy: governmentId,
      notes: notes || "",
      priorityLevel: priorityLevel || "medium",
    });

    // Save the assignment
    await assignment.save();

    // Update incident status to assigned
    incident.status = "assigned";
    await incident.save();

    res.status(201).json({
      success: true,
      message: "Incident assigned successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10, organization } = req.query;
    const filter = {};

    // If organization ID is provided, filter by that organization
    if (organization && mongoose.Types.ObjectId.isValid(organization)) {
      filter.organization = organization;
    }

    // Get assignments with pagination
    const assignments = await Assignment.find(filter)
      .populate("incident", "title type status location")
      .populate("organization", "organizationName email phone")
      .populate("assignedBy", "organizationName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count
    const totalCount = await Assignment.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
        error: "invalid param",
      });
    }

    const assignment = await Assignment.findById(id)
      .populate("incident", "title type status location description")
      .populate("organization", "organizationName email phone")
      .populate("assignedBy", "organizationName");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
        error: "doc not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Update assignment status
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
        error: "invalid param",
      });
    }

    if (!status || !["active", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (active, completed, cancelled)",
        error: "invalid status",
      });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
        error: "doc not found",
      });
    }

    // Check if user is authorized (either government or assigned charity)
    const userOrgId = req.user.organization;
    const isAuthorized = 
      userOrgId.equals(assignment.assignedBy) || 
      userOrgId.equals(assignment.organization);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this assignment",
        error: "unauthorized",
      });
    }

    // Update assignment status
    assignment.status = status;
    await assignment.save();

    // Update incident status if assignment is completed or cancelled
    if (status === "completed" || status === "cancelled") {
      const incident = await Incident.findById(assignment.incident);
      if (incident) {
        incident.status = status === "completed" ? "resolved" : "validated";
        await incident.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Assignment status updated successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// Get assignments for an incident
exports.getAssignmentsForIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID",
        error: "invalid param",
      });
    }

    const assignments = await Assignment.find({ incident: incidentId })
      .populate("organization", "organizationName email phone")
      .populate("assignedBy", "organizationName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
}; 