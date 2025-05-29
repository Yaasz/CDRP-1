import { Link } from "react-router-dom"
import { ArrowLeft, Users, Heart, Clock, MapPin, CheckCircle, ArrowRight, Star, Award } from "lucide-react"
import Navbar from "../components/Navbar"

const VolunteerPage = () => {
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
              Volunteer with CDRP
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Join thousands of volunteers making a difference in disaster response and community resilience. 
              Every skill matters, every hour counts, every volunteer saves lives.
            </p>
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Volunteer with CDRP?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Your time and skills can make a real difference when communities need help most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-red-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Save Lives</h3>
              <p className="text-gray-700">
                Your volunteer efforts directly contribute to saving lives and reducing suffering 
                during disasters and emergencies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Build Community</h3>
              <p className="text-gray-700">
                Connect with like-minded people who care about community resilience and 
                disaster preparedness in your area.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Develop Skills</h3>
              <p className="text-gray-700">
                Gain valuable experience in emergency response, leadership, and crisis management 
                while serving your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              No matter your background or schedule, there's a way for you to help during disasters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Emergency Response</h3>
              <ul className="text-gray-700 space-y-2 text-sm mb-4">
                <li>• Search and rescue support</li>
                <li>• Emergency shelter assistance</li>
                <li>• First aid and medical support</li>
                <li>• Evacuation assistance</li>
                <li>• Crisis communication</li>
              </ul>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>When disasters occur</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Support</h3>
              <ul className="text-gray-700 space-y-2 text-sm mb-4">
                <li>• Supply distribution</li>
                <li>• Cleanup and debris removal</li>
                <li>• Meal preparation and delivery</li>
                <li>• Transportation assistance</li>
                <li>• Emotional support</li>
              </ul>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Flexible scheduling</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Skills-Based Volunteering</h3>
              <ul className="text-gray-700 space-y-2 text-sm mb-4">
                <li>• Technology and communications</li>
                <li>• Language translation</li>
                <li>• Professional expertise</li>
                <li>• Training and education</li>
                <li>• Resource coordination</li>
              </ul>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Use your expertise</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Preparedness Activities</h3>
              <ul className="text-gray-700 space-y-2 text-sm mb-4">
                <li>• Community preparedness training</li>
                <li>• Disaster education programs</li>
                <li>• Emergency drill coordination</li>
                <li>• Vulnerability assessments</li>
                <li>• Public awareness campaigns</li>
              </ul>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Ongoing programs</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-yellow-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Remote Opportunities</h3>
              <ul className="text-gray-700 space-y-2 text-sm mb-4">
                <li>• Virtual coordination support</li>
                <li>• Data entry and analysis</li>
                <li>• Social media management</li>
                <li>• Online training delivery</li>
                <li>• Resource research</li>
              </ul>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Work from anywhere</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Leadership Roles</h3>
              <ul className="text-gray-700 space-y-2 text-sm mb-4">
                <li>• Team coordination</li>
                <li>• Volunteer training</li>
                <li>• Program development</li>
                <li>• Community outreach</li>
                <li>• Strategic planning</li>
              </ul>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Leadership experience required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Volunteering Works</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Getting started as a volunteer is easy. We'll match you with opportunities that fit your skills and schedule.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-blue-700 font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Sign Up</h3>
                <p className="text-gray-700 text-sm">
                  Create your volunteer profile with your skills, availability, and preferences.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-green-700 font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Get Training</h3>
                <p className="text-gray-700 text-sm">
                  Complete relevant training modules for your chosen volunteer roles.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-purple-700 font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Get Matched</h3>
                <p className="text-gray-700 text-sm">
                  Receive notifications about opportunities that match your skills and location.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-red-700 font-bold text-xl">4</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Make Impact</h3>
                <p className="text-gray-700 text-sm">
                  Serve your community and help save lives during disasters and emergencies.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/volunteer/how-to-volunteer"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-md text-center transition-colors inline-flex items-center"
              >
                Learn More About Volunteering
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Volunteer Stories</h2>
            <p className="text-lg text-gray-700">
              Hear from volunteers who are making a difference in their communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4 italic">
                "Volunteering with CDRP during Hurricane Marina was the most meaningful work I've ever done. 
                Knowing that my efforts helped families reunite and communities recover faster gave me such purpose."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-bold">S.L.</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Lopez</p>
                  <p className="text-sm text-gray-600">Emergency Response Volunteer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4 italic">
                "As a nurse, I was able to use my medical skills to help at evacuation centers. 
                CDRP made it easy to find where I was needed most and connect with other medical volunteers."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">M.R.</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Michael Rodriguez</p>
                  <p className="text-sm text-gray-600">Medical Support Volunteer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4 italic">
                "I started volunteering remotely, helping with data coordination. It's amazing how much 
                impact you can have from home, and the training prepared me for field work when I was ready."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-700 font-bold">A.K.</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Angela Kim</p>
                  <p className="text-sm text-gray-600">Remote Coordination Volunteer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4 italic">
                "Teaching community preparedness workshops has been incredibly rewarding. 
                Seeing families become more prepared and confident about handling emergencies is priceless."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-yellow-700 font-bold">J.T.</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">James Thompson</p>
                  <p className="text-sm text-gray-600">Preparedness Education Volunteer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-700">
              Join our community of volunteers and start making a difference today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Volunteering</h3>
              <p className="text-gray-700 mb-6">
                Create your volunteer profile and get matched with opportunities in your area. 
                Complete training and start helping your community.
              </p>
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Sign Up to Volunteer
              </Link>
            </div>

            <div className="bg-green-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn More</h3>
              <p className="text-gray-700 mb-6">
                Want to understand more about volunteer opportunities, training, and requirements? 
                Check out our comprehensive volunteer guide.
              </p>
              <Link
                to="/volunteer/how-to-volunteer"
                className="bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Volunteer Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Volunteer Impact</h2>
            <p className="text-xl text-blue-100">
              Together, our volunteers have made an incredible difference in disaster response.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-100">Active Volunteers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Volunteer Hours</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Volunteer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Response Readiness</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VolunteerPage 