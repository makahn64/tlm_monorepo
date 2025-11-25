import firebase from "firebase";
import { Exercise} from "./Exercise";
import {Client} from "./Client";
import {GCSFile} from "./GCSFile";

export enum JourneyStatus {
  notStarted,
  inProgress,
  complete,
}

export interface JourneyProgress {
  status: JourneyStatus;
  stepIndex: number;
  playbackTime: number;
}

export type JourneyWorkoutVideo = {
  title: string;
  description: string;
  internalDescription?: string;
  duration: number;
  file: GCSFile;
}

export interface Journey {
  name?: string;
  description?: string;
  internalDescription?: string;
  videos: JourneyWorkoutVideo[];
  createdAt: Date | firebase.firestore.Timestamp;
  createdBy: string;
  startedOn?: Date |  firebase.firestore.Timestamp;
  completedOn?: Date |  firebase.firestore.Timestamp;
  // todo: add notes to client and notes for tlm team member internal use
  clientNotes?: string;
  internalNotes?: string;
  favorite?: boolean;
  progress?: JourneyProgress;
  id?: string;
  criteria: string[];
}
