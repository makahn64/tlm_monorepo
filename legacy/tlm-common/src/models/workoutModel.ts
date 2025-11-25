import {Workout, WorkoutStatus, WorkoutType, Client} from "..";

export const BARE_WORKOUT: Workout = {
  workoutType: WorkoutType.normal,
  exercises: [],
  createdAt: new Date(),
  createdBy: 'TLM',
  generatedBy: 'trainer',
  duration: 20 * 60 * 1000,
  favorite: false,
  internalNotes: '',
  clientNotes: '',
  progress: {
    status: WorkoutStatus.notStarted,
    exerciseIndex: 0,
    playbackTime: 0
  }
}
