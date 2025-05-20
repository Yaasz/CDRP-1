// Mock data for charity dashboard
export const volunteers = [
  {
    id: 1,
    name: "Abebe Kebede",
    role: "Community Organizer",
    experience: "12 years exp.",
    status: "Available",
    avatar: "https://picsum.photos/seed/v1/200",
  },
  {
    id: 2,
    name: "Tigist Haile",
    role: "Medical Professional",
    experience: "8 years exp.",
    status: "Limited",
    avatar: "https://picsum.photos/seed/v2/200",
  },
  {
    id: 3,
    name: "Dawit Mekonnen",
    role: "Financial Advisor",
    experience: "15 years exp.",
    status: "Limited",
    avatar: "https://picsum.photos/seed/v3/200",
  },
  {
    id: 4,
    name: "Hiwot Tadesse",
    role: "IT Specialist",
    experience: "10 years exp.",
    status: "Available",
    avatar: "https://picsum.photos/seed/v4/200",
  },
];

// Sample charity organizations that match organization model schema
export const charities = [
  {
    _id: "org123456789", 
    organizationName: "Global Relief Foundation",
    email: "contact@globalrelief.org",
    phone: "+1 555 123 4567",
    taxId: "TXID123456",
    image: "https://picsum.photos/seed/charity1/200",
    mission: "Providing humanitarian aid and disaster relief worldwide",
    role: "charity",
    isVerified: false,
    status: "active",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z"
  },
  {
    _id: "org234567890",
    organizationName: "Education First Initiative",
    email: "info@educationfirst.org",
    phone: "+1 555 987 6543",
    taxId: "TXID234567",
    image: "https://picsum.photos/seed/charity2/200",
    mission: "Empowering communities through quality education and learning resources",
    role: "charity",
    isVerified: true,
    status: "active",
    createdAt: "2022-11-05T10:30:00Z",
    updatedAt: "2023-02-20T14:45:00Z"
  },
  {
    _id: "org345678901",
    organizationName: "Green Earth Initiative",
    email: "hello@greenearth.org",
    phone: "+1 555 222 3333",
    taxId: "TXID345678",
    image: "https://picsum.photos/seed/charity3/200",
    mission: "Promoting environmental conservation and sustainable development",
    role: "charity",
    isVerified: true,
    status: "inactive",
    createdAt: "2022-08-18T09:15:00Z",
    updatedAt: "2023-03-10T11:20:00Z"
  },
  {
    _id: "org456789012",
    organizationName: "Health For All",
    email: "info@healthforall.org",
    phone: "+1 555 444 5555",
    taxId: "TXID456789",
    image: "https://picsum.photos/seed/charity4/200",
    mission: "Providing accessible healthcare services to underserved communities",
    role: "charity",
    isVerified: false,
    status: "active",
    createdAt: "2023-02-01T08:45:00Z",
    updatedAt: "2023-02-01T08:45:00Z"
  },
  {
    _id: "org567890123",
    organizationName: "Children's Future Trust",
    email: "contact@childrensfuture.org",
    phone: "+1 555 777 8888",
    taxId: "TXID567890",
    image: "https://picsum.photos/seed/charity5/200",
    mission: "Supporting children's education, health, and wellbeing across the region",
    role: "charity",
    isVerified: true,
    status: "active",
    createdAt: "2022-06-20T13:30:00Z",
    updatedAt: "2023-01-15T16:20:00Z"
  }
];

