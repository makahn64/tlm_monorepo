export interface Exercise {
  docId: string;
  title: string;
  // is this really used for anything?
  name: string;
  isBreak?: boolean;
  // custom exercise does not use a video, just description
  isCustom?: boolean;
  movementPattern: string;
  description: string;
  intensity: number;
  stress: string[];
  releases: string[];
  activates: string[];
  equipment: string[];
  optionalEquipment: string[];
  cues: string[];
  duration: number;
  published: boolean;
  // type these later
  prenatalVideo: any;
  postnatalVideo: any;
  prenatalThumb: any;
  postnatalThumb: any;
  instructionVideo: any;
  instructionThumb: any;
  archived: boolean;
  preComposited: boolean;
  metadata: any;
  // notes can be added by the trainer for things like reps, weights
  clientNotes?: string;
}

