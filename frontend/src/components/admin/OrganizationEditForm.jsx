import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, RefreshCw, Upload, Camera, Key, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function OrganizationEditForm({ orgId, onClose, initialTab }) {
  const { user: currentUser } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    phone: '',
    taxId: '',
    mission: '',
    status: 'active',
    role: 'charity' // Default, will be overwritten when org data is loaded
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
    fetchOrganization();
  }, [orgId]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/org/${orgId}`);
      if (response.data && response.data.data) {
        const orgData = response.data.data;
        setOrganization(orgData);
        setFormData({
          organizationName: orgData.organizationName || '',
          email: orgData.email || '',
          phone: orgData.phone || '',
          taxId: orgData.taxId || '',
          mission: orgData.mission || '',
          status: orgData.status || 'active',
          role: orgData.role || 'charity'
        });
        setImagePreview(orgData.image || null);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
      setErrors({ general: 'Failed to load organization data' });
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
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required';
    if (!formData.mission.trim()) newErrors.mission = 'Mission statement is required';
    
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
      
      // Send the request to the organization endpoint
      const response = await api.patch(`/org/${orgId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.success) {
        // Success handling
        alert('Organization updated successfully');
        if (onClose) {
          onClose();
        } else {
          // Redirect to users page for now
          navigate('/admin/users');
        }
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update organization'
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
      // Note: This endpoint might need to be created for organizations
      const response = await api.patch(`/org/changePassword/${orgId}`, {
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
      // Note: This endpoint might need to be created for organizations
      const response = await api.patch(`/org/forceResetPassword/${orgId}`, {
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
        <h2 className="text-lg font-medium">
          Edit {formData.role === 'charity' ? 'Charity' : 'Government'} Organization
        </h2>
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
        
        {/* Organization Logo/Image */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              onClick={handleImageClick}
              className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer relative group"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Organization logo" 
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
        <p className="text-center text-sm text-gray-500">Click to upload a new organization logo</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.organizationName ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.organizationName && (
              <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
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
              Tax ID
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.taxId ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.taxId && (
              <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission Statement
            </label>
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleInputChange}
              rows="3"
              className={`w-full p-2 border ${errors.mission ? 'border-red-300' : 'border-gray-300'} rounded-md`}
            />
            {errors.mission && (
              <p className="mt-1 text-sm text-red-600">{errors.mission}</p>
            )}
          </div>
          
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
          
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="charity">Charity</option>
                <option value="government">Government</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          {/* Only show password change to organization owners or admins */}
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
          {isAdmin && (
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
            As an administrator, you can force reset this organization's password. The organization will not need to provide their current password.
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