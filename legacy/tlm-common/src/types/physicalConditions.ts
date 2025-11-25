export type InjuryOrCondition =
  'neck'
  | 'shoulder'
  | 'hip'
  | 'knee'
  | 'ankle'
  | 'prolapse'
  | 'pubicPain'
  | 'dr'
  | 'carpalTunnel'
  | 'groinPain'
  | 'sacrumPain'
  | 'hypertonic'
  | 'leakage'
  | 'csection'
  | 'roundLigament';

export const ALL_INJURIES: Record<string, string> = {
  'neck': 'Neck',
  'shoulder': 'Shoulder',
  'hip' : 'Hip',
  'knee': 'Knee',
  'ankle': 'Ankle',
  'prolapse': 'Prolapse',
  'pubicPain': 'Pubic Pain',
  'dr': 'Diastisis Recti',
  'carpalTunnel': 'Carpal Tunnel',
  'groinPain': 'Groin Pain',
  'sacrumPain': 'Sacrum Pain',
  'hypertonic': 'Hypertonic',
  'leakage': 'Leakage',
  'csection': 'C-Section',
  'roundLigament': 'Round Ligament Pain'
};

export const INJURY_DESCRIPTION_MAP = Object.keys(ALL_INJURIES).map(k=>({value: k, description: ALL_INJURIES[k]}));

export const ALL_INJURIES_VALUES = Object.keys(ALL_INJURIES) as InjuryOrCondition[];

export type BackPain = 'upper' | 'low' | 'none';
export type SciaticaPain = 'upper' | 'calf' | 'none';

export type Posture = 'neutral' | 'kyphotic' | 'flare' | 'tucker' | 'lordosis' | 'valgus' | 'gripper';

export const ALL_POSTURES: { [key: string]: string} = {
  'neutral': 'Neutral',
  'kyphotic': 'Kyphotic',
  'flare' : 'Flare',
  'tucker': 'Tucker',
  'lordosis': 'Lordosis',
  'valgus': 'Valgus',
  'gripper': 'Gripper',
};

export const ALL_POSTURES_VALUES = Object.keys(ALL_POSTURES);
export const ALL_POSTURES_MAP = Object.keys(ALL_POSTURES).map(k=>({value: k, description: ALL_POSTURES[k]}));
