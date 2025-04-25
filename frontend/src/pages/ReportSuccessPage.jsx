import { Link } from 'react-router-dom';
import { CheckCircle, Home, Mail, Clock, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReportSuccessPage() {
  const [referenceId, setReferenceId] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  // Generate mock details only once on component mount
  useEffect(() => {
    setReferenceId(`#REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    setSubmissionDate(new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }));
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-200">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h1>
        <p className="text-gray-600">Your report has been received and is being processed.</p>
      </div>

      {/* Report Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Report Summary</h2>
        </div>
        <div className="p-6">
          <dl className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-600">Reference ID</dt>
              <dd className="text-sm font-medium text-gray-800">{referenceId}</dd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-600">Submitted On</dt>
              <dd className="text-sm font-medium text-gray-800">{submissionDate}</dd>
            </div>
            <div className="flex justify-between items-center py-2">
              <dt className="text-sm text-gray-600">Next Step</dt>
              <dd className="text-sm font-medium text-yellow-800">Processing</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* What's Next Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
         <div className="p-6 bg-gray-50 border-b border-gray-200">
             <h2 className="text-lg font-semibold text-gray-800">What Happens Next?</h2>
         </div>
        <div className="p-6">
          <ul className="space-y-5">
            <li className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Confirmation Email</h3>
                <p className="text-xs text-gray-600 mt-0.5">A confirmation email with your report details has been sent (mock).</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Review & Assignment</h3>
                <p className="text-xs text-gray-600 mt-0.5">Our team will review your report and assign it to the relevant agency.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <ChevronRight className="h-3.5 w-3.5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Track Progress</h3>
                 <p className="text-xs text-gray-600 mt-0.5">You can monitor the status of your report in the <Link to="/dashboard/reports" className="text-blue-600 hover:underline">My Reports</Link> section.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Actions & Support */}
      <div className="text-center space-y-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="text-xs text-gray-500">
          Need further assistance? <a href="mailto:support@example.com" className="text-blue-600 hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
