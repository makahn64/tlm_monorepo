import { Link } from 'react-router-dom';
import { ClientForm } from '../components/ClientForm';

export const ClientCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/clients" className="text-blue-600 hover:underline text-sm">
            ← Back to Clients
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Create New Client</h1>
        <p className="text-gray-500 mt-1">Add a new client to your roster</p>
      </div>

      <ClientForm mode="create" />
    </div>
  );
};
