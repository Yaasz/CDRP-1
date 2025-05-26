import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, Newspaper, Loader2 } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Placeholder image component (replace with actual image handling if needed)
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
  <div
    className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`}
    {...props}
  >
    <span className="text-xs text-gray-500 text-center p-2">
      {alt} (placeholder)
    </span>
  </div>
);

export default function DashboardPage() {
  const [userReports, setUserReports] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's reports
        const reportsResponse = await api.get(`/report/user/${user?.id}`);
        //console.log("User Reports:", reportsResponse.data.reports);
        setUserReports(reportsResponse.data.reports || []);

        // Fetch latest news
        const newsResponse = await api.get("/news");
        console.log("Latest News:", newsResponse.data.news);
        setNews(newsResponse.data.news || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);
  return (
    <div className="space-y-8">
      {/* Hero banner - Replaced next/image with ImagePlaceholder */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#7371FC]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-56 rounded-lg overflow-hidden relative bg-gray-200 shadow">
            <ImagePlaceholder
              src="/placeholder1.jpg" // Placeholder src
              alt="Emergency responders at disaster site"
              className="object-cover"
            />
          </div>
          <div className="h-56 rounded-lg overflow-hidden relative bg-gray-200 shadow">
            <ImagePlaceholder
              src="/placeholder2.jpg" // Placeholder src
              alt="Flood damaged area"
              className="object-cover"
            />
          </div>
          <div className="h-56 rounded-lg overflow-hidden relative bg-gray-200 shadow">
            <ImagePlaceholder
              src="/placeholder3.jpg" // Placeholder src
              alt="Volunteers distributing supplies"
              className="object-cover"
            />
          </div>
        </div>
      )}
      {/* My Reports */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Reports</h2>
          <Link
            to="/dashboard/reports/new" // Changed href to to
            className="flex items-center bg-[#7371FC] hover:bg-[#A594F9] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Emergency
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-[#7371FC]" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-600 bg-red-50">{error}</div>
          ) : userReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {userReports.map((report) => (
                <div
                  key={report._id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <Link
                    to={`/dashboard/reports/${report._id}`}
                    className="block"
                  >
                    {" "}
                    {/* Changed href to to */}
                    <h3 className="font-medium text-gray-900">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {report.location.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reported on: {report.createdAt}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                You haven't reported any incidents yet.
              </p>
              <Link
                to="/dashboard/reports/new" // Changed href to to
                className="text-[#7371FC] hover:text-[#A594F9] mt-2 inline-block font-medium"
              >
                Report your first incident
              </Link>
            </div>
          )}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
            <Link
              to="/dashboard/reports"
              className="text-sm font-medium text-[#7371FC] hover:text-[#A594F9]"
            >
              View All Reports &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* News & Updates */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          News & Updates
        </h2>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-[#7371FC]" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-600 bg-red-50">{error}</div>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 flex items-start"
              >
                {" "}
                {/* Use items-start */}
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-md overflow-hidden relative">
                    {/* Replaced next/image */}
                    <ImagePlaceholder
                      src={`/news-${item.id}.jpg`} // Placeholder src
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  {" "}
                  {/* Use flex-1 to take remaining space */}
                  <h3 className="font-medium text-[#7371FC] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {item.content}
                  </p>{" "}
                  {/* Limit lines */}
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1.5" /> {/* Adjusted margin */}
                    {item.time}
                  </p>
                </div>
              </div>
            ))
          )}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
            <Link
              to="/dashboard/news"
              className="text-sm font-medium text-[#7371FC] hover:text-[#A594F9]"
            >
              View All News &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
