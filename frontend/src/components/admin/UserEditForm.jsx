import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, RefreshCw, Upload, Camera, Key, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function UserEditForm({ userId, onClose, initialTab }) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user'
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forceResetData, setForceResetData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showForceResetForm, setShowForceResetForm] = useState(initialTab === 'reset');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/${userId}`);
      if (response.data && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'user'
        });
        setImagePreview(userData.image || null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setErrors({ general: 'Failed to load user data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleForceResetInputChange = (e) => {
    const { name, value } = e.target;
    setForceResetData({
      ...forceResetData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: 'Only JPG and PNG images are allowed'
      });
      return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: 'Image size should be less than 2MB'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear any previous errors
    if (errors.image) {
      setErrors({
        ...errors,
        image: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.oldPassword) newErrors.oldPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword && passwordData.newPassword.length < 6) 
      newErrors.newPassword = 'Password must be at least 6 characters';
    if (!passwordData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (passwordData.newPassword !== passwordData.confirmPassword) 
      newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForceResetForm = () => {
    const newErrors = {};
    if (!forceResetData.newPassword) newErrors.forceNewPassword = 'New password is required';
    if (forceResetData.newPassword && forceResetData.newPassword.length < 6) 
      newErrors.forceNewPassword = 'Password must be at least 6 characters';
    if (!forceResetData.confirmPassword) newErrors.forceConfirmPassword = 'Please confirm the password';
    if (forceResetData.newPassword !== forceResetData.confirmPassword) 
      newErrors.forceConfirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      // Create form data for multipart/form-data request (needed for file upload)
      const submitData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add image file if there's a new one
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        submitData.append('image', fileInputRef.current.files[0]);
      }
      
      // Send the request
      const response = await api.patch(`/user/${userId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.success) {
        // Success handling
        alert('User updated successfully');
        if (onClose) {
          onClose();
        } else {
          navigate(`/admin/users/details/${userId}`);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update user'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setSaving(true);
    try {
      const response = await api.patch(`/user/changePassword/${userId}`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data && response.data.success) {
        // Success handling
        alert('Password updated successfully');
        setShowPasswordForm(false);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({ 
        passwordError: error.response?.data?.message || 'Failed to update password'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleForceReset = async (e) => {
    e.preventDefault();
    
    if (!validateForceResetForm()) return;
    
    setSaving(true);
    try {
      const response = await api.patch(`/user/forceResetPassword/${userId}`, {
        newPassword: forceResetData.newPassword
      });
      
      if (response.data && response.data.success) {
        // Success handling
        alert('Password has been force reset successfully');
        setShowForceResetForm(false);
        setForceResetData({
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error force resetting password:', error);
      setErrors({ 
        forceResetError: error.response?.data?.message || 'Failed to force reset password'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium">Edit User</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.general && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {errors.general}
          </div>
        )}
        
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              onClick={handleImageClick}
              className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer relative group"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
            />
          </div>
        </div>
        {errors.image && (
          <p className="text-center text-sm text-red-600">{errors.image}</p>
        )}
        <p className="text-center text-sm text-gray-500">Click to upload a new profile image</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={!isAdmin}
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
            {!isAdmin && (
              <p className="mt-1 text-xs text-gray-500">Only administrators can change user roles</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {/* Only show regular password change to self or admin */}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              if (showForceResetForm) setShowForceResetForm(false);
            }}
            className="flex items-center gap-2"
          >
            <Key className="h-4 w-4" />
            {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
          </Button>

          {/* Only show force reset to admins */}
          {isAdmin && userId !== currentUser?._id && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setShowForceResetForm(!showForceResetForm);
                if (showPasswordForm) setShowPasswordForm(false);
              }}
              className="flex items-center gap-2 bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
            >
              <ShieldAlert className="h-4 w-4" />
              {showForceResetForm ? 'Hide Force Reset' : 'Force Reset Password'}
            </Button>
          )}

          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Password Change Form */}
      {showPasswordForm && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          
          {errors.passwordError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
              {errors.passwordError}
            </div>
          )}
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordInputChange}
                className={`w-full p-2 border ${errors.oldPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              />
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className={`w-full p-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Force Reset Password Form (Admin Only) */}
      {showForceResetForm && isAdmin && (
        <div className="border-t border-gray-200 p-6 bg-amber-50">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-amber-800">
            <ShieldAlert className="h-5 w-5" />
            Force Reset Password
          </h3>
          
          <p className="text-amber-700 text-sm mb-4">
            As an administrator, you can force reset this user's password. The user will not need to provide their current password.
          </p>
          
          {errors.forceResetError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
              {errors.forceResetError}
            </div>
          )}
          
          <form onSubmit={handleForceReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={forceResetData.newPassword}
                onChange={handleForceResetInputChange}
                className={`w-full p-2 border ${errors.forceNewPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              />
              {errors.forceNewPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.forceNewPassword}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={forceResetData.confirmPassword}
                onChange={handleForceResetInputChange}
                className={`w-full p-2 border ${errors.forceConfirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              />
              {errors.forceConfirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.forceConfirmPassword}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4" />
                    Force Reset Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 