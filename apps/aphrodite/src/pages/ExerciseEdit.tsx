import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getExerciseById } from '@lotus/api-client';
import type { Exercise } from '@lotus/shared-types';
import { ExerciseForm } from '../components/ExerciseForm';
import { Card, CardContent } from '../components/ui/Card';

export const ExerciseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) {
        setError(new Error('Exercise ID is required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getExerciseById(db, id);
        setExercise(data);
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading exercise...</div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-semibold">Error loading exercise</p>
            <p className="text-sm">{error?.message || 'Exercise not found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/exercises/${id}`} className="text-blue-600 hover:underline text-sm">
            ← Back to Exercise
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Edit Exercise</h1>
        <p className="text-gray-500 mt-1">{exercise.name}</p>
      </div>

      <ExerciseForm mode="edit" exercise={exercise} />
    </div>
  );
};
