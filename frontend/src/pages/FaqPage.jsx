import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react"
import Navbar from "../components/Navbar"

const FaqPage = () => {
  const [openItems, setOpenItems] = useState(new Set([0])) // First item open by default
  const [searchTerm, setSearchTerm] = useState("")

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is CDRP and how does it work?",
          answer: "CDRP (Community Disaster Response Platform) is a comprehensive platform that connects communities, emergency services, volunteers, and organizations during disasters. It enables real-time reporting, resource coordination, and volunteer management to improve emergency response times and effectiveness."
        },
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking 'Sign Up' on our homepage. Choose between individual or organization account types, fill in your information, and verify your email address. Individual accounts are free, while organizations may have additional verification requirements."
        },
        {
          question: "Is CDRP free to use?",
          answer: "Yes, basic CDRP services are free for individual users and community organizations. Advanced features for large organizations and government agencies may have associated costs. Contact us for organizational pricing information."
        }
      ]
    },
    {
      category: "Reporting Incidents",
      questions: [
        {
          question: "How do I report an emergency or disaster?",
          answer: "Log into your CDRP account and click 'Report Incident' or use our mobile app. Provide details about the location, type of emergency, severity, and any immediate needs. Include photos if possible. For immediate life-threatening emergencies, always call 911 first."
        },
        {
          question: "What types of incidents can I report?",
          answer: "You can report natural disasters (hurricanes, earthquakes, floods, fires), infrastructure failures, medical emergencies, security incidents, and community needs. The platform covers both large-scale disasters and smaller community issues that require coordinated response."
        },
        {
          question: "How quickly are reports processed?",
          answer: "Reports are processed in real-time using AI validation. Critical reports are immediately flagged and sent to relevant emergency services within seconds. All reports are reviewed by human operators within 15 minutes during active emergencies."
        }
      ]
    },
    {
      category: "Volunteering",
      questions: [
        {
          question: "How can I volunteer to help during disasters?",
          answer: "Create a volunteer profile in your CDRP account, listing your skills, availability, and preferred types of assistance. When incidents occur in your area, you'll receive notifications about volunteer opportunities that match your profile."
        },
        {
          question: "What if I don't have specialized skills?",
          answer: "Everyone can help! We need volunteers for supply distribution, cleanup efforts, administrative tasks, transportation, and community support. Training is often provided for specific roles, and many tasks require only willingness to help."
        },
        {
          question: "How are volunteers vetted and coordinated?",
          answer: "Volunteers undergo basic background checks for safety. During incidents, volunteer coordinators match skills to needs and provide specific assignments through the platform. All volunteers work under the supervision of trained emergency personnel."
        }
      ]
    },
    {
      category: "Organizations & Partnerships",
      questions: [
        {
          question: "How can my organization join CDRP?",
          answer: "Contact us through our partnership form or email partnerships@cdrp.org. We work with government agencies, nonprofits, emergency services, and private organizations. Each partnership is customized based on your organization's role and capabilities."
        },
        {
          question: "What are the requirements for organizational accounts?",
          answer: "Organizations must provide official documentation, undergo verification, and designate authorized users. Government agencies and emergency services receive priority access and advanced features. Training is provided for all organizational users."
        },
        {
          question: "Can international organizations use CDRP?",
          answer: "Yes, CDRP supports international operations and multi-language capabilities. We work with organizations worldwide and can customize the platform for different regulatory environments and cultural contexts."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What devices and browsers does CDRP support?",
          answer: "CDRP works on all modern web browsers (Chrome, Firefox, Safari, Edge) and has mobile apps for iOS and Android. The platform is optimized for smartphones, tablets, and desktop computers with responsive design."
        },
        
        {
          question: "Is my data secure and private?",
          answer: "Yes, CDRP uses enterprise-grade security with encryption for all data transmission and storage. Personal information is protected according to privacy laws. Emergency responders only see information necessary for response coordination."
        }
      ]
    }
  ]

  // Filter FAQ items based on search term
  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

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
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Find answers to common questions about using CDRP. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            
            {searchTerm && (
              <div className="mb-8">
                <p className="text-gray-600">
                  {filteredFaq.reduce((total, category) => total + category.questions.length, 0)} result(s) found for "{searchTerm}"
                </p>
              </div>
            )}

            {filteredFaq.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-700 hover:text-blue-800"
                >
                  Clear search to see all questions
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFaq.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
                    <div className="space-y-4">
                      {category.questions.map((item, itemIndex) => {
                        const globalIndex = faqData
                          .slice(0, categoryIndex)
                          .reduce((acc, cat) => acc + cat.questions.length, 0) + itemIndex
                        
                        const isOpen = openItems.has(globalIndex)
                        
                        return (
                          <div key={itemIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <button
                              onClick={() => toggleItem(globalIndex)}
                              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                            >
                              <span className="text-lg font-medium text-gray-900 pr-4">
                                {item.question}
                              </span>
                              {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            
                            {isOpen && (
                              <div className="px-6 pb-4">
                                <div className="border-t border-gray-100 pt-4">
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.answer}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our support team is here to help. Get in touch with us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-md text-center transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@cdrp.org"
                className="bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 font-medium py-3 px-8 rounded-md text-center transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Helpful Resources</h2>
            <p className="text-blue-100">
              Explore these pages to learn more about CDRP and how to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              to="/about/how-it-works"
              className="bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-lg text-center transition-colors"
            >
              <div className="font-medium">How It Works</div>
            </Link>
            <Link
              to="/about/who-can-use"
              className="bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-lg text-center transition-colors"
            >
              <div className="font-medium">Who Can Use</div>
            </Link>
            <Link
              to="/volunteer/how-to-volunteer"
              className="bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-lg text-center transition-colors"
            >
              <div className="font-medium">How to Volunteer</div>
            </Link>
            <Link
              to="/reports/how-to-report"
              className="bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-lg text-center transition-colors"
            >
              <div className="font-medium">How to Report</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FaqPage;