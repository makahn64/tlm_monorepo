/*********************************
 File:       workoutSequencerReducer.ts
 Function:   State Machine for the Workout Player
 Copyright:  The Lotus Method
 Date:       11/14/20
 Author:     mkahn
 **********************************/
import {Workout, WorkoutProgress, getPlaylistForWorkout, WorkoutPlaylistEntry} from 'tlm-common';

export interface WorkoutState {
  playlist: WorkoutPlaylistEntry[];
  index: number;
  showingInstructions: boolean;
  error: boolean;
  workoutDone: boolean;
  abandoned: boolean;
}

export const INITIAL_WORKOUT_STATE: WorkoutState = {
  playlist: [],
  index: 0,
  showingInstructions: false,
  error: false,
  workoutDone: false,
  abandoned: false,
};

export type WorkoutActions =
  | { type: 'SET_WORKOUT'; workout: Workout; isPregnant: boolean }
  | { type: 'SET_VIDEO_IDX'; index: number }
  | { type: 'SHOW_INSTRUCTIONS'; isShowing: boolean }
  | { type: 'SET_VIDEO_ERROR'; isVideoError: boolean }
  | { type: 'NEXT_VIDEO' }
  | { type: 'PREV_VIDEO' }
  | { type: 'ABANDON' }
  | { type: 'RESUME' };

export const workoutSeqReducer = (
  state: WorkoutState,
  action: WorkoutActions,
): WorkoutState => {
  switch (action.type) {
    // set a completely new workout
    case 'SET_WORKOUT':
      const { workout, isPregnant } = action;
      const { progress } = workout;
      const { exerciseIndex } = progress as WorkoutProgress;
      return {
        playlist: getPlaylistForWorkout(workout, isPregnant),
        index: exerciseIndex,
        error: false,
        abandoned: false,
        showingInstructions: false,
        workoutDone: false
      };

    case 'SET_VIDEO_IDX': {
      return {
        ...state,
        index: action.index,
        error: false,
        workoutDone: action.index === state.playlist.length,
      };
    }

    case 'SHOW_INSTRUCTIONS':
      return { ...state, showingInstructions: action.isShowing };

    case 'SET_VIDEO_ERROR':
      return { ...state, error: action.isVideoError };

    case 'NEXT_VIDEO':
      const index = state.index + 1;
      const workoutDone = index === state.playlist.length;
      return { ...state, index, workoutDone };

    case 'PREV_VIDEO': {
      if (state.index===0) {
        return state;
      }
      const index = state.index - 1;
      const workoutDone = index === state.playlist.length;
      return { ...state, index, workoutDone };
    }

    case 'ABANDON':
      return { ...state, abandoned: true };

    case 'RESUME':
      return { ...state, abandoned: false };

    default:
      return state;
  }
};
