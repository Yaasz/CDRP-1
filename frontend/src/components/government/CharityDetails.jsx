import { ArrowLeft, CheckCircle, XCircle, RefreshCw, ExternalLink, Calendar, Users, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function CharityDetails({ 
  activeCharity, 
  closeCharityDetails, 
  handleVerify, 
  handleDeactivate, 
  handleReactivate, 
  handleEditCharity,
  actionLoading 
}) {
  if (!activeCharity) return null;
  
  return (
    <>
      <div className="flex gap-2 mb-2">
        <Badge className={activeCharity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {activeCharity.status}
        </Badge>
        <Badge className={activeCharity.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
          {activeCharity.isVerified ? 'Verified' : 'Unverified'}
        </Badge>
      </div>
      
      <Button 
        onClick={closeCharityDetails} 
        className="w-full mb-4 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
      >
        <ArrowLeft size={16} /> Back to List
      </Button>
      
      <div className="space-y-2">
        {!activeCharity.isVerified && (
          <Button 
            className="w-full bg-green-600 text-white" 
            onClick={() => handleVerify(activeCharity._id)}
            disabled={actionLoading === activeCharity._id}
          >
            {actionLoading === activeCharity._id ? (
              <RefreshCw className="animate-spin mr-1" size={16} />
            ) : (
              <CheckCircle size={16} className="mr-1" />
            )}
            Verify Organization
          </Button>
        )}
        
        {activeCharity.status === 'active' && (
          <Button 
            className="w-full bg-red-600 text-white" 
            onClick={() => handleDeactivate(activeCharity._id)}
            disabled={actionLoading === activeCharity._id}
          >
            {actionLoading === activeCharity._id ? (
              <RefreshCw className="animate-spin mr-1" size={16} />
            ) : (
              <XCircle size={16} className="mr-1" />
            )}
            Deactivate
          </Button>
        )}
        
        {activeCharity.status === 'inactive' && (
          <Button 
            className="w-full bg-green-600 text-white" 
            onClick={() => handleReactivate(activeCharity._id)}
            disabled={actionLoading === activeCharity._id}
          >
            {actionLoading === activeCharity._id ? (
              <RefreshCw className="animate-spin mr-1" size={16} />
            ) : (
              <CheckCircle size={16} className="mr-1" />
            )}
            Reactivate
          </Button>
        )}
      </div>
    </>
  );
} 