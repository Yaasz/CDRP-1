import { useState, useEffect } from "react";
import {
  Bell,
  User,
  Upload,
  Camera,
  Mail,
  Phone,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// Reusable Image Placeholder for Avatar
const AvatarPlaceholder = ({ src, alt, size = 28, ...props }) => (
  <div
    className={`h-${size} w-${size} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-300`}
    {...props}
  >
    {src && src !== "/placeholder-avatar.jpg" ? (
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
        loading="lazy"
      />
    ) : (
      // Simple initial or icon placeholder
      <User
        className={`h-${Math.floor(size / 2)} w-${Math.floor(
          size / 2
        )} text-gray-400`}
      />
    )}
  </div>
);

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
    notifications: {
      email: true,
      sms: true,
      newsletter: false,
    },
  });

  // State for form data during editing
  const [formData, setFormData] = useState(userData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(`/user/${user.id}`);
        console.log("Fetched user data:", response);
        if (response.data && response.data.user) {
          const fetchedUser = response.data.user;

          // Transform backend data to match our form structure
          const transformedData = {
            firstName: fetchedUser.firstName || "",
            lastName: fetchedUser.lastName || "",
            email: fetchedUser.email || "",
            phone: fetchedUser.phone || "",
            image: fetchedUser.image || "",
            // If notifications are not in the backend yet, use default values
            notifications: fetchedUser.notifications || {
              email: true,
              sms: true,
              newsletter: false,
            },
          };

          setUserData(transformedData);
          setFormData(transformedData);
          setImagePreviewUrl(fetchedUser.image || "");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          "Failed to load your profile information. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("notifications.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        notifications: { ...formData.notifications, [key]: checked },
      });
    } else if (type === "checkbox") {
      // Handle other top-level checkboxes if needed
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (type, size)
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit example
        alert("Image size should be less than 2MB.");
        return;
      }
      setProfileImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Create temporary preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");

    try {
      // Create a FormData object to handle file upload
      const profileFormData = new FormData();

      // Append user data
      profileFormData.append("firstName", formData.firstName);
      profileFormData.append("lastName", formData.lastName);
      profileFormData.append("email", formData.email);
      profileFormData.append("phone", formData.phone);

      // Add the profile image if selected
      if (profileImageFile) {
        profileFormData.append("image", profileImageFile);
        console.log(
          "Adding image file:",
          profileImageFile.name,
          profileImageFile.type,
          profileImageFile.size
        );
      }

      // Log form data contents for debugging
      console.log("Submitting profile update for user ID:", user.id);
      console.log("Form data fields:");
      for (const pair of profileFormData.entries()) {
        // Don't log the actual file blob, just the name
        if (pair[0] === "image") {
          console.log(pair[0], pair[1].name);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      // Send update request to the API
      const response = await api.patch(`/user/${user.id}`, profileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile update response:", response.data);

      if (response.data && response.data.data) {
        const updatedUser = response.data.data;

        // Update local state with the response
        setUserData({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          image: updatedUser.image || "",
          notifications: updatedUser.notifications || formData.notifications,
        });

        // If we have a new image URL from the response, update it
        if (updatedUser.image) {
          setImagePreviewUrl(updatedUser.image);
        }

        // If there was a blob URL for preview, revoke it
        if (profileImageFile) {
          URL.revokeObjectURL(imagePreviewUrl);
          setProfileImageFile(null);
        }

        // Update auth context with the new user info if needed
        if (login) {
          const updatedAuthUser = {
            token: localStorage.getItem("authToken"),
            accountType: localStorage.getItem("accountType"),
            user: {
              id: user.id,
              role: user.role,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
              image: updatedUser.image,
            },
          };
          console.log("Updating auth context with:", updatedAuthUser);
          login(updatedAuthUser);
        }

        setSuccessMessage("Profile updated successfully!");
      } else {
        // Handle case where response doesn't have expected data structure
        console.error("Invalid response format:", response);
        setError("Received an invalid response from the server");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Error response:", err.response);

      let errorMessage =
        "Failed to update your profile. Please try again later.";

      // Check for specific error responses
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "User not found. Please log out and log in again.";
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form data to original userData
  const handleCancel = () => {
    setFormData(userData);
    setImagePreviewUrl(userData.image);
    setProfileImageFile(null); // Clear any staged file
    setError(null);
    setSuccessMessage("");
  };

  // Get user's full name
  const getFullName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    } else if (formData.firstName) {
      return formData.firstName;
    } else if (formData.lastName) {
      return formData.lastName;
    }
    return "User";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      </div>

      {/* Profile Card - Simplified actions */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative">
                <AvatarPlaceholder
                  src={imagePreviewUrl}
                  alt={getFullName()}
                  size={28}
                />
                <label
                  htmlFor="profile-image-upload"
                  className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2 cursor-pointer shadow-md border-2 border-white hover:bg-blue-700 transition-colors"
                >
                  <Camera size={16} className="text-white" />
                  <input
                    id="profile-image-upload"
                    name="profileImage"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800">
                {getFullName()}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{formData.email}</p>
              {user && user.role && (
                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-200">
                  {user.role === "admin"
                    ? "Administrator"
                    : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (Simplified - only showing Profile Settings) */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          {/* Active Tab */}
          <span className="border-b-2 border-blue-600 py-3 px-1 text-sm font-semibold text-blue-600 whitespace-nowrap">
            Profile Settings
          </span>
        </nav>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start border border-red-200">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-start border border-green-200">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          {/* Personal Info Section */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 ..."
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="p-6 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
