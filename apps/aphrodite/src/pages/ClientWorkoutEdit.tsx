import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { updateClientWorkout, getClientById } from '@lotus/api-client';
import type { Exercise, Client, Workout } from '@lotus/shared-types';
import { WorkoutEditor } from '../components/WorkoutEditor';
import { Card, CardContent } from '../components/ui/Card';
import { doc, getDoc } from 'firebase/firestore';

export const ClientWorkoutEdit = () => {
  const { id: clientId, workoutId } = useParams<{ id: string; workoutId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!clientId || !workoutId) return;

      try {
        setLoadingData(true);
        
        // Load client
        const clientData = await getClientById(db, clientId);
        setClient(clientData);

        // Load workout
        const workoutRef = doc(db, `clients/${clientId}/workouts`, workoutId);
        const workoutDoc = await getDoc(workoutRef);
        
        if (!workoutDoc.exists()) {
          throw new Error('Workout not found');
        }

        const data = workoutDoc.data();
        const workoutData: Workout = {
          id: workoutDoc.id,
          name: data.name,
          workoutType: data.workoutType,
          exercises: data.exercises || [],
          createdBy: data.createdBy,
          createdAt: data.createdAt?.toDate() || new Date(),
          generatedBy: data.generatedBy || 'trainer',
          duration: data.duration,
          startedOn: data.startedOn?.toDate(),
          completedOn: data.completedOn?.toDate(),
          clientNotes: data.clientNotes,
          internalNotes: data.internalNotes,
          feedback: data.feedback,
          progress: data.progress,
          favorite: data.favorite,
          set: data.set,
        };

        setWorkout(workoutData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [clientId, workoutId]);

  const handleSave = async (exercises: Exercise[], workoutData: any) => {
    if (!clientId || !workoutId) return;

    try {
      setLoading(true);
      setError(null);

      await updateClientWorkout(db, clientId, workoutId, {
        ...workoutData,
        exercises,
      });

      navigate(`/clients/${clientId}/workouts/${workoutId}`);
    } catch (err) {
      console.error('Error updating workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/clients/${clientId}/workouts/${workoutId}`);
  };

  if (loadingData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading workout...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !workout || !client) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error || 'Workout not found'}</p>
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
            {client.firstName} {client.lastName}
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to={`/clients/${clientId}/workouts`}
            className="text-blue-600 hover:underline text-sm"
          >
            Workouts
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to={`/clients/${clientId}/workouts/${workoutId}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {workout.name || 'Untitled'}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-600">Edit</span>
        </div>
        <h1 className="text-3xl font-bold">Edit Workout</h1>
        <p className="text-gray-500 mt-1">
          Update workout for {client.firstName} {client.lastName}
        </p>
      </div>

      <WorkoutEditor
        initialExercises={workout.exercises}
        workoutName={workout.name}
        workoutType={workout.workoutType}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
};
