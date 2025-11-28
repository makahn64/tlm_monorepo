import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { getAllUsers, getUsersByRole } from '@lotus/api-client';
import type { User, UserRole } from '@lotus/shared-types';

interface UseUsersOptions {
  role?: UserRole;
  searchTerm?: string;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        let result: User[];

        // Determine which API call to use based on filters
        if (options.role) {
          result = await getUsersByRole(db, options.role);
        } else {
          result = await getAllUsers(db);
        }

        // Apply client-side search if provided
        if (options.searchTerm) {
          const lowerSearchTerm = options.searchTerm.toLowerCase();
          result = result.filter(
            (user) =>
              user.firstName.toLowerCase().includes(lowerSearchTerm) ||
              user.lastName.toLowerCase().includes(lowerSearchTerm) ||
              user.email.toLowerCase().includes(lowerSearchTerm)
          );
        }

        setUsers(result);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [options.role, options.searchTerm]);

  return { users, loading, error };
};
