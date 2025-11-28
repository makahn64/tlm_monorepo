import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { createUser, updateUser, resetPassword } from '@lotus/api-client';
import type { User, UserRole } from '@lotus/shared-types';
import { UserRole as UserRoleEnum } from '@lotus/shared-types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface UserFormProps {
  user?: User;
  mode: 'create' | 'edit';
}

export const UserForm = ({ user, mode }: UserFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    roles: user?.roles || ([] as UserRole[]),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role: UserRole) => {
    setFormData((prev) => {
      const currentRoles = prev.roles;
      const hasRole = currentRoles.includes(role);

      return {
        ...prev,
        roles: hasRole
          ? currentRoles.filter((r) => r !== role)
          : [...currentRoles, role],
      };
    });
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (formData.roles.length === 0) {
      return 'At least one role is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      if (mode === 'create') {
        // Create user document in Firestore
        const newUser = await createUser(db, {
          ...formData,
          clients: [],
        });

        // Send password reset email so user can set their password
        try {
          await resetPassword(auth, formData.email);
          setSuccess(
            `User created successfully! A password reset email has been sent to ${formData.email}.`
          );
          
          // Navigate after a short delay to show success message
          setTimeout(() => {
            navigate('/users');
          }, 3000);
        } catch (emailError) {
          console.error('Error sending password reset email:', emailError);
          setSuccess(
            `User created successfully, but failed to send password reset email. Please send it manually.`
          );
          
          // Navigate after a short delay
          setTimeout(() => {
            navigate('/users');
          }, 3000);
        }
      } else if (user) {
        // Update existing user
        await updateUser(db, user.uid, formData);
        setSuccess('User updated successfully!');
        
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate('/users');
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      [UserRoleEnum.ADMIN]: 'Admin',
      [UserRoleEnum.EDITOR]: 'Editor',
      [UserRoleEnum.TRAINER]: 'Trainer',
    };
    return labels[role] || role;
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions: Record<UserRole, string> = {
      [UserRoleEnum.ADMIN]: 'Full system access including user management',
      [UserRoleEnum.EDITOR]: 'Can manage exercises, media, and prebuilt workouts',
      [UserRoleEnum.TRAINER]: 'Can manage clients and create workouts',
    };
    return descriptions[role] || '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-green-600">
              <p className="font-semibold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={mode === 'edit'}
            />
            {mode === 'edit' && (
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed after creation</p>
            )}
          </div>

          {mode === 'create' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> A password reset email will be sent to this address after
                the user is created. The user will need to set their password using the link in
                that email.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Select one or more roles for this user. Users can have multiple roles.
            </p>

            {Object.values(UserRoleEnum).map((role) => (
              <label
                key={role}
                className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{getRoleLabel(role)}</div>
                  <div className="text-sm text-gray-600">{getRoleDescription(role)}</div>
                </div>
              </label>
            ))}

            {formData.roles.length === 0 && (
              <p className="text-sm text-red-600 mt-2">At least one role must be selected</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/users')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading} disabled={loading}>
          {mode === 'create' ? 'Create User' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
