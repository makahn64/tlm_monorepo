import {Workout} from "./Workout";
import firebase from "firebase";
import {GCSFile} from "./GCSFile";
import {NameAndEmail} from "./NameAndEmail";
import {ValueDescription} from "./ValueDescription";
import {BackPain, InjuryOrCondition, Posture, SciaticaPain} from "./physicalConditions";
import {Equipment} from "./Equipment";

export enum ClientType {
  active,
  paused,
  pastDue,
  lead,
  archived,
  // not used  yet, but probably will be
  free,
  appSub0, // free user
  appSub1,
  appSub2,
  appSub3
}

export const ClientTypeDescriptions = {
  // this is really only used in filter buttons/selectors
  [-1]: 'all',
  [ClientType.active as number]: 'active',
  [ClientType.pastDue as number]: 'past due',
  [ClientType.lead as number]: 'lead',
  [ClientType.paused]: 'paused',
  [ClientType.archived]: 'archived',
  [ClientType.free]: 'free',
  [ClientType.appSub0]: 'app sub level 0',
  [ClientType.appSub1]: 'app sub level 1',
  [ClientType.appSub2]: 'app sub level 2',
}

export const ClientTypeOptions: ValueDescription[] = [
  {value: ClientType.active, description: 'Active'},
  {value: ClientType.paused, description: 'Paused'},
  //{ value: ClientType.pastDue, description: 'Past Due'},
  {value: ClientType.lead, description: 'Lead'},
  {value: ClientType.free, description: 'App subscriber, free level'},
  {value: ClientType.appSub0, description: 'App subscriber, level 0'},
  {value: ClientType.appSub1, description: 'App subscriber, level 1'},
  {value: ClientType.appSub2, description: 'App subscriber, level 2'},
]

export interface ClientInjuries {
  // will be kept
  backPain: BackPain;
  sciatica: SciaticaPain;
  // switching to an array for multiple postures
  postureConditions: Posture[];
  // injuries switching to array
  injuries: InjuryOrCondition[];
}

export interface ClientEquipment {
  equipment: Equipment[];
}

interface AppState {
  themeMode: string;
  lastAlertDisplayedAt?: firebase.firestore.Timestamp,
}

export interface Client extends ClientEquipment, ClientInjuries, AppState, NameAndEmail {
  uid: string;
  // fitness
  fitnessLevel: string;
  accountActive: boolean;
  workoutHistory?: any[];
  // will this be needed with Sendbird
  chatHistory?: any[];
  dateOfBirth?: string;
  weight?: number;
  dueDate?: string;
  isPregnant: boolean;
  markedForDeletion: boolean;
  workouts?: Workout[];
  recommendedVideos?: GCSFile[];
  clientType: ClientType;
  hasAcceptedLiabilityWaiver?: boolean;
  hasCompletedOnboarding?: boolean;
  metaData?: Record<string, any>;
  tryingToConceive?: boolean;
  // version 1 means modern using arrays for injuries and equipment
  schemaVersion?: number;
}
