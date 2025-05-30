import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "../../components/ui/Button";

const IncidentAccept = () => {
  const { id } = useParams();

  return (
    <>
      {/* Back button */}
      <Link to="/charity/incidents" className="flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4 text-gray-500" />
        <span className="text-xl font-semibold text-gray-800">Back to Incidents</span>
      </Link>
      
      <div className="flex items-center justify-center">
        <div className="max-w-md rounded-lg border bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
            <Check className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Incident Accepted</h2>
          <p className="mb-6 text-gray-600">
            You have successfully accepted incident #{id}. You will receive further instructions shortly.
          </p>
          <Link to="/charity/incidents">
            <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
              Return to Incidents
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default IncidentAccept; 