// Sample charity ads that match charityadModel schema
export const charityAds = [
  {
    _id: "ad123456789",
    charity: "org123456789", // corresponds to Global Relief Foundation
    title: "Emergency Drought Relief Campaign",
    image: "https://picsum.photos/seed/charityad1/400/300",
    cloudinaryId: "charity_ads/ad123456789",
    description: "Fundraising and volunteer recruitment for drought-affected communities in Eastern Ethiopia. We need medical professionals, logistics experts, and general volunteers.",
    status: "open",
    volunteers: ["vol123", "vol124", "vol125"],
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    categories: ["Emergency", "Drought", "Medical"],
    requirements: [
      {
        location: "Eastern Ethiopia",
        skills: ["Medical", "Logistics", "Distribution"]
      }
    ],
    createdAt: "2023-04-15T10:00:00Z",
    updatedAt: "2023-04-15T10:00:00Z"
  },
  {
    _id: "ad234567890",
    charity: "org234567890", // corresponds to Education First Initiative
    title: "School Construction Volunteers Needed",
    image: "https://picsum.photos/seed/charityad2/400/300",
    cloudinaryId: "charity_ads/ad234567890",
    description: "Seeking volunteers for school construction project in rural communities. Carpentry, masonry, and general construction skills needed. Training provided for unskilled volunteers.",
    status: "open",
    volunteers: ["vol126", "vol127"],
    duration: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    categories: ["Construction", "Education", "Community"],
    requirements: [
      {
        location: "Southern Region",
        skills: ["Construction", "Carpentry", "Teaching"]
      }
    ],
    createdAt: "2023-03-20T14:30:00Z",
    updatedAt: "2023-03-25T09:15:00Z"
  },
  {
    _id: "ad345678901",
    charity: "org345678901", // corresponds to Green Earth Initiative
    title: "Reforestation Project Volunteers",
    image: "https://picsum.photos/seed/charityad3/400/300",
    cloudinaryId: "charity_ads/ad345678901",
    description: "Join our reforestation efforts to combat deforestation and soil erosion. No specific skills required, just enthusiasm and willingness to work outdoors.",
    status: "closed",
    volunteers: ["vol128", "vol129", "vol130", "vol131"],
    duration: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Expired 5 days ago
    categories: ["Environment", "Conservation", "Community"],
    requirements: [
      {
        location: "Western Highlands",
        skills: ["Forestry", "Agriculture", "General Labor"]
      }
    ],
    createdAt: "2023-02-10T11:45:00Z",
    updatedAt: "2023-02-25T16:30:00Z"
  },
  {
    _id: "ad456789012",
    charity: "org456789012", // corresponds to Health For All
    title: "Mobile Clinic Volunteers",
    image: "https://picsum.photos/seed/charityad4/400/300",
    cloudinaryId: "charity_ads/ad456789012",
    description: "Medical professionals needed for mobile clinic initiative bringing healthcare to remote areas. Doctors, nurses, pharmacists, and support staff welcome.",
    status: "open",
    volunteers: ["vol132"],
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    categories: ["Healthcare", "Medical", "Outreach"],
    requirements: [
      {
        location: "Various Regions",
        skills: ["Medical", "Pharmacy", "Administration"]
      }
    ],
    createdAt: "2023-04-05T13:20:00Z",
    updatedAt: "2023-04-10T10:10:00Z"
  },
  {
    _id: "ad567890123",
    charity: "org567890123", // corresponds to Children's Future Trust
    title: "After-School Program Educators",
    image: "https://picsum.photos/seed/charityad5/400/300",
    cloudinaryId: "charity_ads/ad567890123",
    description: "Looking for educators and mentors for our after-school programs focusing on STEM, arts, and sports. Part-time commitment required for at least 3 months.",
    status: "open",
    volunteers: ["vol133", "vol134", "vol135"],
    duration: 20 * 24 * 60 * 60 * 1000, // 20 days in milliseconds
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    categories: ["Education", "Youth", "Mentoring"],
    requirements: [
      {
        location: "Urban Centers",
        skills: ["Teaching", "Coaching", "Mentoring"]
      }
    ],
    createdAt: "2023-03-30T09:00:00Z",
    updatedAt: "2023-04-02T15:45:00Z"
  }
];

export const incidents = [
  {
    id: 1,
    title: "Drought Relief - Tigray Region",
    assignedBy: "Government",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Community School Construction",
    assignedBy: "Government",
    status: "Required",
  },
  {
    id: 3,
    title: "Medical Supply Distribution",
    assignedBy: "Government",
    status: "New",
  },
];

export const applications = [
  {
    id: 1,
    name: "Kidist Alemu",
    role: "Medical Assistant",
    avatar: "https://picsum.photos/seed/v1/200",
  },
  {
    id: 2,
    name: "Yonas Bekele",
    role: "Logistics Coordinator",
    avatar: "https://picsum.photos/seed/v2/200",
  },
];

