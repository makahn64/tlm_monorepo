import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getWorkoutsForClient, getClientById } from '@lotus/api-client';
import type { Workout, Client } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';

export const ClientWorkouts = () => {
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        const [clientData, workoutsData] = await Promise.all([
          getClientById(db, clientId),
          getWorkoutsForClient(db, clientId),
        ]);
        setClient(clientData);
        setWorkouts(workoutsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  const getStatusBadge = (workout: Workout) => {
    if (workout.completedOn) {
      return <Badge variant="success">Complete</Badge>;
    }
    if (workout.startedOn) {
      return <Badge variant="warning">In Progress</Badge>;
    }
    return <Badge variant="default">Not Started</Badge>;
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading workouts...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error || 'Client not found'}</p>
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
            <Link to="/clients" className="text-blue-600 hover:underline text-sm">
              Clients
            </Link>
            <span className="text-gray-400">/</span>
            <Link to={`/clients/${clientId}`} className="text-blue-600 hover:underline text-sm">
              {client.firstName} {client.lastName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">Workouts</span>
          </div>
          <h1 className="text-3xl font-bold">
            Workouts for {client.firstName} {client.lastName}
          </h1>
          <p className="text-gray-500 mt-1">Manage and track client workouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/clients/${clientId}/workouts/from-template`)}
          >
            From Template
          </Button>
          <Button onClick={() => navigate(`/clients/${clientId}/workouts/new`)}>
            Create Custom
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {workouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No workouts found</p>
              <p className="text-sm text-gray-400 mt-1">
                Get started by creating a workout for this client
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button onClick={() => navigate(`/clients/${clientId}/workouts/from-template`)}>
                  From Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/clients/${clientId}/workouts/new`)}
                >
                  Create Custom
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500">
                Showing {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Exercises</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/clients/${clientId}/workouts/${workout.id}`}
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
                      <TableCell className="text-gray-600">
                        {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDuration(workout.duration)}
                      </TableCell>
                      <TableCell>{getStatusBadge(workout)}</TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(workout.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/clients/${clientId}/workouts/${workout.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
