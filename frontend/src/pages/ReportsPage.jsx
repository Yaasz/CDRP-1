import { Link } from "react-router-dom"
import { ArrowLeft, AlertTriangle, Clock, Users, CheckCircle, ArrowRight, Eye, Phone } from "lucide-react"
import Navbar from "../components/Navbar"

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Disaster Reporting
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Your reports help save lives. Report incidents quickly and accurately to enable 
              coordinated emergency response in your community.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-8 bg-red-50 border-y border-red-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-red-800 mb-2">Life-Threatening Emergency?</h2>
                <p className="text-red-700 mb-4">
                  For immediate life-threatening emergencies, <strong>call 911 first</strong>. 
                  Use CDRP to report incidents for coordination and resource allocation after ensuring immediate safety.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:911"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md text-center transition-colors inline-flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 911
                  </a>
                  <Link
                    to="/reports/how-to-report"
                    className="bg-white hover:bg-gray-50 text-red-600 border border-red-300 font-medium py-2 px-6 rounded-md text-center transition-colors"
                  >
                    Learn When to Use CDRP
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Report */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Can Report
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              CDRP accepts reports for various types of incidents that require coordinated community response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Natural Disasters</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Hurricanes and severe storms</li>
                <li>• Earthquakes and aftershocks</li>
                <li>• Floods and flash floods</li>
                <li>• Wildfires and smoke</li>
                <li>• Tornadoes and high winds</li>
                <li>• Landslides and mudslides</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Infrastructure Issues</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Power outages</li>
                <li>• Water system failures</li>
                <li>• Bridge or road damage</li>
                <li>• Building collapses</li>
                <li>• Gas leaks (after calling 911)</li>
                <li>• Communication outages</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Needs</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Missing persons (non-critical)</li>
                <li>• Supply shortages</li>
                <li>• Shelter needs</li>
                <li>• Transportation issues</li>
                <li>• Medical supply needs</li>
                <li>• Community resource requests</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Recovery Updates</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Infrastructure restored</li>
                <li>• Areas cleared and safe</li>
                <li>• Resources distributed</li>
                <li>• Services resumed</li>
                <li>• Volunteer assistance completed</li>
                <li>• Community status updates</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Hazard Observations</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Environmental hazards</li>
                <li>• Unsafe conditions</li>
                <li>• Potential risks</li>
                <li>• Weather observations</li>
                <li>• Security concerns</li>
                <li>• Public health issues</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Response Coordination</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Volunteer deployment needs</li>
                <li>• Resource allocation requests</li>
                <li>• Inter-agency coordination</li>
                <li>• Supply chain updates</li>
                <li>• Operational status reports</li>
                <li>• Capacity and availability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Reporting Works</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our streamlined process ensures your reports reach the right people quickly and efficiently.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-blue-700 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Report</h3>
                <p className="text-gray-700">
                  Provide incident details, location, severity, and photos through our simple form or mobile app.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-green-700 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Validation</h3>
                <p className="text-gray-700">
                  AI-powered system validates and categorizes your report, flagging urgent items for immediate attention.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-purple-700 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Coordinated Response</h3>
                <p className="text-gray-700">
                  Report is routed to appropriate agencies and volunteers for immediate action and follow-up.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/reports/how-to-report"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-md text-center transition-colors inline-flex items-center"
              >
                Learn Detailed Reporting Process
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h2>
            <p className="text-lg text-gray-700">
              Ready to report an incident or learn more about the process?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Report an Incident</h3>
              <p className="text-gray-700 mb-6">
                Have an incident to report? Create an account and submit your report to help coordinate response efforts.
              </p>
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Create Account & Report
              </Link>
            </div>

            <div className="bg-green-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn More</h3>
              <p className="text-gray-700 mb-6">
                Want to understand the reporting process better? Check out our detailed guide and best practices.
              </p>
              <Link
                to="/reports/how-to-report"
                className="bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                View Reporting Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Community Impact</h2>
            <p className="text-xl text-blue-100">
              Your reports make a real difference in emergency response effectiveness.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">25,000+</div>
              <div className="text-blue-100">Reports Processed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">&lt; 2 min</div>
              <div className="text-blue-100">Average Response Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Report Accuracy</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-blue-100">Communities Served</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ReportsPage 