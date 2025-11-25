import {InjuryOrCondition} from "./physicalConditions";
import {ValueDescription} from "./commonTypes";

export type Equipment =
  | 'bodyWeight'
  | 'chair'
  | 'door'
  | 'pillow'
  | 'wall'
  | 'dumbbell'
  | 'kettlebell'
  | 'kettlebellOrDumbbell'
  | 'band'
  | 'loopedBand'
  | 'mat'
  | 'step'
  | 'foamRoller'
  | 'ball'

export const EQUIPMENT_DESCRIPTION_MAP: ValueDescription[] = [
  {value: 'bodyWeight', description: 'Body Weight'},
  {value: 'chair', description: 'Chair'},
  {value: 'door', description: 'Door'},
  {value: 'pillow', description: 'Pillow'},
  {value: 'wall', description: 'Wall'},
  {value: 'dumbbell', description: 'Dumbbell'},
  {value: 'kettlebell', description: 'Kettlebell'},
  {value: 'kettlebellOrDumbbell', description: 'Kettlebell or Dumbbell'},
  {value: 'band', description: 'Band'},
  {value: 'loopedBand', description: 'Looped Band'},
  {value: 'mat', description: 'Mat'},
  {value: 'step', description: 'Step'},
  {value: 'foamRoller', description: 'Foam Roller'},
  {value: 'ball', description: 'Tennis Ball (or Similar)'},
];

export const ALL_EQUIPMENT = EQUIPMENT_DESCRIPTION_MAP.reduce((accum: {[k:string]: string}, e) => {
  accum[e.value] = e.description;
  return accum;
}, {});

export const ALL_EQUIPMENT_VALUES = Object.keys(ALL_EQUIPMENT);
