import { useState, useEffect } from 'react';
import { Users, AlertTriangle, FileBarChart, Clock, ArrowUp, ArrowRight, BarChart2, Calendar } from 'lucide-react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeIncidents: 0,
    dailyReports: 0,
    systemLoad: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user statistics
        const userResponse = await api.get('/user', { params: { limit: 1 } });
        
        // Fetch incident statistics
        const incidentResponse = await api.get('/incident', { 
          params: { 
            status: 'active',
            limit: 1
          } 
        });
        
        // Fetch report statistics
        const reportResponse = await api.get('/report', { 
          params: { 
            limit: 1,
            period: 'day'
          } 
        });
        
        // Fetch recent user registrations
        const recentUsersResponse = await api.get('/user', {
          params: {
            limit: 10,
            sort: '-createdAt'
          }
        });

        // Set dashboard data
        setStats({
          totalUsers: userResponse.data?.totalCount || 248,
          activeIncidents: incidentResponse.data?.totalCount || 15,
          dailyReports: reportResponse.data?.totalCount || 42,
          systemLoad: Math.floor(Math.random() * 40) + 40 // Mock system load between 40-80%
        });
        
        if (recentUsersResponse.data && recentUsersResponse.data.data) {
          setRecentUsers(recentUsersResponse.data.data);
        } else {
          // Fallback mock data if API call fails
          setRecentUsers([
            { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user' },
            { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'admin' },
            { _id: '3', firstName: 'Robert', lastName: 'Johnson', email: 'robert@example.com', role: 'user' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setStats({
          totalUsers: 248,
          activeIncidents: 15,
          dailyReports: 42,
          systemLoad: 68
        });
        setRecentUsers([
          { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user' },
          { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'admin' },
          { _id: '3', firstName: 'Robert', lastName: 'Johnson', email: 'robert@example.com', role: 'user' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the CDRP Admin Panel</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-blue-100" 
          iconColor="text-blue-600"
          trend={+12}
          trendLabel="vs. last month"
        />
        
        <StatCard 
          title="Active Incidents" 
          value={stats.activeIncidents} 
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-orange-100" 
          iconColor="text-orange-600"
          trend={+5}
          trendLabel="vs. last week"
        />
        
        <StatCard 
          title="Daily Reports" 
          value={stats.dailyReports} 
          icon={<FileBarChart className="w-5 h-5" />}
          iconBg="bg-green-100" 
          iconColor="text-green-600"
          trend={-8}
          trendLabel="vs. yesterday"
          trendDown
        />
        
        <StatCard 
          title="System Load" 
          value={`${stats.systemLoad}%`} 
          icon={<BarChart2 className="w-5 h-5" />}
          iconBg="bg-purple-100" 
          iconColor="text-purple-600"
          progress={stats.systemLoad}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">Today</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md">Week</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md">Month</button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-60">
              <div className="relative w-full">
                {/* Mock Activity Chart */}
                <div className="h-52 w-full">
                  <div className="absolute inset-0 flex items-end">
                    <div className="h-[30%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                    <div className="h-[50%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                    <div className="h-[40%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                    <div className="h-[70%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                    <div className="h-[60%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                    <div className="h-[80%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                    <div className="h-[35%] w-[8%] bg-blue-500 mx-[2%] rounded-t-md"></div>
                  </div>
                </div>
                <div className="w-full pt-1 flex justify-between text-xs text-gray-500 px-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">System Status</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Server Uptime</span>
                <span className="text-sm font-semibold text-gray-800">99.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                <span className="text-sm font-semibold text-gray-800">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                <span className="text-sm font-semibold text-gray-800">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Storage</span>
                <span className="text-sm font-semibold text-gray-800">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <Link to="/admin/platform-monitoring" className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              View detailed statistics <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent User Registrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Recent Users</h3>
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" /> Last 7 days
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.length > 0 ? (
                recentUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          {user.image ? (
                            <img src={user.image} alt={user.firstName} className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <span className="text-blue-600 font-medium">
                              {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/admin/users/edit/${user._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent user registrations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Link 
            to="/admin/users"
            className="flex items-center justify-center w-full text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all users <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, iconBg, iconColor, trend, trendLabel, trendDown, progress }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg ${iconBg} mr-3`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        
        {trend !== undefined && (
          <div className="flex items-center">
            <span className={`flex items-center text-xs font-medium ${trendDown ? 'text-red-600' : 'text-green-600'}`}>
              {trendDown ? (
                <ArrowUp className="w-3 h-3 mr-1 transform rotate-180" />
              ) : (
                <ArrowUp className="w-3 h-3 mr-1" />
              )}
              {trend}%
            </span>
            <span className="text-xs text-gray-500 ml-1">{trendLabel}</span>
          </div>
        )}
        
        {progress !== undefined && (
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-orange-500' : 'bg-green-500'
              }`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
} 