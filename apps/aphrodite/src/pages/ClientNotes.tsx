import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getClientById } from '@lotus/api-client';
import type { Client } from '@lotus/shared-types';
import { ClientNotes as ClientNotesComponent } from '../components/ClientNotes';
import { Card, CardContent } from '../components/ui/Card';

export const ClientNotesPage = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        setError(new Error('Client ID is required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getClientById(db, id);
        setClient(data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading client...</div>
      </div>
    );
  }

  if (error || !client || !id) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-semibold">Error loading client</p>
            <p className="text-sm">{error?.message || 'Client not found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/clients/${id}`} className="text-blue-600 hover:underline text-sm">
            ← Back to Client
          </Link>
        </div>
        <h1 className="text-3xl font-bold">
          Notes for {client.firstName} {client.lastName}
        </h1>
        <p className="text-gray-500 mt-1">Trainer notes and recommendations</p>
      </div>

      <ClientNotesComponent clientId={id} />
    </div>
  );
};
