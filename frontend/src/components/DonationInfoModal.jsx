import { useRef, useEffect } from 'react';
import Modal from './Modal'; // Import the base modal

export default function DonationInfoModal({ isOpen, onClose, organization = "Hope Foundation" }) {
  const modalRef = useRef(null);

  // Mock data for the organization
  const orgData = {
    name: organization,
    description: "Your donation supports education, healthcare, and community development programs for underprivileged communities in Ethiopia.",
    logo: "/logo.png", // Placeholder, use your actual logo path
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    bankAccounts: [
      {
        bank: "Commercial Bank of Ethiopia (CBE)",
        accountHolder: "Ethiopian Red Cross Society", // Example Charity
        accountNumber: "1000123456789"
      },
      {
        bank: "Awash Bank",
        accountHolder: "Ethiopian Red Cross Society",
        accountNumber: "01301234567890"
      },
      {
        bank: "Bank of Abyssinia",
        accountHolder: "Ethiopian Red Cross Society",
        accountNumber: "9876543210123"
      }
    ]
  };

  // Handle copy to clipboard functionality
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Donate to ${orgData.name}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side - Image and description */}
        <div>
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4 bg-gray-200">
            <img 
              src={orgData.image} 
              alt="Donation impact" 
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Help Us Make a Difference</h3>
          <p className="text-gray-600 text-sm">{orgData.description}</p>
        </div>
        
        {/* Right side - Bank details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
          
          <div className="space-y-6">
            {orgData.bankAccounts.map((account, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                <div className="flex items-start mb-1">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  <span className="font-medium">{account.bank}</span>
                </div>
                <div className="text-sm text-gray-600 ml-7 mb-1">
                  Account Holder: {account.accountHolder}
                </div>
                <div className="flex items-center ml-7">
                  <div className="text-gray-800 font-mono">{account.accountNumber}</div>
                  <button 
                    onClick={() => handleCopy(account.accountNumber)}
                    className="ml-auto bg-yellow-400 text-yellow-800 px-3 py-1 rounded-md text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="text-base font-medium mt-6 mb-3">Share Details</h3>
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center">
              <span className="mr-2">WhatsApp</span>
            </button>
            <button className="flex-1 bg-blue-500 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center">
              <span className="mr-2">Email</span>
            </button>
            <button className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center">
              <span className="mr-2">SMS</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <a
          href="/"
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-6 py-2 inline-block"
        >
          Return to Home
        </a>
      </div>
    </Modal>
  );
}
