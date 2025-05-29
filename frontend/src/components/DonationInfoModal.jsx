import { X, Heart, DollarSign, CreditCard, Smartphone } from 'lucide-react';

export default function DonationInfoModal({ isOpen, onClose, organization = "Hope Foundation" }) {
  if (!isOpen) return null;

  // Mock data for the organization with Ethiopian banks
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Donate to {orgData.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-gray-600 text-sm mb-6">{orgData.description}</p>

              {/* Quick donation amounts */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Donation Amounts</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['500 ETB', '1000 ETB', '2500 ETB', '5000 ETB'].map((amount) => (
                    <button
                      key={amount}
                      className="p-3 border border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">{amount}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="mb-6">
                <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter a custom amount (ETB)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">ETB</span>
                  </div>
                  <input
                    type="number"
                    id="custom-amount"
                    placeholder="0.00"
                    className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Bank details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Ethiopian Bank Account Details</h3>
              
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
                        className="ml-auto bg-yellow-400 text-yellow-800 px-3 py-1 rounded-md text-sm hover:bg-yellow-500 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Money Options */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Mobile Money Options</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">M-Birr</span>
                    </div>
                    <span className="text-xs text-gray-500">Mobile Banking</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">HelloCash</span>
                    </div>
                    <span className="text-xs text-gray-500">Digital Wallet</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Bank Cards</span>
                    </div>
                    <span className="text-xs text-gray-500">Visa, Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Share Details */}
              <div className="mt-6">
                <h3 className="text-base font-medium mb-3">Share Details</h3>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-500 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center hover:bg-green-600 transition-colors">
                    <span className="mr-2">WhatsApp</span>
                  </button>
                  <button className="flex-1 bg-blue-500 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="mr-2">Email</span>
                  </button>
                  <button className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <span className="mr-2">SMS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-6 py-2 transition-colors"
            >
              Return to Opportunity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
