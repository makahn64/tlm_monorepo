import { useAuth } from '../contexts/AuthContext';
import { currentEnvironment } from '../config/firebase';

export const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Aphrodite</h1>
              <span className="ml-2 text-sm text-gray-500">The Lotus Method</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                <span className="ml-2 text-gray-500">
                  ({user?.roles.join(', ')})
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user?.firstName}!
            </h2>
            <p className="text-gray-600 mb-6">
              You're logged into the Aphrodite admin and trainer portal.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-1">Environment</h3>
                <p className="text-lg font-semibold text-blue-700">{currentEnvironment}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 mb-1">User ID</h3>
                <p className="text-sm font-mono text-green-700 truncate">{user?.uid}</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-900 mb-1">Roles</h3>
                <p className="text-lg font-semibold text-purple-700">
                  {user?.roles.length || 0}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickActionCard
                  title="Exercises"
                  description="Manage exercise library"
                  disabled
                />
                <QuickActionCard
                  title="Clients"
                  description="View and manage clients"
                  disabled
                />
                <QuickActionCard
                  title="Workouts"
                  description="Create and assign workouts"
                  disabled
                />
                <QuickActionCard
                  title="Prebuilt Workouts"
                  description="Manage workout templates"
                  disabled
                />
                <QuickActionCard
                  title="Media"
                  description="Upload and manage videos"
                  disabled
                />
                <QuickActionCard
                  title="Users"
                  description="Manage user accounts"
                  disabled={!user?.roles.includes('admin')}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  disabled?: boolean;
}

const QuickActionCard = ({ title, description, disabled }: QuickActionCardProps) => {
  return (
    <button
      disabled={disabled}
      className={`text-left p-4 border rounded-lg transition-colors ${
        disabled
          ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
          : 'bg-white border-gray-300 hover:border-blue-500 hover:shadow-md'
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      {disabled && (
        <span className="inline-block mt-2 text-xs text-gray-500">Coming soon</span>
      )}
    </button>
  );
};
