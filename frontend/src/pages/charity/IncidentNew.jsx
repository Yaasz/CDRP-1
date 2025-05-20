import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CharitySidebar from "../../components/charity/CharitySidebar";
import CharityHeader from "../../components/charity/CharityHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

const IncidentNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    impact: "Medium Impact",
    startDate: "",
    endDate: "",
    budget: "",
    coordinator: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, you would send this data to your API
    // For now, just navigate back to incidents
    navigate('/charity/incidents');
  };

  return (
    <div className="flex min-h-screen bg-purple-50/20">
      <CharitySidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <Link to="/charity/incidents" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Incidents</span>
            </Link>
            <h1 className="text-2xl font-semibold">Add New Incident</h1>
          </div>
        </header>
        <main className="p-6">
          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="bg-white pb-3">
              <CardTitle className="text-xl text-gray-800">Incident Information</CardTitle>
              <p className="text-sm text-gray-500">Fill out the form below to create a new incident</p>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">Incident Title</label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter incident title"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter incident location"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter incident description"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="impact" className="text-sm font-medium text-gray-700">Impact Level</label>
                    <select
                      id="impact"
                      name="impact"
                      value={formData.impact}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Low Impact">Low Impact</option>
                      <option value="Medium Impact">Medium Impact</option>
                      <option value="High Impact">High Impact</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="coordinator" className="text-sm font-medium text-gray-700">Coordinator</label>
                    <Input
                      id="coordinator"
                      name="coordinator"
                      value={formData.coordinator}
                      onChange={handleChange}
                      placeholder="Enter coordinator name"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget</label>
                    <Input
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g. $50,000"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link to="/charity/incidents">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Create Incident
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default IncidentNew; 