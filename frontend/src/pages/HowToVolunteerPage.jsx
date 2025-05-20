import { Link } from "react-router-dom";
import volunteerHands from "../assets/volunteer-hands.png";

const HowToVolunteerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EFFF] to-[#E5D9F2] pt-24 pb-12 relative overflow-hidden">
      {/* Background Image Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `url(${volunteerHands})`,
          backgroundSize: '120% auto',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat',
          opacity: '0.15',
          filter: 'blur(1px)',
          transform: 'scale(1.1)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#7371FC] mb-4">How to Volunteer for Disaster Response</h1>
            <p className="text-xl text-[#A594F9]">Be part of the community that acts when it matters most</p>
          </div>
          
          {/* Steps Container */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#7371FC]">
              <h2 className="text-2xl font-semibold text-[#7371FC] mb-4">1. Sign Up or Log In</h2>
              <div className="space-y-3 text-gray-700">
                <p>Get started by creating your volunteer account:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create a new account or access your existing one</li>
                  <li>Provide necessary contact information</li>
                  <li>Your activities and contributions will be tracked securely</li>
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
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#A594F9]">
              <h2 className="text-2xl font-semibold text-[#7371FC] mb-4">2. View Disaster News and Alerts</h2>
              <div className="space-y-3 text-gray-700">
                <p>Stay informed about current situations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the News or Disaster Updates section</li>
                  <li>View verified incidents from government agencies</li>
                  <li>See updates from charity organizations</li>
                </ul>
                <div className="mt-4">
                  <Link 
                    to="/dashboard/news" 
                    className="inline-block bg-[#A594F9] text-white px-6 py-2 rounded-md hover:bg-[#7371FC] transition-colors"
                  >
                    View News & Alerts
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#CDC1FF]">
              <h2 className="text-2xl font-semibold text-[#7371FC] mb-4">3. Browse Available Opportunities</h2>
              <div className="space-y-3 text-gray-700">
                <p>Find where you can help:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View ongoing incidents and their details</li>
                  <li>See which charities are responding</li>
                  <li>Browse various volunteer roles needed:</li>
                  <ul className="list-circle pl-8 space-y-1">
                    <li>Food distribution</li>
                    <li>Rescue support</li>
                    <li>Medical assistance</li>
                    <li>Logistics coordination</li>
                  </ul>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#7371FC]">
              <h2 className="text-2xl font-semibold text-[#7371FC] mb-4">4. Apply to Volunteer</h2>
              <div className="space-y-3 text-gray-700">
                <p>Submit your application:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Select your preferred charity organization</li>
                  <li>Specify your availability and skills</li>
                  <li>Choose your preferred volunteer role</li>
                  <li>Submit required documentation</li>
                </ul>
              </div>
            </div>

            {/* Step 5 & 6 Combined */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#A594F9]">
              <h2 className="text-2xl font-semibold text-[#7371FC] mb-4">5. Get Started</h2>
              <div className="space-y-3 text-gray-700">
                <p>What happens next:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Receive application confirmation</li>
                  <li>Get notified of acceptance</li>
                  <li>Receive detailed task assignments including:</li>
                  <ul className="list-circle pl-8 space-y-1">
                    <li>Location and timing</li>
                    <li>Required resources</li>
                    <li>Contact information</li>
                    <li>Safety guidelines</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-[#7371FC] mb-4">Ready to Make a Difference?</h3>
            <p className="text-gray-700 mb-6">Join our community of volunteers and help those in need during critical times.</p>
            <Link 
              to="/dashboard/volunteer" 
              className="inline-block bg-[#7371FC] text-white px-8 py-3 rounded-md hover:bg-[#A594F9] transition-colors font-semibold"
            >
              Become a Volunteer Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToVolunteerPage;
