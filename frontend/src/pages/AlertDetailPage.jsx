import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function AlertDetailPage() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock alert data (in real app, this would fetch from API)
  const mockAlerts = {
    1: {
      id: 1,
      title: "Severe Weather Warning",
      description: "Heavy rainfall and strong winds expected in the metropolitan area. Potential for flooding in low-lying areas.",
      location: "Metro Area",
      fullDescription: "A significant weather system is approaching the metropolitan area, bringing with it heavy rainfall (50-80mm expected) and strong winds reaching up to 70 km/h. The combination of these conditions poses a serious risk of flooding, particularly in low-lying areas and near waterways. Residents in affected areas should take immediate precautions to protect their property and ensure their safety.",
      instructions: [
        "Avoid driving through flooded roads",
        "Secure loose outdoor items that could become projectiles",
        "Stay indoors and avoid unnecessary travel",
        "Keep emergency supplies ready including flashlight, water, and battery-powered radio",
        "Monitor local weather updates regularly"
      ],
      issuedAt: "2024-01-15T10:30:00Z",
      expiresAt: "2024-01-16T18:00:00Z",
      affectedAreas: ["Downtown District", "Riverside Area", "Industrial Zone", "Suburban North"],
      emergencyContacts: [
        { name: "Emergency Services", number: "911" },
        { name: "Local Emergency Management", number: "(555) 123-4567" },
        { name: "Weather Information Hotline", number: "(555) WEATHER" }
      ]
    },
    2: {
      id: 2,
      title: "Heat Wave Advisory",
      description: "Extreme temperatures reaching 40°C expected for the next 3 days. Stay hydrated and avoid outdoor activities during peak hours.",
      location: "City Center",
      fullDescription: "An intense heat wave is forecasted to affect the region for the next three days, with temperatures expected to reach dangerous levels of 40°C (104°F) during peak afternoon hours. This extreme heat poses serious health risks, particularly for vulnerable populations including elderly residents, young children, and those with pre-existing medical conditions.",
      instructions: [
        "Stay indoors during peak heat hours (10 AM - 6 PM)",
        "Drink plenty of water throughout the day",
        "Wear light-colored, loose-fitting clothing when outdoors",
        "Seek air-conditioned spaces when possible",
        "Check on elderly neighbors and relatives frequently",
        "Never leave children or pets in parked vehicles"
      ],
      issuedAt: "2024-01-15T06:00:00Z",
      expiresAt: "2024-01-18T20:00:00Z",
      affectedAreas: ["City Center", "Business District", "Residential South", "Shopping Areas"],
      emergencyContacts: [
        { name: "Emergency Services", number: "911" },
        { name: "Health Department", number: "(555) 234-5678" },
        { name: "Cooling Centers Info", number: "(555) COOLING" }
      ]
    },
    3: {
      id: 3,
      title: "Power Outage Alert",
      description: "Scheduled maintenance will cause power interruptions in several neighborhoods. Backup generators recommended.",
      location: "North District",
      fullDescription: "Planned electrical system maintenance will result in temporary power outages affecting multiple neighborhoods in the North District. This maintenance is essential for improving the reliability and safety of the electrical grid. The outages are scheduled to minimize disruption to residents and businesses.",
      instructions: [
        "Prepare backup power sources for essential devices",
        "Charge all electronic devices before the outage begins",
        "Stock up on non-perishable food items",
        "Have flashlights and batteries readily available",
        "Unplug sensitive electronic equipment to prevent damage from power surges",
        "Keep refrigerator and freezer doors closed to maintain temperature"
      ],
      issuedAt: "2024-01-14T15:00:00Z",
      expiresAt: "2024-01-15T22:00:00Z",
      affectedAreas: ["North District", "Industrial Park", "Residential North", "Shopping Center"],
      emergencyContacts: [
        { name: "Power Company", number: "(555) 345-6789" },
        { name: "Emergency Services", number: "911" },
        { name: "Outage Information", number: "(555) OUTAGE1" }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    const fetchAlert = () => {
      setLoading(true);
      setTimeout(() => {
        const alertData = mockAlerts[alertId];
        setAlert(alertData);
        setLoading(false);
      }, 500);
    };

    fetchAlert();
  }, [alertId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-[#7371FC] rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Alert Not Found</h1>
        <p className="text-gray-600 mb-6">The alert you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center bg-[#7371FC] hover:bg-[#A594F9] text-white px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-[#7371FC] mb-4 hover:underline text-sm focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{alert.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <span>{alert.location}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Description */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alert Details</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">{alert.fullDescription}</p>
            </div>
          </div>

          {/* Safety Instructions */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Safety Instructions</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {alert.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>


        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">


          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/dashboard/reports/new"
                className="w-full inline-flex items-center justify-center bg-[#7371FC] hover:bg-[#A594F9] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Related Incident
              </Link>
              <Link
                to="/dashboard"
                className="w-full inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 