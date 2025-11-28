import type { Exercise } from './exercise';
import type { Client } from './client';

export const WorkoutType = {
  NORMAL: 'normal',
  MOBILITY: 'mobility',
} as const;

export type WorkoutType = typeof WorkoutType[keyof typeof WorkoutType];

export const WorkoutStatus = {
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  COMPLETE: 'complete',
} as const;

export type WorkoutStatus = typeof WorkoutStatus[keyof typeof WorkoutStatus];

export interface WorkoutProgress {
  status: WorkoutStatus;
  exerciseIndex: number;
  playbackTime: number;
  rounds?: number;
}

export interface Workout {
  id?: string;
  name?: string;
  workoutType: WorkoutType;
  exercises: Exercise[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  generatedBy: 'trainer' | 'algorithm';
  
  // Timing
  duration: number; // milliseconds
  startedOn?: Date;
  completedOn?: Date;
  
  // Notes
  clientNotes?: string;
  internalNotes?: string;
  feedback?: string;
  
  // Progress
  progress?: WorkoutProgress;
  favorite?: boolean;
  set?: number;
  
  // Algorithm Data
  clientSnapshot?: Client;
  prioritizations?: string[];
  eliminations?: string[];
  avgIntensity?: number;
}

export interface PrebuiltWorkout extends Workout {
  authorId: string;
  visibility: 'TLM' | 'private' | 'shared';
}
