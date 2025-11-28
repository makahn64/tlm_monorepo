import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Users,
  BookTemplate,
  Video,
  UserCog,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '@lotus/shared-types';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  requiredRoles?: UserRole[];
}

const quickActions: QuickAction[] = [
  {
    title: 'Exercises',
    description: 'Manage exercise library',
    icon: Dumbbell,
    path: '/exercises',
    requiredRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.TRAINER],
  },
  {
    title: 'Clients',
    description: 'View and manage clients',
    icon: Users,
    path: '/clients',
    requiredRoles: [UserRole.ADMIN, UserRole.TRAINER],
  },
  {
    title: 'Prebuilt Workouts',
    description: 'Manage workout templates',
    icon: BookTemplate,
    path: '/workouts/prebuilt',
    requiredRoles: [UserRole.ADMIN, UserRole.TRAINER],
  },
  {
    title: 'Media Library',
    description: 'Upload and manage videos',
    icon: Video,
    path: '/media',
    requiredRoles: [UserRole.ADMIN, UserRole.EDITOR],
  },
  {
    title: 'User Management',
    description: 'Manage user accounts',
    icon: UserCog,
    path: '/users',
    requiredRoles: [UserRole.ADMIN],
  },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasRequiredRole = (requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    return user?.roles.some(role => requiredRoles.includes(role)) ?? false;
  };

  const visibleActions = quickActions.filter(action => hasRequiredRole(action.requiredRoles));

  const isTrainer = user?.roles.includes(UserRole.TRAINER);
  const clientCount = user?.clients?.length || 0;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your workspace today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isTrainer && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">My Clients</p>
                <p className="text-3xl font-bold text-gray-900">{clientCount}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Your Roles</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Jump to the most common tasks
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                >
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Getting Started (for new users) */}
      {isTrainer && clientCount === 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Getting Started
          </h3>
          <p className="text-blue-800 mb-4">
            You don't have any clients yet. Start by adding your first client to begin creating workouts.
          </p>
          <button
            onClick={() => navigate('/clients/new')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="h-4 w-4 mr-2" />
            Add Your First Client
          </button>
        </div>
      )}
    </div>
  );
};
