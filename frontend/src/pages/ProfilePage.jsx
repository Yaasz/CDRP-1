import { useState, useEffect } from 'react';
import { Bell, User, Upload, Camera, Mail, Phone } from 'lucide-react';

// Reusable Image Placeholder for Avatar
const AvatarPlaceholder = ({ src, alt, size = 28, ...props }) => (
    <div className={`h-${size} w-${size} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-300`} {...props}>
        {src && src !== '/placeholder-avatar.jpg' ? (
             <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy"/>
        ) : (
             // Simple initial or icon placeholder
             <User className={`h-${Math.floor(size/2)} w-${Math.floor(size/2)} text-gray-400`} />
        )}
    </div>
);

export default function ProfilePage() {
  // Mock user data - replace with actual data fetching later
  const [userData, setUserData] = useState({
    fullName: 'Abebe Kebede',
    email: 'abebe.kebede@example.com',
    phone: '+251 911 123456',
    profileImage: '/placeholder-avatar.jpg', // Use a placeholder path initially
    volunteerStatus: 'Community Volunteer',
    notifications: {
      email: true,
      sms: true,
      newsletter: false
    }
  });

  // State for form data during editing
  const [formData, setFormData] = useState(userData);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const [profileImageFile, setProfileImageFile] = useState(null); // State for new image file
  const [imagePreviewUrl, setImagePreviewUrl] = useState(userData.profileImage); // State for preview

  // Keep form data in sync with user data unless actively editing something else
  useEffect(() => {
    setFormData(userData);
    setImagePreviewUrl(userData.profileImage);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
        const key = name.split('.')[1];
         setFormData({
            ...formData,
            notifications: { ...formData.notifications, [key]: checked }
         });
    } else if (type === 'checkbox') {
        // Handle other top-level checkboxes if needed
    }
     else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Basic validation (type, size)
          if (!file.type.startsWith('image/')) {
              alert("Please select an image file.");
              return;
          }
           if (file.size > 2 * 1024 * 1024) { // 2MB limit example
               alert("Image size should be less than 2MB.");
               return;
           }
          setProfileImageFile(file);
          setImagePreviewUrl(URL.createObjectURL(file)); // Create temporary preview URL
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Saving user data:', formData);
    console.log('New profile image file:', profileImageFile);

    // Simulate API call
    setTimeout(() => {
      // In a real app:
      // 1. Upload profileImageFile if it exists. Get the new URL.
      // 2. Update formData with the new image URL if successful.
      // 3. Send formData to the API to save user details.
      // 4. On success, update the main userData state.

      // Mock success: Update userData with formData
      // If there was a new image, update the image path in the final data
      const finalData = { ...formData };
      if (profileImageFile) {
          // In this mock, we just keep the preview URL, but ideally,
          // it would be the URL returned from the upload service.
          finalData.profileImage = imagePreviewUrl;
          // Normally revoke object URL after upload: URL.revokeObjectURL(imagePreviewUrl)
      }
      setUserData(finalData);
      setProfileImageFile(null); // Clear the file state
      setIsSubmitting(false);
      alert("Profile updated successfully!");
    }, 1500);
  };

  // Reset form data to original userData
  const handleCancel = () => {
    setFormData(userData);
    setImagePreviewUrl(userData.profileImage);
    setProfileImageFile(null); // Clear any staged file
  };

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
                 <AvatarPlaceholder src={imagePreviewUrl} alt={formData.fullName} size={28} />
                 <label htmlFor="profile-image-upload" className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2 cursor-pointer shadow-md border-2 border-white hover:bg-blue-700 transition-colors">
                   <Camera size={16} className="text-white" />
                   <input id="profile-image-upload" name="profileImage" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                 </label>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800">{formData.fullName}</h2>
              <p className="text-sm text-gray-600 mb-2">{formData.email}</p>
              {formData.volunteerStatus && (
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-200">
                  {formData.volunteerStatus}
                </div>
              )}
            </div>

             {/* Actions (Simplified - integrated into form save/cancel) */}
             {/* <div className="mt-4 sm:mt-0 flex gap-2 justify-center sm:justify-end flex-shrink-0">
                Button actions are handled by the form below now
             </div> */}
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
           {/* Inactive Tab Example */}
           {/* <a href="#" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-3 px-4 text-sm font-medium whitespace-nowrap">
             Password
           </a> */}
        </nav>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Personal Info Section */}
           <div className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                     <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400"/></div>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-gray-400"/></div>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251 ..." className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                    </div>
                    {/* Add other fields like address etc. if needed */}
                </div>
           </div>

           {/* Notification Settings Section */}
           <div className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <fieldset className="space-y-4">
                    <legend className="sr-only">Notification Settings</legend>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="notifications.email" name="notifications.email" type="checkbox" checked={formData.notifications.email} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications.email" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive updates via email.</p>
                      </div>
                    </div>
                     <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="notifications.sms" name="notifications.sms" type="checkbox" checked={formData.notifications.sms} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications.sms" className="font-medium text-gray-700">SMS Notifications</label>
                        <p className="text-gray-500">Get text messages for urgent alerts.</p>
                      </div>
                    </div>
                     <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="notifications.newsletter" name="notifications.newsletter" type="checkbox" checked={formData.notifications.newsletter} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications.newsletter" className="font-medium text-gray-700">Newsletter</label>
                        <p className="text-gray-500">Receive our periodic newsletter.</p>
                      </div>
                    </div>
                </fieldset>
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
               {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />}
               {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
