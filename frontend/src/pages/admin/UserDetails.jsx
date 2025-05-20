import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Mail, Phone, Calendar, Shield, XCircle } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/${userId}`);
      if (response.data && response.data.data) {
        setUser(response.data.data);
      } else {
        setError('Failed to load user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError(error.response?.data?.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/admin/users/edit/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center">
        <XCircle className="h-5 w-5 mr-2" />
        <p>{error || 'User not found'}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/users" 
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Button onClick={handleEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">User Information</h2>
          <Badge variant={user.role === 'admin' ? 'purple' : 'blue'}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                {user.image ? (
                  <img src={user.image} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-500">ID: {user._id}</p>
              </div>
            </div>
            
            {/* User Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </p>
                <p className="font-medium">{user.phone}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created At
                </p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last Updated
                </p>
                <p className="font-medium">{formatDate(user.updatedAt)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  User Role
                </p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History - Placeholder for future implementation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">No recent activity data available</p>
        </div>
      </div>
    </div>
  );
} 