import { Workout } from './Workout';
import { GCSFile } from './GCSFile';
import {Exercise} from "./Exercise";
import { compact } from 'lodash';

export enum WorkoutPlaylistEntryType {
  HAS_INSTRUCTIONS,
  NO_INSTRUCTIONS,
  BREAK,
  CUSTOM
}

export interface WorkoutPlaylistEntry {
  type: WorkoutPlaylistEntryType;
  name: string;
  videoSourceName?: string;
  videoThumbName?: string;
  instructionSourceName?: string;
  instructionThumbName?: string;
  preComposited?: boolean;
  index: number;
  description?: string;
}

export const getPlaylistForWorkout = (
  workout: Workout,
  isPregnant: boolean,
) => {
  const { exercises } = workout;
  let actualIndex = 0;
  const playlistWithNulls = exercises.map((exercise) => {
    if (exercise.name === 'break') {
      return {
        type: WorkoutPlaylistEntryType.BREAK,
        name: 'break',
        index: -1,
        videoSourceName: 'take-a-break.mp4',
        videoThumbName: 'take-a-break.png',
        preComposited: true,
      };
    } else {
      // not a break
      actualIndex++;
      let eVideo, eThumb;

      if (exercise.isCustom) {
        return {
          type: WorkoutPlaylistEntryType.CUSTOM,
          name: exercise.name,
          description: exercise.description,
          index: actualIndex
        }
      }

      if (isPregnant) {
        // check if there's a prenatal vid. Unfortunately, because of firebase, a lack of video is an empty object {}
        if (exercise.prenatalVideo.name){
          eVideo = exercise.prenatalVideo;
        } else if (exercise.postnatalVideo.name) {
          eVideo = exercise.postnatalVideo;
        } else {
          console.warn(`Exercise ${exercise.name} has no videos at all, skipping`);
          return null;
        }
      } else {
        if (exercise.postnatalVideo.name){
          eVideo = exercise.postnatalVideo;
        } else if (exercise.prenatalVideo.name) {
          eVideo = exercise.prenatalVideo;
        } else {
          console.warn(`Exercise ${exercise.name} has no videos at all, skipping`);
          return null;
        }
      }

      if (isPregnant) {
        // check if there's a prenatal vid. Unfortunately, because of firebase, a lack of video is an empty object {}
        if (exercise.prenatalThumb.name){
          eThumb = exercise.prenatalThumb;
        } else if (exercise.postnatalThumb.name) {
          eThumb = exercise.postnatalThumb;
        } else {
          console.warn(`Exercise ${exercise.name} has no thumbs at all, skipping`);
          return null;
        }
      } else {
        if (exercise.postnatalThumb.name){
          eThumb = exercise.postnatalThumb;
        } else if (exercise.prenatalThumb.name) {
          eThumb = exercise.prenatalThumb;
        } else {
          console.warn(`Exercise ${exercise.name} has no thumbs at all, skipping`);
          return null;
        }
      }

      const entry: Partial<WorkoutPlaylistEntry> = {
        index: actualIndex,
        name: exercise.name,
        videoSourceName: (eVideo! as GCSFile).name!,
        videoThumbName: (eThumb! as GCSFile).name!,
        preComposited: (exercise as Exercise).preComposited,
      };

      if (
        (exercise as Exercise).instructionVideo &&
        ((exercise as Exercise).instructionVideo as GCSFile).name
      ) {
        // exercise has instructions
        const { name: instVidName } = (exercise as Exercise).instructionVideo as GCSFile;
        const { name: instThumbName } = (exercise as Exercise).instructionThumb as GCSFile;
        const instructionSourceName = instVidName;
        const instructionThumbName = instThumbName ? instThumbName : undefined;
        return {
          ...entry,
          type: WorkoutPlaylistEntryType.HAS_INSTRUCTIONS,
          instructionSourceName,
          instructionThumbName,
        } as WorkoutPlaylistEntry;
      } else {
        return entry as WorkoutPlaylistEntry;
      }
    }
  });

  // remove nulls
  return compact(playlistWithNulls);
};
