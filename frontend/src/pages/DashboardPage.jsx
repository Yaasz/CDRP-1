import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, Newspaper, Loader2, ServerCrash } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Placeholder image component (replace with actual image handling if needed)
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
  <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
    <span className="text-xs text-gray-500 text-center p-2">{alt} (placeholder)</span>
  </div>
);

export default function DashboardPage() {
  const [userReports, setUserReports] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id || null);
        console.log("Dashboard User ID:", decodedToken.id);
      } catch (e) {
        console.error("Error decoding token for dashboard:", e);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('authToken');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        console.log("Dashboard fetching data...");
        const [reportsResponse, newsResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/report`, { headers: authHeaders }),
          axios.get(`${backendUrl}/api/news`)
        ]);

        console.log("Reports raw response:", reportsResponse.data);
        console.log("News raw response:", newsResponse.data);

        const allReports = reportsResponse.data.reports || [];
        let filteredReports = [];
        if (userId) {
          filteredReports = allReports.filter(report => report.reportedBy === userId);
          console.log(`Filtered ${filteredReports.length} reports for user ${userId} out of ${allReports.length} total.`);
        } else {
          console.warn("No user ID available, cannot filter user reports.");
          filteredReports = [];
        }
        setUserReports(filteredReports);

        setNews(newsResponse.data.data || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to load dashboard data.";
        setError(errorMsg + " Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Loading Failed</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-56 rounded-lg overflow-hidden relative bg-gray-200 shadow">
          <ImagePlaceholder
            src="/placeholder1.jpg"
            alt="Emergency responders at disaster site"
            className="object-cover"
          />
        </div>
        <div className="h-56 rounded-lg overflow-hidden relative bg-gray-200 shadow">
          <ImagePlaceholder
            src="/placeholder2.jpg"
            alt="Flood damaged area"
            className="object-cover"
          />
        </div>
        <div className="h-56 rounded-lg overflow-hidden relative bg-gray-200 shadow">
          <ImagePlaceholder
            src="/placeholder3.jpg"
            alt="Volunteers distributing supplies"
            className="object-cover"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Reports</h2>
          <Link
            to="/dashboard/reports/new"
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Emergency
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {userReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {userReports.map(report => (
                <div key={report._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <Link to={`/dashboard/reports/${report._id}`} className="block">
                    <h3 className="font-medium text-gray-900">{report.title || 'Untitled Report'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {report.location?.coordinates ? 
                         `Coords: ${report.location.coordinates[1].toFixed(4)}, ${report.location.coordinates[0].toFixed(4)}` 
                         : 'No location specified'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reported on: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Date unknown'}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              {!userId && !loading ? (
                <p className="text-gray-500">Could not identify user to load reports.</p>
              ) : (
                <p className="text-gray-500">You haven't reported any incidents yet.</p>
              )}
              <Link
                to="/dashboard/reports/new"
                className="text-blue-600 hover:text-blue-800 mt-2 inline-block font-medium"
              >
                Report an incident
              </Link>
            </div>
          )}
           <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
                <Link to="/dashboard/reports" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View All Reports &rarr;
                </Link>
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">News & Updates</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {news.length > 0 ? (
             news.map(item => (
              <div key={item._id} className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-16 h-16 bg-gray-300 rounded-md overflow-hidden relative">
                   <ImagePlaceholder
                       src={item.image || `/news-placeholder.jpg`}
                       alt={item.title || 'News item'}
                     className="object-cover"
                   />
                </div>
              </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{item.title || 'Untitled News'}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.content || 'No content available'}</p>
                <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Time unknown'}
                </p>
                </div>
              </div>
            ))
          ) : (
             <div className="p-8 text-center">
              <p className="text-gray-500">No news updates available at the moment.</p>
            </div>
          )}
           <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
                <Link to="/dashboard/news" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View All News &rarr;
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
