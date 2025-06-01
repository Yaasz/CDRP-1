import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Target,
  MapPin,
  Users
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import api from "../../utils/api";

const CharityAdNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [success, setSuccess] = useState(null);

  // Get announcement context from navigation state
  const announcementContext = location.state;

  const [formData, setFormData] = useState({
    title: announcementContext?.announcementTitle || "",
    description: announcementContext?.announcementDescription || "",
    duration: "7", // Default 7 days (backend expects number, will convert to milliseconds)
    categories: [],
    requirements: {
      location: announcementContext?.incident?.location?.address || "",
      skills: []
    },
    status: "open", // Default status
    image: null
  });

  // Get current charity ID from localStorage
  const currentCharityId = localStorage.getItem("userId");

  useEffect(() => {
    // Pre-fill some data if coming from announcement acceptance
    if (announcementContext) {
      setFormData(prev => ({
        ...prev,
        title: `Support: ${announcementContext.announcementTitle}`,
        description: `We are organizing support for: ${announcementContext.announcementDescription}`,
        requirements: {
          ...prev.requirements,
          location: announcementContext.incident?.location?.address || 
                   (announcementContext.incident?.location?.coordinates ? 
                    `Lat: ${announcementContext.incident.location.coordinates[1]}, Lng: ${announcementContext.incident.location.coordinates[0]}` : 
                    "")
        }
      }));

      // Add relevant categories based on incident type
      if (announcementContext.incident?.type) {
        const incidentType = announcementContext.incident.type.toLowerCase();
        const relevantCategories = [];
        
        if (incidentType.includes('flood') || incidentType.includes('fire') || incidentType.includes('earthquake')) {
          relevantCategories.push('Emergency Relief', 'Disaster Response');
        }
        if (incidentType.includes('medical') || incidentType.includes('health')) {
          relevantCategories.push('Healthcare', 'Medical Aid');
        }
        
        setFormData(prev => ({
          ...prev,
          categories: relevantCategories
        }));
      }
    }
  }, [announcementContext]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.requirements.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          skills: [...prev.requirements.skills, newSkill.trim()]
        }
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills: prev.requirements.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare form data for multipart upload
      const submitData = new FormData();
      
      // Add charity ID from localStorage
      submitData.append("charity", localStorage.getItem("userId"));
      
      // Add basic fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("duration", formData.duration); // Backend converts to milliseconds
      
      // Add categories as comma-separated string (backend parses this)
      if (formData.categories.length > 0) {
        submitData.append("categories", formData.categories.join(","));
      }
      
      // Add requirements as JSON string (backend parses this)
      submitData.append("requirements", JSON.stringify({
        location: formData.requirements.location,
        skills: formData.requirements.skills
      }));
      
      // Add image if present
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await api.post("/charityAd", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess("Campaign created successfully!");
        // Redirect to success page after success
        setTimeout(() => {
          navigate("/charity/campaigns/success", {
            state: {
              campaignData: formData
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      setError(
        error.response?.data?.message || 
        "Failed to create campaign. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/charity/announcements"
          className="inline-flex items-center gap-2 text-[#7371FC] hover:text-[#6260e0] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Charity Campaign
          </h1>
          <p className="text-gray-600">
            Create a campaign to support the government announcement and mobilize volunteers.
          </p>
        </div>
      </div>

      {/* Announcement Context */}
      {announcementContext && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Related Announcement: {announcementContext.announcementTitle}
              </h3>
              <p className="text-sm text-blue-700">
                You are creating this campaign in response to a government announcement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter campaign title..."
                    className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your campaign, its goals, and how volunteers can help..."
                    className="w-full rounded-md border border-[#CDC1FF] px-3 py-2 text-sm focus:border-[#A594F9] focus:outline-none focus:ring-1 focus:ring-[#A594F9]"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Duration (days) *
                  </label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="30"
                    className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How many days will this campaign run?
                  </p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Categories
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a category..."
                    className="flex-1 border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                    variant="outline"
                    className="border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category, index) => (
                      <Badge
                        key={index}
                        className="bg-[#7371FC]/10 text-[#7371FC] border-[#7371FC]/20 flex items-center gap-1"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:bg-[#7371FC]/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Volunteer Requirements
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.requirements.location}
                    onChange={(e) => handleRequirementChange('location', e.target.value)}
                    placeholder="Enter location or area..."
                    className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill requirement..."
                      className="flex-1 border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
                      variant="outline"
                      className="border-[#CDC1FF] text-gray-700 hover:bg-[#F5EFFF]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.requirements.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.requirements.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#7371FC] transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#7371FC] hover:text-[#6260e0] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#7371FC]"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {formData.image && (
                    <p className="text-sm text-[#7371FC] mt-2">
                      Selected: {formData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7371FC] hover:bg-[#6260e0] text-white"
              >
                {loading ? "Creating Campaign..." : "Create Campaign"}
              </Button>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>By creating this campaign, you agree to coordinate volunteer efforts and provide regular updates.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CharityAdNew; 