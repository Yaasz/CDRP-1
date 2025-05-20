import React from 'react'
import { useParams } from 'react-router-dom'

const guides = {
  'how-it-works': {
    title: 'How CDRP Works',
    sections: [
      {
        title: 'Understanding CDRP',
        content: 'CDRP (Community Disaster Response Platform) is a comprehensive system designed to facilitate effective disaster response through community engagement.',
        image: '/images/understanding-cdrp.jpg'
      },
      {
        title: 'Key Features',
        content: 'Our platform offers real-time reporting, resource coordination, and volunteer management to ensure swift and efficient disaster response.',
        image: '/images/key-features.jpg'
      },
      {
        title: 'Technology Stack',
        content: 'Built with modern web technologies, CDRP ensures reliability, security, and seamless user experience across all devices.',
        image: '/images/tech-stack.jpg'
      }
    ]
  },
  'who-can-use': {
    title: 'Who Can Use CDRP',
    sections: [
      {
        title: 'Community Members',
        content: 'Any community member can use CDRP to report incidents, request assistance, or offer help during disasters.',
        image: '/images/community-members.jpg'
      },
      {
        title: 'Emergency Responders',
        content: 'Professional emergency responders can coordinate their efforts and access real-time information through the platform.',
        image: '/images/emergency-responders.jpg'
      },
      {
        title: 'Volunteers',
        content: 'Volunteers can register, receive training, and be deployed effectively where they are needed most.',
        image: '/images/volunteers.jpg'
      }
    ]
  },
  'in-action': {
    title: 'CDRP in Action',
    sections: [
      {
        title: 'Success Stories',
        content: 'Read about how CDRP has helped communities respond effectively to various disaster scenarios.',
        image: '/images/success-stories.jpg'
      },
      {
        title: 'Impact Metrics',
        content: 'View the measurable impact CDRP has had on community disaster response and recovery.',
        image: '/images/impact-metrics.jpg'
      },
      {
        title: 'Testimonials',
        content: 'Hear from community members, volunteers, and emergency responders about their experience with CDRP.',
        image: '/images/testimonials.jpg'
      }
    ]
  }
}

const GuideContent = () => {
  const { guideId } = useParams()
  const guide = guides[guideId]

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{color: 'var(--primary-dark)'}}>{guide.title}</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {guide.sections.map((section, index) => (
          <div key={index} className="card">
            <img
              src={section.image}
              alt={section.title}
              className="section-image mb-4"
            />
            <h2 className="text-xl font-semibold mb-2" style={{color: 'var(--primary)'}}>{section.title}</h2>
            <p className="text-gray-600">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuideContent
