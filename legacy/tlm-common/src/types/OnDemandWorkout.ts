import {GCSFile} from "./GCSFile";
import {Equipment} from "./Equipment";

export interface OnDemandWorkout {
  docId: string;
  title: string;
  description: string;
  fitnessLevel: string;
  duration: number;
  media: GCSFile | undefined;
  thumb: GCSFile | undefined;
  metadata: any;
  published: boolean;
  equipment: Equipment[];
  tags: string[];
}

