import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Users,
  ClipboardList,
  BookTemplate,
  Video,
  UserCog,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '@lotus/shared-types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/exercises',
    label: 'Exercises',
    icon: Dumbbell,
    requiredRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.TRAINER],
  },
  {
    to: '/clients',
    label: 'Clients',
    icon: Users,
    requiredRoles: [UserRole.ADMIN, UserRole.TRAINER],
  },
  {
    to: '/workouts/prebuilt',
    label: 'Prebuilt Workouts',
    icon: BookTemplate,
    requiredRoles: [UserRole.ADMIN, UserRole.TRAINER],
  },
  {
    to: '/media',
    label: 'Media Library',
    icon: Video,
    requiredRoles: [UserRole.ADMIN, UserRole.EDITOR],
  },
  {
    to: '/users',
    label: 'User Management',
    icon: UserCog,
    requiredRoles: [UserRole.ADMIN],
  },
  {
    to: '/leads',
    label: 'Lead Management',
    icon: UserPlus,
    requiredRoles: [UserRole.ADMIN],
  },
];

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const hasRequiredRole = (requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    return user?.roles.some(role => requiredRoles.includes(role)) ?? false;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const visibleNavItems = navItems.filter(item => hasRequiredRole(item.requiredRoles));

  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  }`}
                />
                {item.label}
              </>
            )}
          </NavLink>
        );
      })}

      {/* Logout button */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors mt-4"
      >
        <LogOut className="mr-3 h-5 w-5 text-gray-400" />
        Sign Out
      </button>
    </nav>
  );
};