// Volunteer categories for Volunteer Management Dashboard
export const volunteerCategories = {
  expertise: [
    {
      id: "KV196",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "https://picsum.photos/seed/v1/200",
    },
    {
      id: "KV227",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "https://picsum.photos/seed/v2/200",
    },
  ],
  material: [
    {
      id: "KV234",
      name: "David Wilson",
      email: "david.w@example.com",
      avatar: "https://picsum.photos/seed/v3/200",
    },
    {
      id: "KV235",
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      avatar: "https://picsum.photos/seed/v4/200",
    },
  ],
  labour: [
    {
      id: "KV228",
      name: "Michael Jordan",
      email: "michael.j@example.com",
      avatar: "https://picsum.photos/seed/v1/200",
    },
    {
      id: "KV229",
      name: "Emily Parker",
      email: "emily.p@example.com",
      avatar: "https://picsum.photos/seed/v2/200",
    },
  ],
};

// Detailed volunteer information for profile page
export const volunteerDetails = {
  "KV196": {
    id: "KV196",
    name: "John Smith",
    role: "Medical Doctor",
    experience: "10 years exp.",
    status: "Available",
    email: "john.smith@example.com",
    phone: "+251 91 234 1234",
    location: "Addis Ababa, Ethiopia",
    availability: "Weekdays, Mornings",
    bio: "Experienced medical doctor with specialization in emergency medicine. Has worked with multiple international NGOs in crisis situations across East Africa.",
    skills: ["Emergency Medicine", "First Aid Training", "Crisis Management", "Medical Coordination", "Medical Supplies"],
    pastProjects: [
      {
        name: "Emergency Response Team - Drought Relief",
        date: "Mar 2023 - Jun 2023",
        description: "Led medical team providing emergency care in drought-affected regions.",
      },
      {
        name: "Medical Training Program",
        date: "Sep 2022 - Dec 2022",
        description: "Trained 30+ local medical practitioners in emergency response protocols.",
      },
      {
        name: "Mobile Clinic Initiative",
        date: "Jan 2022 - Jul 2022",
        description: "Established 3 mobile clinics serving remote communities with limited healthcare access.",
      },
    ],
    avatar: "https://picsum.photos/seed/v1/200",
  },
  "1": {
    id: "1",
    name: "Abebe Kebede",
    role: "Community Organizer",
    experience: "12 years exp.",
    status: "Available",
    email: "abebe.kebede@example.com",
    phone: "+251 91 234 5678",
    location: "Addis Ababa, Ethiopia",
    availability: "Weekends, Evenings",
    bio: "Dedicated community organizer with over a decade of experience in mobilizing volunteers for various social causes. Specializes in drought relief efforts and community development projects in rural areas of Ethiopia.",
    skills: ["Leadership", "Community Outreach", "Project Management", "Volunteer Coordination", "Public Speaking"],
    pastProjects: [
      {
        name: "Tigray Relief Initiative",
        date: "Jan 2023 - Mar 2023",
        description: "Coordinated 50+ volunteers for emergency relief distribution in drought-affected areas.",
      },
      {
        name: "Addis Ababa School Construction",
        date: "Jun 2022 - Dec 2022",
        description: "Led community efforts to build a new school facility serving 200+ children.",
      },
      {
        name: "Clean Water Project",
        date: "Mar 2021 - Aug 2021",
        description: "Organized installation of water purification systems in 5 rural communities.",
      },
    ],
    avatar: "https://picsum.photos/seed/v1/200",
  }
};

// Assigned incidents for the incidents page
export const assignedIncidents = [
  {
    id: 1,
    title: "Downtown Flooding",
    location: "Central District, Block A",
    impact: "High Impact",
    impactColor: "bg-red-500",
    timeAgo: "2h ago",
    imageUrl: "https://picsum.photos/seed/flood1/400/300"
  },
  {
    id: 2,
    title: "Forest Fire",
    location: "Northern Forest Area",
    impact: "Medium Impact",
    impactColor: "bg-orange-500",
    timeAgo: "5h ago",
    imageUrl: "https://picsum.photos/seed/fire1/400/300"
  },
  {
    id: 3,
    title: "Highway Collision",
    location: "Highway 101, Mile 45",
    impact: "Low Impact",
    impactColor: "bg-green-500",
    timeAgo: "1d ago",
    imageUrl: "https://picsum.photos/seed/collision1/400/300"
  }
];

