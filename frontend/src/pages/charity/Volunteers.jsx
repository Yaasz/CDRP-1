import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/Avatar";

import { volunteerCategories } from "../../utils/mockData";

const Volunteers = () => {
  // Calculate total volunteers across all categories
  const totalVolunteers = Object.values(volunteerCategories).reduce(
    (acc, category) => acc + category.length,
    0
  );

  // Function to render a volunteer table for a category
  const renderVolunteerTable = (category, title) => (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <Link to="#" className="text-[#7371FC] text-sm font-medium hover:text-[#A594F9]">
          View All
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#E5D9F2] bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F5EFFF] text-left text-sm font-medium text-gray-500">
              <th className="px-4 py-3">Volunteer ID</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFFF]">
            {category.map((volunteer) => (
              <tr key={volunteer.id} className="text-sm hover:bg-[#F5EFFF]">
                <td className="px-4 py-3 font-medium text-gray-900">{volunteer.id}</td>
                <td className="px-4 py-3">
                  <div className="h-10 w-10 rounded-full bg-[#E5D9F2] flex items-center justify-center">
                    {volunteer.avatar ? (
                      <img src={volunteer.avatar} alt={volunteer.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="text-[#7371FC] font-medium">
                        {volunteer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{volunteer.name}</td>
                <td className="px-4 py-3 text-gray-600">{volunteer.email}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/charity/volunteers/${volunteer.id}`}>
                    <span className="text-[#7371FC] hover:text-[#A594F9] font-medium">
                      View Details
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg border border-[#E5D9F2] mb-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#CDC1FF] text-[#7371FC]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Volunteers</p>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      {renderVolunteerTable(volunteerCategories.expertise, "Expertise")}

      {/* Material Section */}
      {renderVolunteerTable(volunteerCategories.material, "Material")}

      {/* Labour Section */}
      {renderVolunteerTable(volunteerCategories.labour, "Labour")}
    </>
  );
};

export default Volunteers; 