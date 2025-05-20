import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PlatformMonitoring() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    responseTime: 0,
    uptime: 0,
    activeConnections: 0
  });
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock log data
  const mockLogs = [
    { id: 1, timestamp: new Date(Date.now() - 5000).toISOString(), level: 'error', message: 'Failed to connect to database', source: 'database' },
    { id: 2, timestamp: new Date(Date.now() - 10000).toISOString(), level: 'warn', message: 'High memory usage detected', source: 'system' },
    { id: 3, timestamp: new Date(Date.now() - 30000).toISOString(), level: 'info', message: 'User login: admin@example.com', source: 'auth' },
    { id: 4, timestamp: new Date(Date.now() - 60000).toISOString(), level: 'info', message: 'System backup completed', source: 'system' },
    { id: 5, timestamp: new Date(Date.now() - 120000).toISOString(), level: 'warn', message: 'Slow query detected in users table', source: 'database' },
    { id: 6, timestamp: new Date(Date.now() - 180000).toISOString(), level: 'error', message: 'Payment gateway connection failed', source: 'payment' },
    { id: 7, timestamp: new Date(Date.now() - 240000).toISOString(), level: 'info', message: 'New charity registered: Hope Foundation', source: 'user' },
    { id: 8, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'info', message: 'Email notifications sent successfully', source: 'email' },
    { id: 9, timestamp: new Date(Date.now() - 360000).toISOString(), level: 'warn', message: 'API rate limit approaching for key: api_123', source: 'api' },
    { id: 10, timestamp: new Date(Date.now() - 420000).toISOString(), level: 'error', message: 'File upload failed: size exceeded', source: 'storage' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, filterType]);

  const fetchData = async () => {
    setLoading(true);
    
    // Simulate API call for server metrics
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set mock data - in a real application, this would be fetched from the backend
    setMetrics({
      cpuUsage: Math.floor(Math.random() * 30) + 40, // 40-70%
      memoryUsage: Math.floor(Math.random() * 20) + 50, // 50-70%
      diskUsage: Math.floor(Math.random() * 15) + 35, // 35-50%
      responseTime: Math.floor(Math.random() * 50) + 150, // 150-200ms
      uptime: Math.floor(Math.random() * 50) + 150, // 150-200 hours
      activeConnections: Math.floor(Math.random() * 50) + 100 // 100-150 connections
    });
    
    // Set mock logs
    setLogs(mockLogs);
    setLoading(false);
  };

  const filterLogs = () => {
    let filteredLogs = [...mockLogs];
    
    // Filter by search term
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by log level
    if (filterType !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === filterType);
    }
    
    setLogs(filteredLogs);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleExport = () => {
    // In a real application, this would export logs to a CSV or JSON file
    alert('Logs exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Platform Monitoring</h1>
        <Button onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base font-medium mb-2">Server Resources</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-semibold">{metrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-semibold">{metrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${metrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Disk Usage</span>
                <span className="text-sm font-semibold">{metrics.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${metrics.diskUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base font-medium mb-2">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-sm">Avg. Response Time</span>
              <span className="text-sm font-medium">{metrics.responseTime} ms</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-medium">{metrics.uptime} hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Connections</span>
              <span className="text-sm font-medium">{metrics.activeConnections}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base font-medium mb-2">Error Rate</h2>
          <div className="flex justify-between items-center h-24">
            <div className="text-center">
              <div className="flex items-center text-green-600 mb-1">
                <ArrowDown className="h-3 w-3 mr-1" />
                <span className="text-sm">5%</span>
              </div>
              <div className="text-xs text-gray-500">vs last week</div>
              <div className="font-semibold text-xl mt-2">2.3%</div>
              <div className="text-xs text-gray-500">Error Rate</div>
            </div>
            
            <div className="w-px h-16 bg-gray-200 mx-4"></div>
            
            <div className="text-center">
              <div className="flex items-center text-red-600 mb-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span className="text-sm">12%</span>
              </div>
              <div className="text-xs text-gray-500">vs last week</div>
              <div className="font-semibold text-xl mt-2">3.1%</div>
              <div className="text-xs text-gray-500">Warning Rate</div>
            </div>
            
            <div className="w-px h-16 bg-gray-200 mx-4"></div>
            
            <div className="text-center">
              <div className="flex items-center text-green-600 mb-1">
                <ArrowDown className="h-3 w-3 mr-1" />
                <span className="text-sm">3%</span>
              </div>
              <div className="text-xs text-gray-500">vs last week</div>
              <div className="font-semibold text-xl mt-2">94.6%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-medium">System Logs</h2>
            <p className="text-sm text-gray-500 mt-1">View recent system activity and errors</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Logs</option>
              <option value="info">Info</option>
              <option value="warn">Warnings</option>
              <option value="error">Errors</option>
            </select>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.level === 'error' 
                            ? 'bg-red-100 text-red-800' 
                            : log.level === 'warn'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {log.source}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.message}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 