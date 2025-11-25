import firebase from "firebase";
import { Exercise} from "./Exercise";
import {Client} from "./Client";

export enum WorkoutStatus {
  notStarted,
  inProgress,
  complete,
}

export enum WorkoutType {
  mobility,
  normal
}

export interface WorkoutProgress {
  status: WorkoutStatus;
  exerciseIndex: number;
  playbackTime: number;
  // how many times this workout was done in one session
  rounds?: number;
}

export interface Workout {
  // added to give a workout a name for the client like "Jenny's Easy Day"
  name?: string;
  exercises: Exercise[];
  createdAt: Date | firebase.firestore.Timestamp;
  createdBy: string;
  startedOn?: Date |  firebase.firestore.Timestamp;
  completedOn?: Date |  firebase.firestore.Timestamp;
  // todo: add notes to client and notes for tlm team member internal use
  clientNotes?: string;
  internalNotes?: string;
  feedback?: string;
  generatedBy: 'trainer' | 'algorithm';
  duration: number;
  favorite?: boolean;
  progress?: WorkoutProgress;
  set?: number;
  id?: string;
  workoutType: WorkoutType;
  internalDescription?: string;
  clientSnapshot?: Client;
  prioritizations?: string[];
  eliminations?: string[];
  avgIntensity?: number;
}

export interface PrebuiltWorkout extends Workout {
  authorId: string;
  visibility: WorkoutVisibility;
}

export type WorkoutVisibility = 'TLM' | 'private' | 'shared';
