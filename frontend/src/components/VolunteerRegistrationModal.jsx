import { useState } from 'react';
import Modal from './Modal'; // Import the base modal

export default function VolunteerRegistrationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in Name, Email, and Phone.');
      return;
    }
    // Pass data up to the parent component
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Volunteer Registration">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Please provide your information to register as a volunteer. This allows you to quickly sign up for future opportunities.
        </p>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <div>
          <label htmlFor="vr-name" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <input type="text" id="vr-name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="vr-email" className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
          <input type="email" id="vr-email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="vr-phone" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
          <input type="tel" id="vr-phone" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="vr-skills" className="block text-sm font-medium text-gray-700">Skills (Optional)</label>
          <textarea id="vr-skills" name="skills" value={formData.skills} onChange={handleChange} rows="3" placeholder="e.g., Medical, Translation, Logistics..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
         <div>
          <label htmlFor="vr-availability" className="block text-sm font-medium text-gray-700">Availability (Optional)</label>
          <input type="text" id="vr-availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., Weekends, Evenings..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </form>
    </Modal>
  );
}
