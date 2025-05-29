import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Users, Shield, Heart, Target, Eye, Zap } from "lucide-react"
import Navbar from "../components/Navbar"

const AboutPage = () => {
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
              About CDRP
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Building resilient communities through technology-driven disaster response and preparedness. 
              We connect people, organizations, and resources to save lives and reduce suffering.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            
            {/* Mission */}
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                To revolutionize disaster response by providing communities with the tools, connections, 
                and coordination capabilities needed to prepare for, respond to, and recover from emergencies 
                effectively and efficiently.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Reduce disaster response time by connecting all stakeholders</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Improve resource allocation through real-time data and analytics</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Empower communities to build lasting resilience and preparedness</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-green-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-6">
                A world where every community is prepared, connected, and empowered to respond to disasters 
                quickly and effectively, minimizing loss of life and accelerating recovery through the power 
                of coordinated action.
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-green-800 mb-3">By 2030, we envision:</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Communities responding to disasters 50% faster</li>
                  <li>• Zero communication blackouts during emergencies</li>
                  <li>• 100% volunteer-resource matching efficiency</li>
                  <li>• Global network of resilient, connected communities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              These principles guide everything we do and drive our commitment to serving communities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Reliability */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reliability</h3>
              <p className="text-gray-700">
                Lives depend on our platform working when it matters most. We maintain 99.9% uptime 
                and ensure our systems are always ready for critical moments.
              </p>
            </div>

            {/* Collaboration */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaboration</h3>
              <p className="text-gray-700">
                Disaster response requires teamwork. We break down silos and create seamless 
                connections between citizens, volunteers, and professional responders.
              </p>
            </div>

            {/* Compassion */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Compassion</h3>
              <p className="text-gray-700">
                Every feature we build is designed with empathy for those affected by disasters. 
                We prioritize human needs above all else.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-700">
                We continuously improve our technology to meet evolving challenges and create 
                new solutions for complex disaster response scenarios.
              </p>
            </div>

            {/* Transparency */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-red-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-700">
                Trust is essential in emergency situations. We maintain open communication and 
                provide clear, accurate information to all stakeholders.
              </p>
            </div>

            {/* Accessibility */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h3>
              <p className="text-gray-700">
                Emergency preparedness should be available to everyone. We design inclusive solutions 
                that work for all communities, regardless of technical expertise or resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-700">
                CDRP was born from the recognition that traditional disaster response often lacks coordination 
                and real-time information sharing.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                
                <div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">2020</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Founded</h3>
                  <p className="text-gray-700 text-sm">
                    Started as a response to coordination challenges observed during natural disasters
                  </p>
                </div>

                <div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">2021</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">First Deployment</h3>
                  <p className="text-gray-700 text-sm">
                    Successfully coordinated response to Hurricane Delta, serving 50,000 residents
                  </p>
                </div>

                <div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">2024</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Expansion</h3>
                  <p className="text-gray-700 text-sm">
                    Now serving 150+ communities worldwide with 500+ partner organizations
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 mb-6">
                What started as a small team's vision has grown into a global movement of communities 
                working together to build resilience and save lives. Every day, we're honored to play 
                a part in connecting people when they need it most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Links */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Learn More About CDRP</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dive deeper into how CDRP works, who uses it, and see real success stories from communities around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            <Link
              to="/about/how-it-works"
              className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-lg text-center transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">How CDRP Works</h3>
              <p className="text-gray-600 mb-4">
                Learn about our platform's process and technology
              </p>
              <div className="flex items-center justify-center text-blue-700 group-hover:translate-x-1 transition-transform">
                <span className="mr-1">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              to="/about/who-can-use"
              className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-lg text-center transition-colors group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Who Can Use CDRP</h3>
              <p className="text-gray-600 mb-4">
                Discover how different users benefit from our platform
              </p>
              <div className="flex items-center justify-center text-blue-700 group-hover:translate-x-1 transition-transform">
                <span className="mr-1">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              to="/about/in-action"
              className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-lg text-center transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">CDRP in Action</h3>
              <p className="text-gray-600 mb-4">
                Read real success stories and case studies
              </p>
              <div className="flex items-center justify-center text-blue-700 group-hover:translate-x-1 transition-transform">
                <span className="mr-1">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
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

export default AboutPage 