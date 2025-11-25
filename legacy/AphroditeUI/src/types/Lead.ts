import { firestore } from 'firebase';

export enum LeadState {
  unprocessed,
  accepted,
  dropped
}

export interface Lead {
  contactInfo?: {
    email: string;
    firstName: string;
    lastName: string;
  },
  createdOn?: string | Date;
  processedOn?: firestore.Timestamp;
  disposition?: LeadState;
  // todo union type this
  profile?: ProfileState;
  id: string;
}

export interface ProfileState {
  dueOrBirthDate: Date;
  pregnancyState?: string;
  pelvicFloorConcerns: string[];
  backPain?: string;
  roundLigamentPain?: string;
  pelvicPain: string[];
  sciatica?: string;
  diastasisRecti?: string;
  mostInterestedIn: string[];
  // for trying clients
  previousInjuries?: string;
  medicalConditions?: string;
  anythingElse?: string;
  birthType?: string;
  pregState?: string;
}
