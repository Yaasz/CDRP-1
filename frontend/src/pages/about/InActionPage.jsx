import { Link } from "react-router-dom"
import { ArrowLeft, MapPin, Clock, Users, CheckCircle } from "lucide-react"
import Navbar from "../../components/Navbar"

const InActionPage = () => {
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
              CDRP in Action
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              See how communities around the world are using CDRP to coordinate disaster response and build resilience.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">150+</div>
              <div className="text-gray-600">Communities Served</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">10,000+</div>
              <div className="text-gray-600">Volunteers Mobilized</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">500+</div>
              <div className="text-gray-600">Partner Organizations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">24/7</div>
              <div className="text-gray-600">Response Capability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real-World Success Stories
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              These case studies demonstrate how CDRP has made a difference in real disaster situations.
            </p>
          </div>

          <div className="space-y-12">
            
            {/* Case Study 1 - Hurricane Response */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-blue-600 p-8 text-white">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 mr-2" />
                    <span className="font-semibold">Gulf Coast, USA</span>
                  </div>
                  <div className="flex items-center mb-6">
                    <Clock className="w-6 h-6 mr-2" />
                    <span>September 2023</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Hurricane Marina Response</h3>
                  <p className="text-blue-100">
                    Category 3 hurricane affecting 200,000 residents across three coastal counties.
                  </p>
                </div>
                <div className="md:w-2/3 p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Challenge</h4>
                  <p className="text-gray-700 mb-6">
                    Hurricane Marina made landfall with minimal warning, causing widespread flooding and power outages. 
                    Traditional communication channels were disrupted, making coordination between agencies and volunteers extremely difficult.
                  </p>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">CDRP's Role</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Coordinated 50+ rescue teams</span>
                      </div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Deployed 2,000 volunteers</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Managed 15 shelter locations</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Processed 800+ incident reports</span>
                      </div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Distributed 10,000 supply packages</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Zero communication blackouts</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">Impact</h5>
                    <p className="text-green-700">
                      Response time reduced by 40% compared to previous hurricanes. 98% of affected residents 
                      received assistance within 48 hours, and no lives were lost due to the improved coordination.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Study 2 - Wildfire */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-red-600 p-8 text-white">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 mr-2" />
                    <span className="font-semibold">Northern California, USA</span>
                  </div>
                  <div className="flex items-center mb-6">
                    <Clock className="w-6 h-6 mr-2" />
                    <span>August 2023</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Valley Fire Crisis</h3>
                  <p className="text-red-100">
                    Fast-moving wildfire threatening 15,000 homes across rural communities.
                  </p>
                </div>
                <div className="md:w-2/3 p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Challenge</h4>
                  <p className="text-gray-700 mb-6">
                    A rapidly spreading wildfire required immediate evacuation of multiple rural communities. 
                    The challenge was coordinating evacuations, managing volunteer firefighters, and ensuring 
                    no one was left behind in remote areas.
                  </p>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">CDRP's Role</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Real-time evacuation tracking</span>
                      </div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Volunteer firefighter coordination</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Pet rescue coordination</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Dynamic evacuation routes</span>
                      </div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Resource allocation mapping</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Air support coordination</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">Impact</h5>
                    <p className="text-green-700">
                      100% successful evacuation rate with zero casualties. Fire containment achieved 30% faster 
                      through coordinated volunteer efforts and optimal resource deployment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Study 3 - Earthquake */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-purple-600 p-8 text-white">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 mr-2" />
                    <span className="font-semibold">Central Japan</span>
                  </div>
                  <div className="flex items-center mb-6">
                    <Clock className="w-6 h-6 mr-2" />
                    <span>March 2023</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Sendai Earthquake Response</h3>
                  <p className="text-purple-100">
                    Magnitude 7.2 earthquake affecting urban areas with high population density.
                  </p>
                </div>
                <div className="md:w-2/3 p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Challenge</h4>
                  <p className="text-gray-700 mb-6">
                    A major earthquake struck during peak commuting hours, causing building collapses, 
                    infrastructure damage, and stranding thousands of people. Immediate search and rescue 
                    operations were critical.
                  </p>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">CDRP's Role</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Rapid damage assessment</span>
                      </div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Search & rescue coordination</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Medical triage management</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Family reunification system</span>
                      </div>
                      <div className="flex items-start mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Emergency shelter setup</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">International aid coordination</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">Impact</h5>
                    <p className="text-green-700">
                      All missing persons located within 72 hours. International aid was optimally distributed 
                      with zero waste. Recovery timeline reduced by 25% through coordinated efforts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features in Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CDRP Makes the Difference</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              These key features enable the success stories you've just read about.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Coordination</h3>
              <p className="text-gray-700">
                Instant communication and updates ensure all responders are working with the latest information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Volunteer Management</h3>
              <p className="text-gray-700">
                Efficiently deploy volunteers where they're needed most, matching skills to requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Resource Allocation</h3>
              <p className="text-gray-700">
                Data-driven decisions ensure resources reach the areas and people that need them most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What People Are Saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4 italic">
                "CDRP transformed how we respond to emergencies. During Hurricane Marina, we coordinated 
                our entire response through the platform and achieved results we never thought possible."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-bold">M.J.</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Johnson</p>
                  <p className="text-sm text-gray-600">Emergency Management Director</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4 italic">
                "As a volunteer, CDRP helped me find exactly where I could help most during the Valley Fire. 
                No confusion, no wasted time - just coordinated action when it mattered most."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">D.C.</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">David Chen</p>
                  <p className="text-sm text-gray-600">Community Volunteer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Be Part of the Next Success Story
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of communities already using CDRP to build resilience and save lives. 
            Your community could be our next success story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-blue-700 font-medium py-3 px-8 rounded-md text-center transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              to="/contact"
              className="bg-transparent hover:bg-blue-800 text-white border border-white font-medium py-3 px-8 rounded-md text-center transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InActionPage 