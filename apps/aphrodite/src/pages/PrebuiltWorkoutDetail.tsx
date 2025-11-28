import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getPrebuiltWorkoutById, deletePrebuiltWorkout } from '@lotus/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { PrebuiltWorkout } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const PrebuiltWorkoutDetail = () => {
  const { id: workoutId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<PrebuiltWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) return;

      try {
        setLoading(true);
        const data = await getPrebuiltWorkoutById(db, workoutId);
        setWorkout(data);
      } catch (err) {
        console.error('Error loading prebuilt workout:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prebuilt workout');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVisibilityBadge = () => {
    if (!workout) return null;

    const variants = {
      TLM: 'default',
      private: 'secondary',
      shared: 'success',
    } as const;

    return <Badge variant={variants[workout.visibility]}>{workout.visibility}</Badge>;
  };

  const handleDelete = async () => {
    if (!workoutId || !workout) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this prebuilt workout? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deletePrebuiltWorkout(db, workoutId);
      navigate('/workouts/prebuilt');
    } catch (err) {
      console.error('Error deleting prebuilt workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete prebuilt workout');
    } finally {
      setDeleting(false);
    }
  };

  const canEdit = user && workout && workout.authorId === user.uid;
  const canDelete = user && workout && workout.authorId === user.uid;

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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/workouts/prebuilt" className="text-blue-600 hover:underline text-sm">
              Prebuilt Workouts
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">{workout.name || 'Untitled'}</span>
          </div>
          <h1 className="text-3xl font-bold">{workout.name || 'Untitled Workout'}</h1>
          <div className="flex items-center gap-2 mt-2">
            {getVisibilityBadge()}
            <Badge variant="secondary">
              {workout.workoutType === 'normal' ? 'Normal' : 'Mobility'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button onClick={() => navigate(`/workouts/prebuilt/${workoutId}/edit`)}>
              Edit Workout
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              onClick={handleDelete}
              isLoading={deleting}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatDuration(workout.duration)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{formatDate(workout.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Workout Type</p>
              <p className="text-gray-900 mt-1">
                {workout.workoutType === 'normal' ? 'Normal' : 'Mobility'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Visibility</p>
              <p className="text-gray-900 mt-1">{workout.visibility}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Generated By</p>
              <p className="text-gray-900 mt-1">
                {workout.generatedBy === 'trainer' ? 'Trainer' : 'Algorithm'}
              </p>
            </div>

            {workout.avgIntensity && (
              <div>
                <p className="text-sm font-medium text-gray-700">Average Intensity</p>
                <p className="text-gray-900 mt-1">{workout.avgIntensity.toFixed(1)}/10</p>
              </div>
            )}
          </div>

          {workout.internalNotes && (
            <div>
              <p className="text-sm font-medium text-gray-700">Internal Notes</p>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{workout.internalNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercises ({workout.exercises.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {workout.exercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No exercises in this workout</div>
          ) : (
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={`${exercise.docId}-${index}`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-700 font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{exercise.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {exercise.movementPattern}
                      </Badge>
                      <span className="text-sm text-gray-500">{exercise.duration}s</span>
                      <span className="text-sm text-gray-500">
                        Intensity: {exercise.intensity}/10
                      </span>
                    </div>
                    {exercise.description && (
                      <p className="text-sm text-gray-600 mt-2">{exercise.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
