import {Client, ClientType} from "..";
import {LabelFieldName} from "../types/commonTypes";

export const BARE_CLIENT_ENTRY: Client = {
  clientType: ClientType.active,
  firstName: '',
  lastName: '',
  email: '',
  mobilePhone: undefined,
  fitnessLevel: 'beginner',
  accountActive: true,
  workoutHistory: [],
  chatHistory: [],
  // injuries
  backPain: 'none',
  sciatica: 'none',
  injuries: [],
  postureConditions: [],
  // theme mode
  themeMode: 'light',
  uid: '',
  dueDate: '',
  isPregnant: true,
  dateOfBirth: '',
  markedForDeletion: false,
  equipment: ['bodyWeight'],
  schemaVersion: 1,
}

export const EQUIPMENT: LabelFieldName[] = [
  {label: 'Body Weight', fieldName: 'hasBodyWeight'},
  {label: 'Chair', fieldName: 'hasChair'},
  {label: 'Ball', fieldName: 'hasBall'},
  {label: 'Band', fieldName: 'hasBand'},
  {label: 'Foam Roller', fieldName: 'hasFoamRoller'},
  {label: 'Kettlebell', fieldName: 'hasKettlebell'},
  {label: 'Dumbbell or Kettlebell', fieldName: 'hasDumbbell'},
  {label: 'Looped Band', fieldName: 'hasLoopedBand'},
  {label: 'Mat', fieldName: 'hasMat'},
  {label: 'Step', fieldName: 'hasStep'},
  {label: 'Wall', fieldName: 'hasWall'}
]

export const BINARY_INJURIES: LabelFieldName[] = [
  {label: 'Groin pain', fieldName: 'isPainGroin'},
  {label: 'Carpal tunnel', fieldName: 'isCarpalTunnel'},
  {label: 'Diastisis Recti', fieldName: 'isDr'},
  {label: 'Hypertonic', fieldName: 'isHypertonic'},
  {label: 'Leakage', fieldName: 'isLeakage'},
  {label: 'Ankle injury', fieldName: 'isInjuredAnkle'},
  {label: 'Hip injury', fieldName: 'isInjuredHip'},
  {label: 'Knee injury', fieldName: 'isInjuredKnee'},
  {label: 'Neck injury', fieldName: 'isInjuredNeck'},
  {label: 'Shoulder injury', fieldName: 'isInjuredShoulder'},
  {label: 'Pubic pain', fieldName: 'isPainPubic'},
  {label: 'Sacrum pain', fieldName: 'isPainSacrum'},
  {label: 'Prolapse', fieldName: 'isProlapse'},
  {label: 'Has had C-Section', fieldName: 'isCSection'},
  {label: 'Round ligament issues', fieldName: 'isRoundLigament'}
]

export const postures = ['neutral', 'kyphotic', 'flare', 'tucker', 'lordosis', 'valgus', 'gripper'];

export const NON_BINARY_PROFILE_SETTINGS = {
  backPain: ['none', 'low', 'high'],
  fitnessLevel: ['beginner', 'intermediate', 'advanced'],
  posture: postures,
}

// export function mapBinaryInjuriesToStringArray(client: Client): string[] {
//   const rval: string[] = BINARY_INJURIES.reduce<string[]>( ( accum, i) => {
//     const field = i.fieldName;
//     if (client[field]) {
//       accum.push(i.label);
//     }
//     return accum
//   }, [])
//   return rval;
// }
//
// // fixme dry this out
// export function mapEquipmentToStringArray(client: Client): string[] {
//   const rval: string[] = EQUIPMENT.reduce<string[]>( ( accum, i) => {
//     const field: string = i.fieldName;
//     if (client[field]) {
//       accum.push(i.label);
//     }
//     return accum
//   }, [])
//   return rval;
// }
