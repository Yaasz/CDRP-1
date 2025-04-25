import Modal from './Modal'; // Import the base modal

export default function DonationInfoModal({ isOpen, onClose, organization }) {
  // Mock donation info - replace with actual fetched info or props
  const donationDetails = {
    bankAccount: '1000123456789 (Commercial Bank of Ethiopia)',
    mobileMoney: '+251 911 000 000 (Telebirr)',
    website: 'https://organization-donation-page.example.org', // Placeholder
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Donate to ${organization || 'the Organization'}`}>
      <div className="space-y-4 text-sm text-gray-700">
        <p>Thank you for considering a donation to support the work of <strong>{organization || 'this organization'}</strong>.</p>
        <p>Your contribution helps us provide essential resources and support during disaster response efforts.</p>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-800">Donation Methods (Mock Info):</h3>
           <p>
               <strong>Bank Transfer:</strong><br/>
               Account: {donationDetails.bankAccount}
           </p>
            <p>
               <strong>Mobile Money:</strong><br/>
               {donationDetails.mobileMoney}
           </p>
           <p>
               <strong>Online:</strong><br/>
               <a href={donationDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{donationDetails.website}</a>
           </p>
        </div>

         <p className="text-xs text-gray-500 pt-4 border-t border-gray-100">
           Please verify donation details directly with the organization if possible. CDRP provides this information as a convenience and is not responsible for processing donations.
         </p>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
