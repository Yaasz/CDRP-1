import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FileText, MapPin, Clock, Calendar, User, ArrowLeft, CheckCircle, XCircle, AlertCircle, MessageCircle, Paperclip, SendHorizonal, Loader2 } from 'lucide-react';
import axios from 'axios';

// Mock reports data (Same as Next.js version - Ensure IDs match list page)
const mockReports = [
  { id: 1, title: "Road Blockage on Bole Road", location: "Bole Road, near Edna Mall, Addis Ababa", date: "July 15, 2024", status: "Pending", description: "Construction debris blocking one lane...", type: "Road Blockage", priority: "High", assignedTo: "Addis Ababa Road Authority", reporter: { name: "Abebe Kebede", email: "a.k@example.com", phone: "+251..." }, coordinates: { lat: 8.9993, lng: 38.7818 }, timeline: [{ date: "July 15...", event: "Report submitted", user: "Abebe Kebede" }, /*...*/], attachments: [{ name: "bole-road-debris.jpg", type: "image", size: "2.3 MB" }], comments: [{ id: 1, user: "Traffic Police", date: "July 15...", content: "Officers dispatched..." }] },
  { id: 2, title: "Power Outage in Kazanchis Area", location: "Kazanchis, Addis Ababa", date: "July 14, 2024", status: "In Progress", description: "Reported power outage...", type: "Power Outage", priority: "Critical", assignedTo: "Ethiopian Electric Utility (EEU)", reporter: { name: "Fatuma Hussein", email: "f.h@example.com", phone: "+251..." }, coordinates: { lat: 9.0111, lng: 38.7613 }, timeline: [{ date: "July 14...", event: "Report submitted", user: "Fatuma Hussein" }, /*...*/], attachments: [], comments: [{ id: 1, user: "EEU Team", date: "July 14...", content: "Fault identified..." }] },
  { id: 3, title: "Localized Flooding near St. George Church", location: "Piassa Area, Addis Ababa", date: "July 10, 2024", status: "Resolved", description: "Heavy rain caused temporary flooding...", type: "Flooding", priority: "Medium", assignedTo: "City Drainage Dept.", reporter: { name: "System", email: "N/A", phone: "N/A" }, coordinates: { lat: 9.0339, lng: 38.7518 }, timeline: [{ date: "July 10...", event: "Issue detected", user: "System" }, {date: "July 10...", event: "Resolved", user: "City Services"}], attachments: [], comments: [] },
];

// Status badge details
const statusDetails = {
  'Pending': { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: <AlertCircle className="h-4 w-4 text-yellow-600" /> },
  'In Progress': { color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: <Clock className="h-4 w-4 text-blue-600" /> },
  'Resolved': { color: 'bg-green-100 text-green-800 border border-green-200', icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
  'Unknown': { color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: <AlertCircle className="h-4 w-4 text-gray-600" /> }
};

// Priority badge details
const priorityDetails = {
  'Low': { color: 'bg-gray-100 text-gray-800 border border-gray-200' },
  'Medium': { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
  'High': { color: 'bg-orange-100 text-orange-800 border border-orange-200' },
  'Critical': { color: 'bg-red-100 text-red-800 border border-red-200' }
};

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
    setLoading(true);
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('authToken');

      try {
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        console.log(`Fetching report from: ${backendUrl}/api/report/${reportId}`);
        const response = await axios.get(`${backendUrl}/api/report/${reportId}`, { headers: authHeaders });
        
        if (response.data && response.data.data) {
            console.log("Report data received:", response.data.data);
            setReport(response.data.data);
      } else {
            console.error("Report data not found in response:", response);
            setError('Report data not found.');
        }

      } catch (err) {
        console.error("Error fetching report details:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to load report details.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();

  }, [reportId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Report</h1>
        <p className="text-gray-600 mb-6">{error || "The report could not be found or loaded."}</p>
        <Link
          to="/dashboard/reports"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
           <ArrowLeft className="h-4 w-4 mr-2" />
           Back to Reports
        </Link>
      </div>
    );
  }

  const currentStatus = report.status || 'Unknown';
  const statusInfo = statusDetails[currentStatus] || statusDetails['Unknown'];

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-4 hover:underline text-sm focus:outline-none">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1.5 leading-tight">{report.title || 'Report Title Unavailable'}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
              <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>
                      {report.location?.coordinates ? 
                          `${report.location.coordinates[1].toFixed(4)}, ${report.location.coordinates[0].toFixed(4)}` 
                          : 'Location not available'}
                  </span>
              </div>
              <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Date unknown'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-2 md:mt-0 flex-shrink-0">
            <span className={`px-2.5 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="ml-1.5">{currentStatus}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-800">Report Details</h2></div>
            <div className="p-5">
              <p className="text-gray-700 text-sm leading-relaxed">{report.description || 'No description provided.'}</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200"><h3 className="text-base font-semibold text-gray-800">Information</h3></div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Report ID:</span> <span className="font-medium text-gray-800">#{report._id}</span></div>
              <div className="pt-3 border-t border-gray-100">
                <div className="text-gray-500 mb-1">Reported By (User ID):</div>
                <div className="font-medium text-gray-800 break-all">{report.reportedBy || 'Unknown'}</div>
              </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
