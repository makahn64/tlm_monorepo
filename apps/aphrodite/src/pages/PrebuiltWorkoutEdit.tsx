import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getPrebuiltWorkoutById, updatePrebuiltWorkout } from '@lotus/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { Exercise, Workout, PrebuiltWorkout } from '@lotus/shared-types';
import { WorkoutEditor } from '../components/WorkoutEditor';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const PrebuiltWorkoutEdit = () => {
  const { id: workoutId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<PrebuiltWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'TLM' | 'private' | 'shared'>('private');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) return;

      try {
        setLoading(true);
        const data = await getPrebuiltWorkoutById(db, workoutId);
        
        // Check if user is the author
        if (user && data.authorId !== user.uid) {
          setError('You do not have permission to edit this workout');
          return;
        }

        setWorkout(data);
        setVisibility(data.visibility);
        setInternalNotes(data.internalNotes || '');
      } catch (err) {
        console.error('Error loading prebuilt workout:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prebuilt workout');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, user]);

  const handleSave = async (exercises: Exercise[], workoutData: Partial<Workout>) => {
    if (!workoutId || !workout) return;

    try {
      setIsLoading(true);
      setError(null);

      await updatePrebuiltWorkout(db, workoutId, {
        name: workoutData.name,
        workoutType: workoutData.workoutType,
        exercises,
        duration: workoutData.duration,
        visibility,
        internalNotes: internalNotes || undefined,
      });

      navigate(`/workouts/prebuilt/${workoutId}`);
    } catch (err) {
      console.error('Error updating prebuilt workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to update prebuilt workout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/workouts/prebuilt/${workoutId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading prebuilt workout...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error || 'Prebuilt workout not found'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Prebuilt Workout</h1>
        <p className="text-gray-500 mt-1">Update your workout template</p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as typeof visibility)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="private">Private (Only you can see this)</option>
              <option value="shared">Shared (All trainers can see this)</option>
              <option value="TLM">TLM (Official template)</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {visibility === 'private' && 'Only you will be able to see and use this template'}
              {visibility === 'shared' && 'All trainers will be able to see and use this template'}
              {visibility === 'TLM' && 'This will be an official TLM template visible to everyone'}
            </p>
          </div>

          <div>
            <label htmlFor="internalNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              id="internalNotes"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this template..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <WorkoutEditor
        initialExercises={workout.exercises}
        workoutName={workout.name}
        workoutType={workout.workoutType}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
