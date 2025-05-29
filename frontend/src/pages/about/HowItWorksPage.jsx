import { Link } from "react-router-dom"
import { ArrowLeft, Users, AlertTriangle, Settings, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from "../../components/Navbar"

const HowItWorksPage = () => {
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
              How CDRP Works
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Learn how our Community Disaster Response Platform connects communities, coordinates resources, 
              and saves lives through technology-driven disaster response.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Process, Powerful Results
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              CDRP streamlines disaster response through three core functions: reporting, coordinating, and responding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-blue-700" />
              </div>
              <div className="bg-blue-100 text-blue-800 font-semibold text-sm px-3 py-1 rounded-full inline-block mb-4">
                Step 1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Report & Detect</h3>
              <p className="text-gray-700">
                Citizens, organizations, and sensors report incidents in real-time. Our AI-powered system 
                validates and prioritizes reports automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-green-700" />
              </div>
              <div className="bg-green-100 text-green-800 font-semibold text-sm px-3 py-1 rounded-full inline-block mb-4">
                Step 2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Coordinate & Plan</h3>
              <p className="text-gray-700">
                Emergency managers coordinate response efforts, allocate resources, and deploy teams 
                using our centralized command dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-700" />
              </div>
              <div className="bg-purple-100 text-purple-800 font-semibold text-sm px-3 py-1 rounded-full inline-block mb-4">
                Step 3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Respond & Support</h3>
              <p className="text-gray-700">
                Volunteers, emergency services, and organizations work together to provide immediate 
                assistance and long-term recovery support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Workflow */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Platform Workflow</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Here's how different users interact with CDRP throughout the disaster response lifecycle.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Phase 1: Detection & Reporting */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-700 font-bold text-lg">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Detection & Reporting</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Citizens Can:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Report incidents via mobile app or web portal
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Upload photos and location data
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Receive emergency alerts and updates
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">System Automatically:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Validates report authenticity using AI
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Categorizes incidents by type and severity
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Notifies relevant emergency services
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2: Assessment & Coordination */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-yellow-700 font-bold text-lg">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Assessment & Coordination</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Emergency Managers:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Review and validate incident reports
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Assess resource needs and availability
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Create response plans and assignments
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Platform Features:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Real-time resource tracking dashboard
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Inter-agency communication tools
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Predictive analytics for resource allocation
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3: Response & Recovery */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold text-lg">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Response & Recovery</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Field Teams:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Receive assignments via mobile app
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Update status and progress in real-time
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Coordinate with other response teams
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Support Organizations:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Manage volunteer deployment
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Track supply distribution
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Coordinate long-term recovery efforts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced Technology</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              CDRP leverages cutting-edge technology to provide reliable, scalable disaster response capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">AI-Powered Validation</h3>
              <p className="text-gray-700">
                Machine learning algorithms automatically verify incident reports, reducing false alarms 
                and ensuring responders focus on real emergencies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Real-Time Collaboration</h3>
              <p className="text-gray-700">
                Secure, instant communication channels enable seamless coordination between agencies, 
                volunteers, and community members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Predictive Analytics</h3>
              <p className="text-gray-700">
                Data-driven insights help predict resource needs, optimize response routes, 
                and improve future preparedness efforts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-red-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Mobile-First Design</h3>
              <p className="text-gray-700">
                Responsive design ensures the platform works perfectly on any device, 
                from smartphones to command center displays.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-yellow-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Scalable Infrastructure</h3>
              <p className="text-gray-700">
                Cloud-based architecture automatically scales to handle increased load during 
                major disasters when communication is most critical.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Offline Capability</h3>
              <p className="text-gray-700">
                Critical functions work even without internet connectivity, ensuring 
                response capabilities remain operational in challenging conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience CDRP?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            See how CDRP can transform disaster response in your community. Join thousands of users 
            who are already making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-blue-700 font-medium py-3 px-8 rounded-md text-center transition-colors inline-flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/in-action"
              className="bg-transparent hover:bg-blue-800 text-white border border-white font-medium py-3 px-8 rounded-md text-center transition-colors"
            >
              See CDRP in Action
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksPage 