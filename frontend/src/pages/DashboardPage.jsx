import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Eye, MapPin } from "lucide-react";

export default function DashboardPage() {
  // Mock data for alerts and warnings
  const [alerts] = useState([
    {
      id: 1,
      title: "Severe Weather Warning",
      description: "Heavy rainfall and strong winds expected in the metropolitan area. Potential for flooding in low-lying areas.",
      location: "Metro Area"
    },
    {
      id: 2,
      title: "Heat Wave Advisory",
      description: "Extreme temperatures reaching 40°C expected for the next 3 days. Stay hydrated and avoid outdoor activities during peak hours.",
      location: "City Center"
    },
    {
      id: 3,
      title: "Power Outage Alert",
      description: "Scheduled maintenance will cause power interruptions in several neighborhoods. Backup generators recommended.",
      location: "North District"
    }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-6 w-6 text-[#7371FC] mr-2" />
              Alerts & Warnings
            </h1>
            <p className="text-gray-600 mt-1">
              Stay informed about current emergencies and safety advisories in your area
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">Just now</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Content */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {alert.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {alert.location}
                      </div>
                    </div>
                  </div>
        </div>

                {/* View Detail Button */}
                <div className="flex-shrink-0 ml-4">
                  <Link
                    to={`/dashboard/alerts/${alert.id}`}
                    className="inline-flex items-center bg-[#7371FC] hover:bg-[#A594F9] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </div>
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
      <div>
            <h3 className="text-sm font-medium text-gray-900">Need to report an emergency?</h3>
            <p className="text-sm text-gray-600">Help us keep the community safe by reporting incidents</p>
              </div>
            <Link
            to="/dashboard/reports/new"
            className="inline-flex items-center bg-[#7371FC] hover:bg-[#A594F9] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Emergency
            </Link>
        </div>
      </div>
    </div>
  );
}
