import { Link } from "react-router-dom"
import { ArrowLeft, Users, Building2, Shield, Heart } from "lucide-react"
import Navbar from "../../components/Navbar"

const WhoCanUsePage = () => {
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
              Who Can Use CDRP
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              CDRP serves a diverse community of users, all working together to build more resilient communities.
            </p>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Community Members
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              CDRP brings together various stakeholders to create a comprehensive disaster response network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            
            {/* Individual Citizens */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Individual Citizens</h3>
              <p className="text-gray-700 mb-6">
                Community members who want to stay informed, report incidents, or volunteer during emergencies.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What you can do:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Report disasters and emergencies in your area
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Receive real-time alerts and updates
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Volunteer for disaster response activities
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Access emergency resources and information
                  </li>
                </ul>
              </div>
            </div>

            {/* Government Agencies */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Government Agencies</h3>
              <p className="text-gray-700 mb-6">
                Local, state, and federal emergency management agencies coordinating disaster response efforts.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What you can do:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Coordinate emergency response operations
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Manage and allocate emergency resources
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Issue public alerts and communications
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Monitor disaster situations in real-time
                  </li>
                </ul>
              </div>
            </div>

            {/* Charitable Organizations */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Charitable Organizations</h3>
              <p className="text-gray-700 mb-6">
                Non-profit organizations, NGOs, and humanitarian groups providing disaster relief and support.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What you can do:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Coordinate volunteer deployment
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Manage relief supply distribution
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Connect with affected communities
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Collaborate with other response organizations
                  </li>
                </ul>
              </div>
            </div>

            {/* Emergency Services */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-red-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Emergency Services</h3>
              <p className="text-gray-700 mb-6">
                Fire departments, police, EMS, and other first responder organizations.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What you can do:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Receive immediate incident notifications
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Coordinate multi-agency responses
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Access volunteer resources when needed
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Share critical information with the public
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ready to join the CDRP community? Here's how to get started based on your role.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Individual Users */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Individual Users</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">1</span>
                    <span><Link to="/login" className="text-blue-700 hover:text-blue-800">Sign up</Link> for a free account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">2</span>
                    <span>Complete your profile and location information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">3</span>
                    <span>Set up alert preferences for your area</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">4</span>
                    <span>Start reporting incidents and volunteering</span>
                  </li>
                </ol>
              </div>

              {/* Organizations */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Organizations</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">1</span>
                    <span><Link to="/contact" className="text-blue-700 hover:text-blue-800">Contact us</Link> to discuss partnership opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">2</span>
                    <span>Complete organizational verification process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">3</span>
                    <span>Set up organizational dashboard and permissions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 font-semibold text-sm px-2 py-1 rounded mr-3 mt-0.5">4</span>
                    <span>Begin coordinating disaster response activities</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Whether you're an individual looking to help or an organization coordinating response efforts, 
            CDRP provides the tools you need to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-blue-700 font-medium py-3 px-8 rounded-md text-center transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="bg-transparent hover:bg-blue-800 text-white border border-white font-medium py-3 px-8 rounded-md text-center transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WhoCanUsePage 