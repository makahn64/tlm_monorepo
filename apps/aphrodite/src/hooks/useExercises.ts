import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { getAllExercises, filterExercises } from '@lotus/api-client';
import type { Exercise } from '@lotus/shared-types';

interface UseExercisesOptions {
  movementPattern?: string;
  equipment?: string;
  searchTerm?: string;
  archived?: boolean;
}

export const useExercises = (options: UseExercisesOptions = {}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);

        let result: Exercise[];

        // If we have filters, use filterExercises
        if (options.movementPattern || options.equipment || options.archived !== undefined) {
          result = await filterExercises(db, {
            movementPattern: options.movementPattern,
            equipment: options.equipment,
            archived: options.archived ?? false,
          });
        } else {
          // Otherwise get all exercises
          result = await getAllExercises(db);
        }

        // Apply client-side search if provided
        if (options.searchTerm) {
          const lowerSearchTerm = options.searchTerm.toLowerCase();
          result = result.filter(
            (exercise) =>
              exercise.name.toLowerCase().includes(lowerSearchTerm) ||
              exercise.title.toLowerCase().includes(lowerSearchTerm) ||
              exercise.description.toLowerCase().includes(lowerSearchTerm)
          );
        }

        setExercises(result);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [options.movementPattern, options.equipment, options.searchTerm, options.archived]);

  return { exercises, loading, error };
};
