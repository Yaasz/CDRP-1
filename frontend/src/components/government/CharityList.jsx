import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, RefreshCw, 
  Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function CharityList({ 
  charities, 
  totalCount, 
  searchTerm, 
  setSearchTerm, 
  currentPage, 
  totalPages, 
  loading,
  goToNextPage, 
  goToPreviousPage, 
  handleVerify, 
  handleDeactivate, 
  handleReactivate, 
  viewCharityDetails,
  actionLoading
}) {
  const handleSearch = (e) => {
    e.preventDefault();
    // This is just a placeholder - the actual search function is in the parent component
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Charity Organization Management</h1>
        <p className="text-gray-500">
          View, verify, and manage charity organizations. Total Charities: {totalCount}
        </p>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search charities by name, email, or status..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </form>
        
        <div className="flex gap-2">
          <Button variant="outline" className="whitespace-nowrap">
            Filter <ChevronLeft size={16} className="ml-1" />
          </Button>
          <Button className="bg-[#7371FC] text-white whitespace-nowrap">
            Add New Charity
          </Button>
        </div>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500 mb-1">Total Organizations</h3>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500 mb-1">Verified</h3>
          <p className="text-2xl font-bold">{charities.filter(c => c.isVerified).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500 mb-1">Pending Verification</h3>
          <p className="text-2xl font-bold">{charities.filter(c => !c.isVerified).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500 mb-1">Active Campaigns</h3>
          <p className="text-2xl font-bold">-</p>
        </div>
      </div>
      
      {/* Charities Table */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {charities.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No charities found.
                </td>
              </tr>
            ) : (
              charities.map((charity) => (
                <tr key={charity._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover"
                          src={charity.image || "https://placehold.co/100"} 
                          alt={charity.organizationName} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{charity.organizationName}</div>
                        <div className="text-sm text-gray-500">ID: #{charity._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{charity.email}</div>
                    <div className="text-sm text-gray-500">{charity.phone}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{charity.taxId}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className={
                      charity.status === 'active' ? 'bg-green-100 text-green-800' :
                      charity.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {charity.status || 'pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className={charity.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                      {charity.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => viewCharityDetails(charity)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    
                    {!charity.isVerified && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 text-white" 
                        onClick={() => handleVerify(charity._id)} 
                        disabled={actionLoading === charity._id}
                      >
                        {actionLoading === charity._id ? (
                          <RefreshCw className="animate-spin mr-1" size={16} />
                        ) : (
                          <CheckCircle size={16} className="mr-1" />
                        )}
                        Verify
                      </Button>
                    )}
                    
                    {charity.isVerified && charity.status === 'active' && (
                      <Button 
                        size="sm" 
                        className="bg-red-600 text-white" 
                        onClick={() => handleDeactivate(charity._id)} 
                        disabled={actionLoading === charity._id}
                      >
                        {actionLoading === charity._id ? (
                          <RefreshCw className="animate-spin mr-1" size={16} />
                        ) : (
                          <XCircle size={16} className="mr-1" />
                        )}
                        Deactivate
                      </Button>
                    )}
                    
                    {charity.isVerified && charity.status === 'inactive' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 text-white" 
                        onClick={() => handleReactivate(charity._id)} 
                        disabled={actionLoading === charity._id}
                      >
                        {actionLoading === charity._id ? (
                          <RefreshCw className="animate-spin mr-1" size={16} />
                        ) : (
                          <CheckCircle size={16} className="mr-1" />
                        )}
                        Reactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Showing page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1} 
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
            variant="outline"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm">{currentPage}</span>
          <Button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages} 
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
            variant="outline"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
} 