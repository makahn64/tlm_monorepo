import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getAccessiblePrebuiltWorkouts, copyPrebuiltWorkoutToClient, getClientById } from '@lotus/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { PrebuiltWorkout, Client } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ClientWorkoutFromTemplate = () => {
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [workouts, setWorkouts] = useState<PrebuiltWorkout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<PrebuiltWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'TLM' | 'private' | 'shared'>('all');

  useEffect(() => {
    const loadData = async () => {
      if (!clientId || !user) return;

      try {
        setLoading(true);
        const [clientData, workoutsData] = await Promise.all([
          getClientById(db, clientId),
          getAccessiblePrebuiltWorkouts(db, user.uid),
        ]);
        setClient(clientData);
        setWorkouts(workoutsData);
        setFilteredWorkouts(workoutsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, user]);

  useEffect(() => {
    if (visibilityFilter === 'all') {
      setFilteredWorkouts(workouts);
    } else {
      setFilteredWorkouts(workouts.filter((w) => w.visibility === visibilityFilter));
    }
  }, [visibilityFilter, workouts]);

  const handleAssign = async (workoutId: string) => {
    if (!clientId || !user) return;

    try {
      setAssigning(workoutId);
      setError(null);

      const newWorkoutId = await copyPrebuiltWorkoutToClient(db, workoutId, clientId, user.uid);
      navigate(`/clients/${clientId}/workouts/${newWorkoutId}`);
    } catch (err) {
      console.error('Error assigning workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign workout');
    } finally {
      setAssigning(null);
    }
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVisibilityBadge = (visibility: 'TLM' | 'private' | 'shared') => {
    const variants = {
      TLM: 'default',
      private: 'secondary',
      shared: 'success',
    } as const;

    return <Badge variant={variants[visibility]}>{visibility}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading templates...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <span className="text-sm text-gray-600">From Template</span>
        </div>
        <h1 className="text-3xl font-bold">Assign Workout from Template</h1>
        <p className="text-gray-500 mt-1">
          Choose a prebuilt workout template to assign to {client?.firstName} {client?.lastName}
        </p>
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
        <CardContent className="pt-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="visibility-filter" className="text-sm font-medium text-gray-700">
                Filter by visibility:
              </label>
              <select
                id="visibility-filter"
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as typeof visibilityFilter)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="TLM">TLM</option>
                <option value="shared">Shared</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredWorkouts.length} template{filteredWorkouts.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {visibilityFilter === 'all'
                  ? 'No prebuilt workout templates found'
                  : `No ${visibilityFilter} templates found`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Create a prebuilt workout template first, or create a custom workout
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button onClick={() => navigate('/workouts/prebuilt/new')}>
                  Create Template
                </Button>
                <Button variant="outline" onClick={() => navigate(`/clients/${clientId}/workouts/new`)}>
                  Create Custom Workout
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkouts.map((workout) => (
                <Card key={workout.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {workout.name || 'Untitled Workout'}
                      </CardTitle>
                      {getVisibilityBadge(workout.visibility)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <Badge variant="secondary">
                        {workout.workoutType === 'normal' ? 'Normal' : 'Mobility'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Exercises:</span>
                      <span className="font-medium">{workout.exercises.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{formatDuration(workout.duration)}</span>
                    </div>
                    {workout.avgIntensity && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Intensity:</span>
                        <span className="font-medium">{workout.avgIntensity.toFixed(1)}/10</span>
                      </div>
                    )}
                    <div className="pt-2 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAssign(workout.id!)}
                        isLoading={assigning === workout.id}
                        disabled={assigning !== null}
                      >
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/workouts/prebuilt/${workout.id}`)}
                      >
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate(`/clients/${clientId}/workouts`)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
