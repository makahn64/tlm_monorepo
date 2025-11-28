import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { createWorkoutForClient, getClientById } from '@lotus/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { Exercise, Client } from '@lotus/shared-types';
import { WorkoutEditor } from '../components/WorkoutEditor';
import { Card, CardContent } from '../components/ui/Card';

export const ClientWorkoutCreate = () => {
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) return;

      try {
        const clientData = await getClientById(db, clientId);
        setClient(clientData);
      } catch (err) {
        console.error('Error loading client:', err);
        setError(err instanceof Error ? err.message : 'Failed to load client');
      }
    };

    loadClient();
  }, [clientId]);

  const handleSave = async (exercises: Exercise[], workoutData: any) => {
    if (!clientId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const workout = await createWorkoutForClient(db, clientId, {
        ...workoutData,
        exercises,
        createdBy: user.uid,
        createdAt: new Date(),
        generatedBy: 'trainer' as const,
      });

      navigate(`/clients/${clientId}/workouts/${workout.id}`);
    } catch (err) {
      console.error('Error creating workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/clients/${clientId}/workouts`);
  };

  if (error && !client) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/clients" className="text-blue-600 hover:underline text-sm">
            Clients
          </Link>
          <span className="text-gray-400">/</span>
          <Link to={`/clients/${clientId}`} className="text-blue-600 hover:underline text-sm">
            {client?.firstName} {client?.lastName}
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to={`/clients/${clientId}/workouts`}
            className="text-blue-600 hover:underline text-sm"
          >
            Workouts
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-600">New</span>
        </div>
        <h1 className="text-3xl font-bold">Create Workout</h1>
        <p className="text-gray-500 mt-1">
          Build a custom workout for {client?.firstName} {client?.lastName}
        </p>
      </div>

      <WorkoutEditor onSave={handleSave} onCancel={handleCancel} isLoading={loading} />
    </div>
  );
};
