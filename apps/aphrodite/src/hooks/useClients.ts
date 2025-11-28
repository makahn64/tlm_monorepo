import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  getAllClients,
  getClientsByTrainer,
  getClientsByType,
  getClientsByTrainerAndType,
} from '@lotus/api-client';
import type { Client, ClientType } from '@lotus/shared-types';

interface UseClientsOptions {
  trainerId?: string;
  clientType?: ClientType;
  searchTerm?: string;
}

export const useClients = (options: UseClientsOptions = {}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);

        let result: Client[];

        // Determine which API call to use based on filters
        if (options.trainerId && options.clientType) {
          result = await getClientsByTrainerAndType(db, options.trainerId, options.clientType);
        } else if (options.trainerId) {
          result = await getClientsByTrainer(db, options.trainerId);
        } else if (options.clientType) {
          result = await getClientsByType(db, options.clientType);
        } else {
          result = await getAllClients(db);
        }

        // Apply client-side search if provided
        if (options.searchTerm) {
          const lowerSearchTerm = options.searchTerm.toLowerCase();
          result = result.filter(
            (client) =>
              client.firstName.toLowerCase().includes(lowerSearchTerm) ||
              client.lastName.toLowerCase().includes(lowerSearchTerm) ||
              client.email.toLowerCase().includes(lowerSearchTerm)
          );
        }

        setClients(result);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [options.trainerId, options.clientType, options.searchTerm]);

  return { clients, loading, error };
};
