import { Link } from "react-router-dom";

const HowToReportPage = () => {
  return (
    <div className="min-h-screen bg-[#F5EFFF] pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#7371FC] mb-8">How to Report a Disaster or Incident</h1>
          
          {/* Steps Container */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-[#A594F9] mb-4">1. Create an Account / Log In</h2>
              <div className="space-y-3 text-gray-700">
                <p>Before submitting a report, you'll need to authenticate:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sign up using your email or mobile number</li>
                  <li>Verify your account for quick access</li>
                  <li>Maintain a secure password</li>
                </ul>
                <div className="mt-4">
                  <Link 
                    to="/login" 
                    className="inline-block bg-[#A594F9] text-white px-6 py-2 rounded-md hover:bg-[#7371FC] transition-colors"
                  >
                    Signup/Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-[#A594F9] mb-4">2. Submit a Report</h2>
              <div className="space-y-3 text-gray-700">
                <p>Once logged in, you can submit your report with these details:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Select the type of disaster (Flood, Earthquake, Fire, etc.)</li>
                  <li>Provide the exact location (map pin or manual entry)</li>
                  <li>Write a clear description of the event</li>
                  <li>Upload relevant images or videos (optional)</li>
                  <li>Specify the time of occurrence</li>
                </ul>
                <div className="mt-4">
                  <Link 
                    to="/reports/new" 
                    className="inline-block bg-[#A594F9] text-white px-6 py-2 rounded-md hover:bg-[#7371FC] transition-colors"
                  >
                    Report Disaster
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-[#A594F9] mb-4">3. Verification Process</h2>
              <div className="space-y-3 text-gray-700">
                <p>After submission, your report goes through verification:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Moderators review the report details</li>
                  <li>Cross-referencing with other reports and sources</li>
                  <li>Possible contact for additional information</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-[#A594F9] mb-4">4. Track Your Report</h2>
              <div className="space-y-3 text-gray-700">
                <p>Stay updated on your report status:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View report status (Pending, Verified, Responded, Resolved)</li>
                  <li>Receive notifications on status changes</li>
                  <li>Add additional information if requested</li>
                </ul>
                <div className="mt-4">
                  <Link 
                    to="/reports" 
                    className="inline-block bg-[#A594F9] text-white px-6 py-2 rounded-md hover:bg-[#7371FC] transition-colors"
                  >
                    View Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">Ready to submit a report?</p>
            <Link 
              to="/reports/new" 
              className="inline-block bg-[#7371FC] text-white px-8 py-3 rounded-md hover:bg-[#A594F9] transition-colors font-semibold"
            >
              Report a Disaster Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToReportPage;
