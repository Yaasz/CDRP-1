import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export default function CharityEdit({ 
  activeCharity,
  saveEditedCharity,
  setEditMode,
  actionLoading
}) {
  const [editFormData, setEditFormData] = useState({
    organizationName: '',
    email: '',
    phone: '',
    taxId: '',
    mission: '',
    status: ''
  });
  
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    if (activeCharity) {
      setEditFormData({
        organizationName: activeCharity.organizationName || '',
        email: activeCharity.email || '',
        phone: activeCharity.phone || '',
        taxId: activeCharity.taxId || '',
        mission: activeCharity.mission || '',
        status: activeCharity.status || 'active'
      });
    }
  }, [activeCharity]);

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
    
    // Clear error for this field
    if (editErrors[name]) {
      setEditErrors({
        ...editErrors,
        [name]: null
      });
    }
  };

  // Validate the edit form
  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.organizationName) errors.organizationName = 'Organization name is required';
    if (!editFormData.email) errors.email = 'Email is required';
    if (!editFormData.phone) errors.phone = 'Phone is required';
    if (!editFormData.taxId) errors.taxId = 'Tax ID is required';
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    saveEditedCharity(editFormData);
  };

  if (!activeCharity) return null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Edit Organization</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name*</label>
            <input
              type="text"
              name="organizationName"
              value={editFormData.organizationName}
              onChange={handleEditInputChange}
              className={`w-full px-3 py-2 border ${editErrors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {editErrors.organizationName && <p className="mt-1 text-sm text-red-500">{editErrors.organizationName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleEditInputChange}
              className={`w-full px-3 py-2 border ${editErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {editErrors.email && <p className="mt-1 text-sm text-red-500">{editErrors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
            <input
              type="text"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditInputChange}
              className={`w-full px-3 py-2 border ${editErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {editErrors.phone && <p className="mt-1 text-sm text-red-500">{editErrors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID*</label>
            <input
              type="text"
              name="taxId"
              value={editFormData.taxId}
              onChange={handleEditInputChange}
              className={`w-full px-3 py-2 border ${editErrors.taxId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {editErrors.taxId && <p className="mt-1 text-sm text-red-500">{editErrors.taxId}</p>}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
          <textarea
            name="mission"
            value={editFormData.mission}
            onChange={handleEditInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={editFormData.status}
            onChange={handleEditInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        {editErrors.submit && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
            {editErrors.submit}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white"
            disabled={actionLoading === activeCharity._id}
          >
            {actionLoading === activeCharity._id ? (
              <RefreshCw className="animate-spin mr-1" size={16} />
            ) : null}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
} 