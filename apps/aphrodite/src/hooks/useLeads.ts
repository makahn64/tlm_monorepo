import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { getAllLeads, getUnprocessedLeads, getLeadsByDisposition } from '@lotus/api-client';
import type { Lead, LeadState } from '@lotus/shared-types';

interface UseLeadsOptions {
  disposition?: LeadState | 'unprocessed';
}

interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useLeads = (options: UseLeadsOptions = {}): UseLeadsResult => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Lead[];
      
      if (options.disposition === 'unprocessed') {
        data = await getUnprocessedLeads(db);
      } else if (options.disposition) {
        data = await getLeadsByDisposition(db, options.disposition);
      } else {
        data = await getAllLeads(db);
      }

      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [options.disposition]);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
  };
};
