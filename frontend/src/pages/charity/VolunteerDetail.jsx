import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

import { volunteerDetails } from "../../utils/mockData";

const VolunteerDetail = () => {
  const { id } = useParams();
  
  // Get volunteer details from mock data - in real app, fetch from API
  // Fallback to the first volunteer if ID not found
  const volunteer = volunteerDetails[id] || volunteerDetails["1"];

  return (
    <>
      {/* Back button */}
      <Link to="/charity/volunteers" className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Volunteers</span>
      </Link>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="p-0">
            <div className="h-3 w-full bg-purple-600"></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-purple-200">
                <AvatarImage src={volunteer.avatar || "/images/volunteers/volunteer1.jpg"} alt={volunteer.name} />
                <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{volunteer.name}</h2>
              <p className="text-gray-500">{volunteer.role}</p>
              <Badge
                className={`mt-2 ${
                  volunteer.status === "Available"
                    ? "bg-purple-600 text-white"
                    : "border-purple-300 text-purple-700"
                }`}
              >
                {volunteer.status}
              </Badge>
              <div className="mt-6 w-full space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">{volunteer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">{volunteer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">{volunteer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">{volunteer.availability}</span>
                </div>
              </div>
              <div className="mt-6 w-full">
                <h3 className="mb-2 text-sm font-medium">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {volunteer.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-purple-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{volunteer.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {volunteer.pastProjects.map((project, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <span className="text-xs text-gray-500">{project.date}</span>
                    </div>
                    <p className="mt-2 text-sm">{project.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default VolunteerDetail; 