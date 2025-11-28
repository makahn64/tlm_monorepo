import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { createPrebuiltWorkout } from '@lotus/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { Exercise, Workout, PrebuiltWorkout } from '@lotus/shared-types';
import { WorkoutEditor } from '../components/WorkoutEditor';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export const PrebuiltWorkoutCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'TLM' | 'private' | 'shared'>('private');
  const [internalNotes, setInternalNotes] = useState('');

  const handleSave = async (exercises: Exercise[], workoutData: Partial<Workout>) => {
    if (!user) {
      setError('You must be logged in to create a prebuilt workout');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newWorkout: Omit<PrebuiltWorkout, 'id'> = {
        name: workoutData.name,
        workoutType: workoutData.workoutType || 'normal',
        exercises,
        createdBy: user.uid,
        createdAt: new Date(),
        generatedBy: 'trainer',
        duration: workoutData.duration || 0,
        authorId: user.uid,
        visibility,
        internalNotes: internalNotes || undefined,
      };

      const created = await createPrebuiltWorkout(db, newWorkout);
      navigate(`/workouts/prebuilt/${created.id}`);
    } catch (err) {
      console.error('Error creating prebuilt workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to create prebuilt workout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/workouts/prebuilt');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Prebuilt Workout</h1>
        <p className="text-gray-500 mt-1">Create a reusable workout template</p>
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
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
