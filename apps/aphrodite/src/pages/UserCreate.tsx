import { UserForm } from '../components/UserForm';

export const UserCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create User</h1>
        <p className="text-gray-500 mt-1">Add a new user to the system</p>
      </div>

      <UserForm mode="create" />
    </div>
  );
};
