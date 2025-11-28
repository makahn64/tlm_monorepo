import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getAccessiblePrebuiltWorkouts } from '@lotus/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { PrebuiltWorkout } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';

export const PrebuiltWorkoutList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<PrebuiltWorkout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<PrebuiltWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'TLM' | 'private' | 'shared'>('all');

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getAccessiblePrebuiltWorkouts(db, user.uid);
        setWorkouts(data);
        setFilteredWorkouts(data);
      } catch (err) {
        console.error('Error loading prebuilt workouts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prebuilt workouts');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [user]);

  useEffect(() => {
    if (visibilityFilter === 'all') {
      setFilteredWorkouts(workouts);
    } else {
      setFilteredWorkouts(workouts.filter((w) => w.visibility === visibilityFilter));
    }
  }, [visibilityFilter, workouts]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
              <div className="text-gray-500">Loading prebuilt workouts...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prebuilt Workouts</h1>
          <p className="text-gray-500 mt-1">Reusable workout templates</p>
        </div>
        <Button onClick={() => navigate('/workouts/prebuilt/new')}>
          Create Prebuilt Workout
        </Button>
      </div>

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
              Showing {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {visibilityFilter === 'all'
                  ? 'No prebuilt workouts found'
                  : `No ${visibilityFilter} workouts found`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Get started by creating your first prebuilt workout template
              </p>
              <Button className="mt-4" onClick={() => navigate('/workouts/prebuilt/new')}>
                Create First Prebuilt Workout
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/workouts/prebuilt/${workout.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {workout.name || 'Untitled Workout'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {workout.workoutType === 'normal' ? 'Normal' : 'Mobility'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getVisibilityBadge(workout.visibility)}</TableCell>
                    <TableCell className="text-gray-600">
                      {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDuration(workout.duration)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(workout.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/workouts/prebuilt/${workout.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
