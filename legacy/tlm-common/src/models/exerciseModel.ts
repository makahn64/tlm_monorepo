import {Exercise} from "../types";

export const BARE_EXERCISE_ENTRY: Exercise = {
  docId: '',
  description: '',
  movementPattern: '',
  intensity: 1,
  stress: [],
  releases: [],
  activates: [],
  equipment: [],
  optionalEquipment: [],
  title: '',
  name: '',
  cues: [],
  duration: 0,
  published: true,
  prenatalVideo: {},
  postnatalVideo: {},
  prenatalThumb: {},
  postnatalThumb: {},
  instructionVideo: {},
  instructionThumb: {},
  archived: false,
  metadata: null,
  preComposited: false
};

export const BREAK_EXERCISE = { ...BARE_EXERCISE_ENTRY, isBreak: true, name: 'break', duration: 30 };
export const BARE_CUSTOM_EXERCISE = { ...BARE_EXERCISE_ENTRY, isCustom: true, duration: 60 };

export const MOVEMENT_PATTERNS: string[] = [
  'warm-up/release',
  'warm-up/mobility',
  'warm-up/activate',
  'hinge',
  'squat',
  'lunge',
  'rotation',
  'push',
  'pull',
  'carry',
  'core'
];

export const STRESSES: string[] = [
  'unilateralLowerBody',
  'twistingRotation',
  'highPressure',
  'verticalPush',
  'horizontalPush',
  'cSectionTug',
  'lateral',
  'notPreNatal',
  'notFirst6PostNatal',
  'notPostNatal'
];

export const RELEASES: string[] = [
  'glutes',
  'pelvicFloor',
  'midBack',
  'adductor',
  'chest',
  'quads',
  'hips',
  'shoulder',
  'calves',
  'lats'
];

export const ACTIVATES: string[] = [
  'glutes',
  'gluteMed',
  'pelvicFloor',
  'adductor',
  'tva',
  'midBack',
  'breath',
  'pushBreath'
];

