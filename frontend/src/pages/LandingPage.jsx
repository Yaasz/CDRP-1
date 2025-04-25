import { Link } from "react-router-dom";
import { ArrowRight, Users, Building2, Landmark, AlertTriangle, Clock, Map } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Consider making CDRP logo a reusable component later */}
            <div className="text-blue-600 font-bold text-2xl mr-2">
              <span className="bg-blue-600 text-white p-1 rounded">CDRP</span>
            </div>
            <span className="hidden md:inline text-gray-700 font-medium">Crowdsourced Disaster Response Platform</span>
          </div>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Login / Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-6 md:px-12">
        {/* SVG background pattern - kept as inline style */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '24px 24px'
        }}></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Community-Powered Disaster Response</h1>
              <p className="text-lg mb-8">
                Connecting communities, charities, and government agencies to coordinate effective disaster response in
                real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium flex items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Get Started <ArrowRight size={18} className="ml-2" />
                </Link>
                <button className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-full h-72 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">Disaster response coordination [Image Placeholder]</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        ></div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How CDRP Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform connects those affected by disasters with those who can help, creating a coordinated response
              system.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Report Incidents</h3>
              <p className="text-gray-600">
                Users can quickly report disasters with text, images, and videos, providing real-time information from
                the ground.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Updates</h3>
              <p className="text-gray-600">
                Get immediate updates on disaster situations, response efforts, and resource availability in affected
                areas.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Coordinate Response</h3>
              <p className="text-gray-600">
                Efficiently coordinate resources and volunteers between community members, charities, and government
                agencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Who Can Use CDRP?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform brings together all stakeholders involved in disaster response.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4"><Users size={40} /></div>
              <h3 className="text-xl font-bold mb-3">Community Members</h3>
              <p className="text-gray-600 mb-4">Report incidents, offer assistance, volunteer skills, and stay informed about local disaster situations.</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Report disasters in real-time</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Offer skills and resources</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Receive emergency alerts</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4"><Building2 size={40} /></div>
              <h3 className="text-xl font-bold mb-3">Charity Organizations</h3>
              <p className="text-gray-600 mb-4">Register your organization, indicate involvement areas, and coordinate aid distribution efficiently.</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Register aid categories</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Coordinate with other organizations</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Access real-time needs assessment</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4"><Landmark size={40} /></div>
              <h3 className="text-xl font-bold mb-3">Government Agencies</h3>
              <p className="text-gray-600 mb-4">Oversee response activities, access real-time data, and coordinate resources across multiple organizations.</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Monitor incident reports</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Plan response strategies</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Allocate resources effectively</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Images Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">CDRP in Action</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how our platform helps communities respond to disasters more effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Disaster reporting interface [Image Placeholder]</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Real-time Reporting</h3>
                <p className="text-gray-600">Users can quickly report incidents with location and severity details.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Resource coordination [Image Placeholder]</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Resource Coordination</h3>
                <p className="text-gray-600">Charities and government agencies can coordinate response efforts.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Volunteer management [Image Placeholder]</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">Volunteer Management</h3>
                <p className="text-gray-600">Community members can offer skills and resources where needed most.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the CDRP Community Today</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Be part of a network that's transforming how communities respond to disasters. Together, we can save lives
            and rebuild faster.
          </p>
          <Link
            to="/dashboard"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium text-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">CDRP</div>
              <p className="text-gray-400">
                Crowdsourced Disaster Response Platform - Connecting communities for faster, more effective disaster
                response.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Emergency Contacts</a></li>
                <li><a href="#" className="hover:text-white">Disaster Preparedness</a></li>
                <li><a href="#" className="hover:text-white">Training Materials</a></li>
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Crowdsourced Disaster Response Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
