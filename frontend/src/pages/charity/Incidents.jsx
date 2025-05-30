import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

import { assignedIncidents } from "../../utils/mockData";

const Incidents = () => {
    return (
        <>
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex w-full items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input type="search" placeholder="Search incidents..." className="pl-10 border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]" />
                    </div>
                    <Link to="/charity/incidents/new">
                        <Button className="bg-[#7371FC] text-white hover:bg-[#6260e0]">Add New Incident</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {assignedIncidents.map((incident) => (
                    <div key={incident.id} className="overflow-hidden rounded-lg border border-[#E5D9F2] bg-white shadow-sm">
                        <div className="relative h-48 w-full bg-[#F5EFFF]">
                            <img 
                                src={incident.imageUrl} 
                                alt={incident.title}
                                className="h-full w-full object-cover"
                            />
                            <div
                                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white ${incident.impactColor}`}
                            >
                                {incident.impact}
                            </div>
                            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700">
                                {incident.timeAgo}
                            </div>
                        </div>
                        <div className="p-4">
                            <Link to={`/charity/incidents/${incident.id}`}>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800">{incident.title}</h3>
                            </Link>
                            <p className="mb-4 text-sm text-gray-500">{incident.location}</p>
                            <div className="flex gap-2 mt-3">
                                <Link to={`/charity/incidents/${incident.id}/accept`} className="flex-1">
                                    <Button className="w-full bg-[#A594F9] text-white hover:bg-[#8f80e9] rounded-md">Accept</Button>
                                </Link>
                                <Link to={`/charity/incidents/${incident.id}/reject`} className="flex-1">
                                    <Button variant="outline" className="w-full border border-[#CDC1FF] bg-white text-gray-700 hover:bg-[#F5EFFF] rounded-md">
                                        Reject
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Incidents; 