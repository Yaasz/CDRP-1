import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

const CampaignEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [success, setSuccess] = useState(null);

  // Get current charity ID from localStorage
  const currentCharityId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "7",
    categories: [],
    requirements: {
      location: "",
      skills: []
    },
    status: "open",
    image: null
  });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoadingCampaign(true);
      setError(null);
      
      const response = await api.get(`/charityAd/${id}`);
      
      if (response.data && response.data.data) {
        const campaignData = response.data.data;
        
        // Check if this campaign belongs to the current charity
        if (campaignData.charity && campaignData.charity._id !== currentCharityId) {
          setError("You don't have permission to edit this campaign.");
          return;
        }
        
        // Calculate duration in days from creation to expiry
        let durationDays = "7";
        if (campaignData.createdAt && campaignData.expiresAt) {
          const created = new Date(campaignData.createdAt);
          const expires = new Date(campaignData.expiresAt);
          const diffTime = Math.abs(expires - created);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          durationDays = diffDays.toString();
        }
        
        setFormData({
          title: campaignData.title || "",
          description: campaignData.description || "",
          duration: durationDays,
          categories: campaignData.categories || [],
          requirements: {
            location: campaignData.requirements?.location || "",
            skills: campaignData.requirements?.skills || []
          },
          status: campaignData.status || "open",
          image: null // Keep existing image, don't load it into form
        });
        
        // Set image preview if exists
        if (campaignData.image) {
          setImagePreview(campaignData.image);
        }
      } else {
        setError("Campaign not found.");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setError("Failed to load campaign details. Please try again.");
    } finally {
      setLoadingCampaign(false);
    }
  };

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
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
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
      
      // Add basic fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("duration", formData.duration);
      
      // Add categories as comma-separated string
      if (formData.categories.length > 0) {
        submitData.append("categories", formData.categories.join(","));
      }
      
      // Add requirements as JSON string
      submitData.append("requirements", JSON.stringify({
        location: formData.requirements.location,
        skills: formData.requirements.skills
      }));
      
      // Add image if new image is selected
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await api.put(`/charityAd/${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess("Campaign updated successfully!");
        // Redirect to campaign detail after success
        setTimeout(() => {
          navigate(`/charity/campaigns/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      setError(
        error.response?.data?.message || 
        "Failed to update campaign. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingCampaign) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7371FC] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/charity/campaigns">
            <Button className="bg-[#7371FC] text-white hover:bg-[#6260e0]">
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/charity/campaigns/${id}`}
          className="inline-flex items-center gap-2 text-[#7371FC] hover:text-[#6260e0] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaign
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Campaign
          </h1>
          <p className="text-gray-600">
            Update your campaign details and requirements.
          </p>
        </div>
      </div>

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
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Campaign preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#7371FC] transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
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
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg border border-[#E5D9F2] p-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7371FC] hover:bg-[#6260e0] text-white"
              >
                {loading ? "Updating Campaign..." : "Update Campaign"}
              </Button>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>Changes will be saved and volunteers will see the updated information.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CampaignEdit; 