import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getClientById } from '@lotus/api-client';
import type { Workout, Client } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';

export const ClientWorkoutDetail = () => {
  const { id: clientId, workoutId } = useParams<{ id: string; workoutId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!clientId || !workoutId) return;

      try {
        setLoading(true);
        
        // Load client
        const clientData = await getClientById(db, clientId);
        setClient(clientData);

        // Load workout from client's subcollection
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
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, workoutId]);

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

  const getStatusBadge = () => {
    if (!workout) return null;
    
    if (workout.completedOn) {
      return <Badge variant="success">Complete</Badge>;
    }
    if (workout.startedOn) {
      return <Badge variant="warning">In Progress</Badge>;
    }
    return <Badge variant="default">Not Started</Badge>;
  };

  if (loading) {
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
            <Link
              to={`/clients/${clientId}/workouts`}
              className="text-blue-600 hover:underline text-sm"
            >
              Workouts
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">{workout.name || 'Untitled'}</span>
          </div>
          <h1 className="text-3xl font-bold">{workout.name || 'Untitled Workout'}</h1>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge()}
            <Badge variant="secondary">
              {workout.workoutType === 'normal' ? 'Normal' : 'Mobility'}
            </Badge>
          </div>
        </div>
        <Button onClick={() => navigate(`/clients/${clientId}/workouts/${workoutId}/edit`)}>
          Edit Workout
        </Button>
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
              <p className="text-sm font-medium text-gray-700">Generated By</p>
              <p className="text-gray-900 mt-1">
                {workout.generatedBy === 'trainer' ? 'Trainer' : 'Algorithm'}
              </p>
            </div>

            {workout.startedOn && (
              <div>
                <p className="text-sm font-medium text-gray-700">Started On</p>
                <p className="text-gray-900 mt-1">{formatDate(workout.startedOn)}</p>
              </div>
            )}

            {workout.completedOn && (
              <div>
                <p className="text-sm font-medium text-gray-700">Completed On</p>
                <p className="text-gray-900 mt-1">{formatDate(workout.completedOn)}</p>
              </div>
            )}
          </div>

          {workout.internalNotes && (
            <div>
              <p className="text-sm font-medium text-gray-700">Internal Notes</p>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{workout.internalNotes}</p>
            </div>
          )}

          {workout.clientNotes && (
            <div>
              <p className="text-sm font-medium text-gray-700">Client Notes</p>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{workout.clientNotes}</p>
            </div>
          )}

          {workout.feedback && (
            <div>
              <p className="text-sm font-medium text-gray-700">Client Feedback</p>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{workout.feedback}</p>
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
