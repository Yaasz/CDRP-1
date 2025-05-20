import { Link } from "react-router-dom"
import { ArrowLeft } from 'lucide-react'
import Navbar from "../components/Navbar"

export default function AboutHowItWorksPage() {
  return (
    <div>
      <Navbar />
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mt-8">How It Works</h1>
          <p className="text-gray-600 mt-4">
            Learn about our simple process to get you started.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Sign Up</h2>
              <p className="text-gray-500">
                Create an account to start using our services. It's quick and easy!
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Connect Your Accounts</h2>
              <p className="text-gray-500">
                Securely connect your bank and brokerage accounts to get a complete financial overview.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Analyze and Optimize</h2>
              <p className="text-gray-500">
                Use our powerful tools to analyze your investments and optimize your financial strategy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
