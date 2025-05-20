import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserEditForm from '../../components/admin/UserEditForm';

export default function UserEdit() {
  const { userId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link 
          to="/admin/users" 
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Link>
        <h1 className="text-2xl font-bold">Edit User</h1>
      </div>

      <UserEditForm userId={userId} initialTab={activeTab} />
    </div>
  );
} 