"use client"

import { useState, useRef } from "react"
import { User, Mail, Calendar } from "lucide-react"

export default function VolunteerRegistrationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    sex: "",
    age: "",
    availableDate: "",
    contributionType: "",
  })

  const modalRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Volunteer graphic */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-8">VOLUNTEER</h1>
              <div className="flex justify-center">
                {/* Stylized hands illustration */}
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-32 rounded-t-full ${i % 2 === 0 ? "bg-blue-400" : "bg-yellow-500"} relative`}
                      style={{
                        transform: `rotate(${-10 + i * 5}deg)`,
                      }}
                    >
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-inherit rounded-t-full"></div>
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          className="absolute top-0 w-2 h-10 bg-inherit rounded-t-full"
                          style={{
                            left: `${j * 3 + 2}px`,
                            transform: `rotate(${-5 + j * 3}deg)`,
                            transformOrigin: "bottom",
                          }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 bg-gray-100 p-6">
            <div className="bg-blue-600 text-white text-center py-3 rounded-md mb-6">
              <h2 className="text-lg font-semibold">Volunteer Registration</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative flex">
                  <div className="w-16">
                    <select className="block w-full h-full py-2 pl-3 pr-0 border border-gray-300 rounded-l-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>+1</option>
                      <option>+44</option>
                      <option>+91</option>
                      <option>+251</option>
                    </select>
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="block w-full py-2 pl-3 pr-3 border border-gray-300 border-l-0 rounded-r-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Male"
                      checked={formData.sex === "Male"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Female"
                      checked={formData.sex === "Female"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Other"
                      checked={formData.sex === "Other"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Other</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="16"
                    max="100"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="availableDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="availableDate"
                    name="availableDate"
                    type="date"
                    required
                    value={formData.availableDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Type</label>
                <div className="space-y-2">
                  <label className="inline-flex items-center block">
                    <input
                      type="radio"
                      name="contributionType"
                      value="Expertise"
                      checked={formData.contributionType === "Expertise"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Expertise</span>
                  </label>
                  <label className="inline-flex items-center block">
                    <input
                      type="radio"
                      name="contributionType"
                      value="Material"
                      checked={formData.contributionType === "Material"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Material</span>
                  </label>
                  <label className="inline-flex items-center block">
                    <input
                      type="radio"
                      name="contributionType"
                      value="Labor"
                      checked={formData.contributionType === "Labor"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Labor</span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
