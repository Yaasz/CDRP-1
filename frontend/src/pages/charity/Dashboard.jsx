import React from "react";
import { Link } from "react-router-dom";
import { Search, Users, AlertTriangle } from "lucide-react";

import CharitySidebar from "../../components/charity/CharitySidebar";
import GoogleTranslateButton from "../../components/GoogleTranslateButton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";

import { volunteers, incidents, applications } from "../../utils/mockData";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CharitySidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <GoogleTranslateButton />
            <div className="relative">
              <span className="absolute right-3 top-1/2 flex h-2 w-2 -translate-y-1/2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7371FC] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7371FC]"></span>
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Incidents Card */}
            <div className="rounded-lg bg-[#7371FC]/10 p-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-500">Active Incidents</h2>
                <div className="h-2 w-2 rounded-full bg-[#7371FC]"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900">3</div>
              <div className="mt-1 text-xs text-gray-500">+2 from last month</div>
            </div>

            {/* Total Volunteers Card */}
            <div className="rounded-lg bg-[#7371FC]/10 p-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-500">Total Volunteers</h2>
                <Users className="h-4 w-4 text-[#7371FC]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">4</div>
              <div className="mt-1 text-xs text-gray-500">+5 from last month</div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="rounded-lg border bg-white p-6 lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Volunteer Directory</h2>
                <div className="relative max-w-xs">
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[#7371FC] focus:outline-none focus:ring-1 focus:ring-[#7371FC]"
                  />
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="mb-4 flex space-x-2">
                <button className="rounded-md bg-[#7371FC] px-3 py-1 text-sm font-medium text-white">
                  Experience
                </button>
                <button className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Availability
                </button>
                <button className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Skills
                </button>
              </div>

              <div className="space-y-4">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200">
                        <img
                          src={volunteer.avatar}
                          alt={volunteer.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{volunteer.name}</div>
                        <div className="text-sm text-gray-500">{volunteer.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">{volunteer.experience}</div>
                      <Badge
                        className={`${
                          volunteer.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {volunteer.status}
                      </Badge>
                      <Link to={`/charity/volunteers/${volunteer.id}`} className="text-sm font-medium text-[#7371FC]">
                        <span className="flex items-center gap-1">
                          Contact
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-lg border bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Active Incidents</h2>
                  <AlertTriangle className="h-5 w-5 text-[#7371FC]" />
                </div>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">{incident.title}</div>
                        <Badge
                          className={`${
                            incident.status === "In Progress"
                              ? "bg-[#7371FC] text-white"
                              : incident.status === "Required"
                              ? "bg-yellow-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {incident.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">Assigned by: {incident.assignedBy}</div>
                      <div className="mt-3">
                        <Link to={`/charity/incidents/${incident.id}`}>
                          <Button variant="outline" size="sm" className="w-full justify-center">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Volunteer Applications</h2>
                </div>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gray-200">
                          <img
                            src={application.avatar}
                            alt={application.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-sm text-gray-500">{application.role}</div>
                        </div>
                      </div>
                      <Link
                        to={`/charity/applications/${application.id}`}
                        className="rounded-md bg-[#7371FC] px-3 py-1 text-sm font-medium text-white hover:bg-[#7371FC]/90"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 