import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  Pencil, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  Filter,
  FileBarChart,
  ArrowUp,
  BarChart2,
  Calendar,
  MapPin,
  Users,
  BriefcaseBusiness
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function GovernmentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeIncidents: 0,
    responseTime: 0,
    registeredCharities: 0,
    pendingApprovals: 0
  });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [charities, setCharities] = useState([]);

  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch incident statistics
        const incidentResponse = await api.get('/incidents', { 
          params: { 
            status: 'active',
            limit: 1
          } 
        }).catch(() => ({ data: { totalCount: 0 } }));
        
        // Fetch charity statistics
        const charityResponse = await api.get('/organizations', {
          params: {
            role: 'charity',
            limit: 1
          }
        }).catch(() => ({ data: { totalCount: 0 } }));
        
        // Fetch pending approvals
        const pendingResponse = await api.get('/approvals/pending', {
          params: {
            limit: 1
          }
        }).catch(() => ({ data: { totalCount: 0 } }));
        
        // Fetch recent incidents
        const recentIncidentsResponse = await api.get('/incidents', {
          params: {
            limit: 10,
            sort: '-createdAt'
          }
        }).catch(() => ({ data: { data: [] } }));

        // Fetch active charities
        const charitiesResponse = await api.get('/organizations', {
          params: {
            role: 'charity',
            status: 'active',
            isVerified: true
          }
        }).catch(() => ({ data: [] }));

        // Sample data in case API fails
        const sampleIncidents = [
          { id: 'INC-001', type: 'Flood', location: 'Central District', status: 'In Progress', reportedAt: new Date(Date.now() - 7200000) },
          { id: 'INC-002', type: 'Fire', location: 'North Zone', status: 'Critical', reportedAt: new Date(Date.now() - 18000000) },
          { id: 'INC-003', type: 'Storm', location: 'East Coast', status: 'Resolved', reportedAt: new Date(Date.now() - 86400000) }
        ];

        const sampleCharities = [
          { id: 1, name: 'Red Cross', description: 'Medical Assistance', status: 'Active' },
          { id: 2, name: 'Food Bank', description: 'Food Distribution', status: 'Active' }
        ];

        // Set dashboard data
        setStats({
          activeIncidents: incidentResponse.data?.totalCount || 24,
          responseTime: 1.2, // Mock average response time in hours
          registeredCharities: charityResponse.data?.totalCount || 12,
          pendingApprovals: pendingResponse.data?.totalCount || 8
        });
        
        // Use API data if available, otherwise use sample data
        if (recentIncidentsResponse.data && recentIncidentsResponse.data.data) {
          setRecentIncidents(recentIncidentsResponse.data.data);
        } else {
          // Fallback mock data if API call fails
          setRecentIncidents([
            { _id: '1', type: 'Flood', location: 'Central District', status: 'In Progress', reportedAt: new Date(Date.now() - 7200000) },
            { _id: '2', type: 'Fire', location: 'North Zone', status: 'Critical', reportedAt: new Date(Date.now() - 18000000) },
            { _id: '3', type: 'Storm', location: 'East Coast', status: 'Resolved', reportedAt: new Date(Date.now() - 86400000) }
          ]);
        }

        // Use API data if available, otherwise use sample data
        setCharities(charitiesResponse.data?.length ? charitiesResponse.data : sampleCharities);

      } catch (err) {
        console.error('Error fetching government dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        // Set fallback data
        setStats({
          activeIncidents: 24,
          responseTime: 1.2,
          registeredCharities: 12,
          pendingApprovals: 8
        });
        setRecentIncidents([
          { _id: '1', type: 'Flood', location: 'Central District', status: 'In Progress', reportedAt: new Date(Date.now() - 7200000) },
          { _id: '2', type: 'Fire', location: 'North Zone', status: 'Critical', reportedAt: new Date(Date.now() - 18000000) },
          { _id: '3', type: 'Storm', location: 'East Coast', status: 'Resolved', reportedAt: new Date(Date.now() - 86400000) }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format the time for display (e.g., "2 hours ago", "1 day ago")
  const formatTimeAgo = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const reportDate = new Date(date);
    const diffMs = now - reportDate;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return `${diffHrs} hours ago`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
          <Button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Government Dashboard</h1>
        <p className="text-gray-600">Welcome to the CDRP Government Portal</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Incidents" 
          value={stats.activeIncidents.toLocaleString()} 
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-red-100" 
          iconColor="text-red-600"
          trend={+8}
          trendLabel="vs. last week"
        />
        
        <StatCard 
          title="Response Time" 
          value={`${stats.responseTime}h`} 
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-green-100" 
          iconColor="text-green-600"
          trend={-0.3}
          trendLabel="vs. last month"
          trendDown
        />
        
        <StatCard 
          title="Registered Charities" 
          value={stats.registeredCharities} 
          icon={<BriefcaseBusiness className="w-5 h-5" />}
          iconBg="bg-blue-100" 
          iconColor="text-blue-600"
          trend={+2}
          trendLabel="vs. last month"
        />
        
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon={<FileBarChart className="w-5 h-5" />}
          iconBg="bg-orange-100" 
          iconColor="text-orange-600"
          progress={stats.pendingApprovals * 10}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Map Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Disaster Activity Map</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">Today</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md">Week</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md">Month</button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg relative overflow-hidden">
              {/* Mock Map Visualization */}
              <div className="absolute inset-0 bg-blue-50">
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-gray-500">Interactive disaster map will be displayed here</p>
                  </div>
                </div>
                
                {/* Incident markers */}
                <div className="absolute top-1/4 left-1/3 h-4 w-4 rounded-full bg-red-500 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 h-4 w-4 rounded-full bg-orange-500 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 h-4 w-4 rounded-full bg-red-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Response Status Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Response Status</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Medical Resources</span>
                <span className="text-sm font-semibold text-gray-800">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Food Supply</span>
                <span className="text-sm font-semibold text-gray-800">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Shelter Capacity</span>
                <span className="text-sm font-semibold text-gray-800">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Volunteers</span>
                <span className="text-sm font-semibold text-gray-800">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <Link to="/government/reports" className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              View detailed reports <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Recent Incidents</h3>
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" /> Last 7 days
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident, index) => (
                  <tr key={incident._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{incident.type}</div>
                          <div className="text-xs text-gray-500">ID: {incident._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        N/A
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
                        incident.status === 'Critical' 
                          ? 'bg-red-100 text-red-800' 
                          : incident.status === 'In Progress' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimeAgo(incident.reportedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/government/incidents/${incident._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent incidents
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Link 
            to="/government/incidents"
            className="flex items-center justify-center w-full text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all incidents <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Active Charities */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Charities</h2>
          <Link to="/government/charities" className="text-[#7371FC] hover:text-[#A594F9] flex items-center">
            <span className="mr-1">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="space-y-4">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  {/* Placeholder for organization logo */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{charity.name}</h3>
                  <p className="text-gray-500">{charity.description}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm">
                {charity.status}
              </Badge>
            </div>
          ))}
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
              {Math.abs(trend)}%
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