import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import OrganizationEditForm from '../../components/admin/OrganizationEditForm';

export default function OrganizationEdit() {
  const { orgId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab');
  const orgType = queryParams.get('type') || 'charity'; // Default to charity if not specified

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link 
          to="/admin/users" 
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Organizations
        </Link>
        <h1 className="text-2xl font-bold">
          Edit {orgType === 'government' ? 'Government' : 'Charity'} Organization
        </h1>
      </div>

      <OrganizationEditForm orgId={orgId} initialTab={activeTab} />
    </div>
  );
} 