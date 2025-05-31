import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

export default function ReportSuccessPage() {
  const location = useLocation();
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    // Process the report data from location state
    if (location.state?.report) {
      console.log('Report data in success page:', location.state.report);
      setReport(location.state.report);
    }
  }, [location.state]);

  // Format date in a user-friendly way
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy h:mm a');
    } catch (error) {
      try {
        return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
      } catch (innerError) {
        return 'Unknown date';
      }
    }
  };

  // Get type display name
  const getTypeDisplayName = (type) => {
    if (!type) return 'Other';
    const typeMap = {
      flood: 'Flood',
      earthquake: 'Earthquake',
      fire: 'Fire',
      landslide: 'Landslide',
      roadblock: 'Road Blockage',
      poweroutage: 'Power Outage',
      storm: 'Storm',
      other: 'Other'
    };
    return typeMap[type.toLowerCase()] || type;
  };

  // Get coordinates as a formatted string
  const getLocationString = (location) => {
    if (!location) return 'Location not available';
    
    if (location.type === 'Point' && Array.isArray(location.coordinates)) {
      return `${location.coordinates[1].toFixed(6)}, ${location.coordinates[0].toFixed(6)}`;
    }
    
    return 'Location format not recognized';
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:underline text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Report Submitted Successfully!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your report. Your contribution helps keep the community informed and safe.
        </p>
      </div>

     

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <p className="text-blue-800 text-sm">
          Your report has been submitted to our system. Our team will review it shortly.
          You can view the status of your report in the dashboard.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/dashboard/reports/new"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Another Report
        </Link>
      </div>
    </div>
  );
}