// Detailed incident information for incident details page
export const incidentDetails = {
  "1": {
    id: 1,
    title: "Drought Relief - Tigray Region",
    description: "Emergency response to severe drought affecting communities in Tigray region. This project focuses on distributing water, food, and essential supplies to affected communities.",
    assignedBy: "Government",
    status: "In Progress",
    statusColor: "bg-purple-600",
    location: "Tigray Region, Northern Ethiopia",
    startDate: "2023-05-15",
    endDate: "2023-08-30",
    progress: 65,
    budget: "$50,000",
    coordinator: "Selam Tesfaye",
    objectives: [
      "Distribute clean water to 5,000 affected individuals",
      "Provide food supplies to 1,200 families",
      "Set up 3 temporary medical facilities",
      "Establish sustainable water sources for long-term relief"
    ],
    assignedVolunteers: [
      {
        id: 1,
        name: "Abebe Kebede",
        role: "Team Lead",
        avatar: "https://picsum.photos/seed/v1/200"
      },
      {
        id: 2,
        name: "Tigist Haile",
        role: "Medical Coordinator",
        avatar: "https://picsum.photos/seed/v2/200"
      },
      {
        id: 3,
        name: "Dawit Mekonnen",
        role: "Resource Manager",
        avatar: "https://picsum.photos/seed/v3/200"
      },
      {
        id: 4,
        name: "Hiwot Tadesse",
        role: "Logistics Support",
        avatar: "https://picsum.photos/seed/v4/200"
      }
    ],
    updates: [
      {
        date: "2023-07-10",
        content: "Successfully distributed water to 3,200 individuals across 12 communities."
      },
      {
        date: "2023-06-25",
        content: "Set up the first temporary medical facility, now serving approximately 50 patients daily."
      },
      {
        date: "2023-06-05",
        content: "Initial assessment completed. Identified 15 communities in critical need."
      }
    ]
  },
  "2": {
    id: 2,
    title: "Forest Fire",
    description: "Emergency response to forest fire in Northern Forest Area. This project focuses on providing relief to affected communities and coordinating with firefighting teams.",
    assignedBy: "Local Authority",
    status: "New",
    statusColor: "bg-blue-600",
    location: "Northern Forest Area, Ethiopia",
    startDate: "2023-07-10",
    endDate: "2023-09-10",
    progress: 20,
    budget: "$35,000",
    coordinator: "Efrem Ghebrehiwot",
    objectives: [
      "Evacuate 500 families from affected areas",
      "Set up 2 temporary shelters",
      "Provide emergency supplies to evacuees",
      "Coordinate with firefighting teams"
    ],
    assignedVolunteers: [
      {
        id: 1,
        name: "Abebe Kebede",
        role: "Team Lead",
        avatar: "https://picsum.photos/seed/v1/200"
      },
      {
        id: 2,
        name: "Tigist Haile",
        role: "Medical Coordinator",
        avatar: "https://picsum.photos/seed/v2/200"
      }
    ],
    updates: [
      {
        date: "2023-07-12",
        content: "Initial assessment completed. 3 villages identified for immediate evacuation."
      },
      {
        date: "2023-07-11",
        content: "Team deployed to the area. Setting up coordination center."
      }
    ]
  },
  "3": {
    id: 3,
    title: "Highway Collision",
    description: "Response to a multi-vehicle collision on Highway 101. Focusing on providing medical assistance and coordinating with emergency services.",
    assignedBy: "Traffic Authority",
    status: "Completed",
    statusColor: "bg-green-600",
    location: "Highway 101, Mile 45",
    startDate: "2023-07-05",
    endDate: "2023-07-06",
    progress: 100,
    budget: "$10,000",
    coordinator: "Meron Alemu",
    objectives: [
      "Provide immediate medical assistance",
      "Coordinate with emergency services",
      "Assist with traffic control",
      "Support affected individuals"
    ],
    assignedVolunteers: [
      {
        id: 2,
        name: "Tigist Haile",
        role: "Medical Coordinator",
        avatar: "https://picsum.photos/seed/v2/200"
      },
      {
        id: 4,
        name: "Hiwot Tadesse",
        role: "Logistics Support",
        avatar: "https://picsum.photos/seed/v4/200"
      }
    ],
    updates: [
      {
        date: "2023-07-06",
        content: "All operations completed. 15 individuals received medical assistance."
      },
      {
        date: "2023-07-05",
        content: "Team arrived at site. Coordinating with emergency services."
      }
    ]
  }
};