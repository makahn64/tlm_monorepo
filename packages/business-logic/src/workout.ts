import type { Workout, Exercise } from '@lotus/shared-types';

export const calculateWorkoutDuration = (exercises: Exercise[]): number => {
  return exercises.reduce((total, exercise) => total + exercise.duration, 0);
};
