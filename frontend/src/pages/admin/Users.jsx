import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Edit, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('charity');
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    rejectedUsers: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'charity' || activeTab === 'government') {
        // Fetch organizations (charities or government)
        const response = await api.get('/org', {
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
            role: activeTab
          }
        });
        
        if (response.data) {
          setOrganizations(response.data.data || []);
          setTotalPages(Math.ceil((response.data.totalCount || 0) / 10));
          
          // Update stats
          setStats({
            totalUsers: response.data.totalCount || 0,
            activeUsers: response.data.data?.filter(org => org.status === 'active').length || 0,
            pendingApprovals: response.data.data?.filter(org => !org.isVerified).length || 0,
            rejectedUsers: response.data.data?.filter(org => org.status === 'inactive').length || 0
          });
        }
      } else {
        // Fetch regular users
        const response = await api.get('/user', {
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
            role: 'user'
          }
        });
        
        if (response.data) {
          setRegularUsers(response.data.data || []);
          setTotalPages(Math.ceil((response.data.totalCount || 0) / 10));
          
          // Update stats with user data
          setStats({
            totalUsers: response.data.totalCount || 0,
            activeUsers: response.data.data?.length || 0,
            pendingApprovals: 0,
            rejectedUsers: 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleVerify = async (id) => {
    try {
      const response = await api.patch(`/org/verify/${id}`);
      if (response.data && response.data.success) {
        fetchData(); // Refresh data after verification
      }
    } catch (error) {
      console.error('Error verifying organization:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await api.patch(`/org/${id}`, { status });
      if (response.data) {
        fetchData(); // Refresh data after status change
      }
    } catch (error) {
      console.error('Error updating organization status:', error);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pendingApprovals.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Rejected Users</p>
          <p className="text-2xl font-bold text-red-500">{stats.rejectedUsers.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <form onSubmit={handleSearch} className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <button type="submit" className="hidden">Search</button>
          </form>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {}}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => handleTabChange('charity')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'charity'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Charity Organizations
          </button>
          <button
            onClick={() => handleTabChange('government')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'government'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Government Officials
          </button>
          <button
            onClick={() => handleTabChange('general')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            General Users
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Organization/User Tables */}
            <div className="overflow-x-auto">
              {(activeTab === 'charity' || activeTab === 'government') && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID/Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {organizations.length > 0 ? (
                      organizations.map((org) => (
                        <tr key={org._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                {org.image ? (
                                  <img src={org.image} alt={org.organizationName} className="h-10 w-10 object-cover" />
                                ) : (
                                  <div className="bg-indigo-100 h-full w-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium">
                                      {org.organizationName}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{org.organizationName}</div>
                                <div className="text-sm text-gray-500">#{org._id.substring(0, 6)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={
                                !org.isVerified
                                  ? 'yellow'
                                  : org.status === 'active'
                                  ? 'green'
                                  : 'red'
                              }
                            >
                              {!org.isVerified ? 'Pending' : org.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">{org.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(org.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              {!org.isVerified && (
                                <button
                                  onClick={() => handleVerify(org._id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Verify
                                </button>
                              )}
                              {org.status === 'active' ? (
                                <button
                                  onClick={() => handleStatusChange(org._id, 'inactive')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(org._id, 'active')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Activate
                                </button>
                              )}
                              <Link 
                                to={`/admin/organizations/edit/${org._id}?type=${org.role}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/organizations/edit/${org._id}?tab=reset&type=${org.role}`}
                                className="text-red-600 hover:text-red-900"
                                title="Force Reset Password"
                              >
                                Reset
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No {activeTab} organizations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'general' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {regularUsers.length > 0 ? (
                      regularUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                {user.image ? (
                                  <img src={user.image} alt={user.firstName} className="h-10 w-10 object-cover" />
                                ) : (
                                  <div className="bg-indigo-100 h-full w-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium">
                                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-gray-500">#{user._id.substring(0, 6)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="green">Active</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link 
                                to={`/admin/users/details/${user._id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </Link>
                              <Link 
                                to={`/admin/users/edit/${user._id}?tab=reset`}
                                className="text-red-600 hover:text-red-900"
                                title="Force Reset Password"
                              >
                                Reset
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No regular users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 10, stats.totalUsers)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{stats.totalUsers}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 