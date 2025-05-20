import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

import CharitySidebar from "../../components/charity/CharitySidebar";
import { Button } from "../../components/ui/Button";

const IncidentReject = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen bg-white">
      <CharitySidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
          <Link to="/charity/incidents" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
            <h1 className="text-xl font-semibold text-gray-800">Back to Incidents</h1>
          </Link>
        </header>
        <main className="flex items-center justify-center p-6">
          <div className="max-w-md rounded-lg border bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
              <X className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Incident Rejected</h2>
            <p className="mb-6 text-gray-600">
              You have rejected incident #{id}. This incident will be reassigned to another volunteer.
            </p>
            <Link to="/charity/incidents">
              <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                Return to Incidents
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IncidentReject; 