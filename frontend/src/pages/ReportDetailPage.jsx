import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FileText, MapPin, Clock, Calendar, User, ArrowLeft, CheckCircle, XCircle, AlertCircle, MessageCircle, Paperclip, SendHorizonal } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';

// Status badge details
const statusDetails = {
  'Pending': { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: <AlertCircle className="h-4 w-4 text-yellow-600" /> },
  'In Progress': { color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: <Clock className="h-4 w-4 text-blue-600" /> },
  'Resolved': { color: 'bg-green-100 text-green-800 border border-green-200', icon: <CheckCircle className="h-4 w-4 text-green-600" /> }
};

// Priority badge details
const priorityDetails = {
  'Low': { color: 'bg-gray-100 text-gray-800 border border-gray-200' },
  'Medium': { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
  'High': { color: 'bg-orange-100 text-orange-800 border border-orange-200' },
  'Critical': { color: 'bg-red-100 text-red-800 border border-red-200' }
};

// Incident type display names
const incidentTypeNames = {
  'flood': 'Flood',
  'earthquake': 'Earthquake',
  'fire': 'Fire',
  'landslide': 'Landslide',
  'roadblock': 'Road Blockage',
  'poweroutage': 'Power Outage',
  'storm': 'Storm',
  'other': 'Other'
};

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await api.get(`/report/${reportId}`);
      console.log('Report details:', response.data);
      setReport(response.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !report || submittingComment) return;

    try {
      setSubmittingComment(true);
      
      // In a real implementation, you would have a comments API endpoint
      // For now, we'll just update the UI as if the comment was added
      const comment = {
        id: Date.now(),
        user: user ? (user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.name || user.email || 'User') 
          : "Anonymous",
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        content: newComment
      };

      // Simulate update (in real app, call API then update state)
      setReport(prevReport => ({
        ...prevReport,
        comments: [...(prevReport.comments || []), comment]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Get the status from the incident
  const getReportStatus = (report) => {
    if (!report) return 'Pending';
    
    if (report.incident) {
      if (typeof report.incident === 'object') {
        const status = report.incident.status;
        switch(status) {
          case 'active': return 'In Progress';
          case 'resolved': return 'Resolved';
          case 'pending':
          default: return 'Pending';
        }
      } else {
        // If we just have an incident ID string, default to pending
        return 'Pending';
      }
    }
    
    return 'Pending';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Get location string from coordinates
  const getLocationString = (location) => {
    if (!location || !location.coordinates) return 'Unknown location';
    return `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`;
  };

  // Get incident type display name
  const getIncidentType = (report) => {
    // Try to get type from report directly
    if (report.type) {
      const typeLower = report.type.toLowerCase();
      return incidentTypeNames[typeLower] || report.type;
    }
    
    // Try to get from incident
    if (report.incident && typeof report.incident === 'object' && report.incident.type) {
      const typeLower = report.incident.type.toLowerCase();
      return incidentTypeNames[typeLower] || report.incident.type;
    }
    
    return 'Uncategorized';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h1>
        <p className="text-gray-600 mb-6">The report you're looking for doesn't exist or has been removed.</p>
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

  const reportStatus = getReportStatus(report);
  
  // Determine priority based on incident type
  const incidentType = report.type || (report.incident && typeof report.incident === 'object' ? report.incident.type : '');
  const reportPriority = 
    incidentType?.toLowerCase() === 'earthquake' || incidentType?.toLowerCase() === 'fire' 
      ? 'High' 
      : incidentType?.toLowerCase() === 'flood' || incidentType?.toLowerCase() === 'storm'
        ? 'Medium' 
        : 'Low';

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-4 hover:underline text-sm focus:outline-none">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1.5 leading-tight">{report.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
              <div className="flex items-center"><FileText className="h-3.5 w-3.5 mr-1 text-gray-400" /><span>{getIncidentType(report)}</span></div>
              <div className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /><span>{getLocationString(report.location)}</span></div>
              <div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1 text-gray-400" /><span>{formatDate(report.createdAt)}</span></div>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-2 md:mt-0 flex-shrink-0">
            <span className={`px-2.5 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusDetails[reportStatus]?.color}`}>
              {statusDetails[reportStatus]?.icon}
              <span className="ml-1.5">{reportStatus}</span>
            </span>
             {reportPriority && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityDetails[reportPriority]?.color}`}>
                    {reportPriority} Priority
                </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Details, Attachments, Comments) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-800">Report Details</h2></div>
            <div className="p-5">
              <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
              {report.image && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Images</h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                      <Paperclip className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-blue-600 truncate">Incident Photo</div>
                      </div>
                      <a 
                        href={report.image} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 text-xs font-medium hover:underline ml-2 flex-shrink-0"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-800">Comments & Updates</h2></div>
            <div className="p-5 space-y-4">
              {report.comments && report.comments.length > 0 ? (
                report.comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-3">
                     <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
                      {typeof comment.user === 'string' 
                        ? comment.user.substring(0, 2).toUpperCase()
                        : typeof comment.user === 'object' && comment.user.name 
                          ? comment.user.name.substring(0, 2).toUpperCase()
                          : 'U'}
                     </div>
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-md p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-800">
                          {typeof comment.user === 'string' 
                            ? comment.user
                            : typeof comment.user === 'object' && comment.user.name 
                              ? comment.user.name
                              : 'User'}
                        </span>
                        <span className="text-xs text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-xs text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
              )}
            </div>
            {/* Add Comment Form */}
             <div className="p-5 border-t border-gray-200 bg-gray-50">
                 <form onSubmit={handleAddComment} className="flex items-start space-x-3">
                     <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment or update..."
                        rows="2"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                    />
                     <button
                         type="submit"
                         disabled={!newComment.trim() || submittingComment}
                         className={`px-3 py-2 rounded-md text-white ${
                           !newComment.trim() || submittingComment 
                             ? 'bg-blue-300 cursor-not-allowed' 
                             : 'bg-blue-600 hover:bg-blue-700'
                         }`}
                         title="Add Comment"
                    >
                        <SendHorizonal className="h-4 w-4" />
                    </button>
                 </form>
             </div>
          </div>
        </div>

        {/* Right Column (Info, Timeline) */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200"><h3 className="text-base font-semibold text-gray-800">Information</h3></div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Report ID:</span> <span className="font-medium text-gray-800">#{report._id.substring(0, 8)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Priority:</span> <span className={`font-medium px-2 py-0.5 rounded text-xs ${priorityDetails[reportPriority]?.color}`}>{reportPriority}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Incident:</span> <span className="font-medium text-gray-800 text-right">{report.incident ? `#${typeof report.incident === 'string' ? report.incident.substring(0, 8) : report.incident._id.substring(0, 8)}` : 'Not assigned'}</span></div>
              <div className="pt-3 border-t border-gray-100">
                <div className="text-gray-500 mb-1">Reported On:</div>
                <div className="font-medium text-gray-800">{formatDate(report.createdAt)}</div>
                {report.updatedAt && report.updatedAt !== report.createdAt && (
                  <div className="text-xs text-gray-600">Updated: {formatDate(report.updatedAt)}</div>
                )}
              </div>
              {report.reportedBy && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-gray-500 mb-1">Reported By:</div>
                  <div className="font-medium text-gray-800">
                    {typeof report.reportedBy === 'object' ? 
                      (report.reportedBy.firstName && report.reportedBy.lastName 
                        ? `${report.reportedBy.firstName} ${report.reportedBy.lastName}`
                        : report.reportedBy.name || report.reportedBy.email || 'Unknown') 
                      : 'Anonymous'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Card */}
          {report.location && report.location.coordinates && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-200"><h3 className="text-base font-semibold text-gray-800">Location</h3></div>
              <div className="p-5">
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden border border-gray-200 mb-2">
                  {/* Simple map placeholder */}
                  <div className="text-center">
                    <MapPin className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {report.location.coordinates[1].toFixed(6)}, {report.location.coordinates[0].toFixed(6)}
                    </p>
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${report.location.coordinates[1]},${report.location.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block text-center"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          )}

          {/* Image Card (if there's an image) */}
          {report.image && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200"><h3 className="text-base font-semibold text-gray-800">Uploaded Image</h3></div>
              <div className="aspect-w-16 aspect-h-9">
                <img src={report.image} alt="Report" className="object-cover w-full h-full" />
              </div>
              <div className="p-3 text-center">
                <a 
                  href={report.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Full Size
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
