// Lead types

export const LeadState = {
  UNPROCESSED: 'unprocessed',
  ACCEPTED: 'accepted',
  DROPPED: 'dropped',
} as const;

export type LeadState = typeof LeadState[keyof typeof LeadState];

export interface ContactInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ProfileState {
  dueOrBirthDate?: Date;
  pregnancyState?: string;
  pelvicFloorConcerns?: string[];
  backPain?: string;
  roundLigamentPain?: string;
  pelvicPain?: string[];
  sciatica?: string;
  diastasisRecti?: string;
  mostInterestedIn?: string[];
  previousInjuries?: string;
  medicalConditions?: string;
  anythingElse?: string;
  birthType?: string;
  pregState?: string;
}

export interface Lead {
  id: string;
  contactInfo?: ContactInfo;
  createdOn?: Date;
  processedOn?: Date;
  disposition?: LeadState;
  profile?: ProfileState;
}
