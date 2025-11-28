export const ClientType = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  PAST_DUE: 'pastDue',
  LEAD: 'lead',
  ARCHIVED: 'archived',
  FREE: 'free',
  APP_SUB_0: 'appSub0',
  APP_SUB_1: 'appSub1',
  APP_SUB_2: 'appSub2',
  APP_SUB_3: 'appSub3',
} as const;

export type ClientType = typeof ClientType[keyof typeof ClientType];

export interface Client {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  clientType: ClientType;
  trainerIds: string[]; // Array to support multiple trainers
  
  // Health & Fitness
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  dateOfBirth?: string;
  dueDate?: string;
  isPregnant: boolean;
  tryingToConceive?: boolean;
  
  // Physical Conditions
  backPain: 'none' | 'low' | 'high';
  sciatica: 'none' | 'low' | 'high';
  injuries: string[];
  postureConditions: string[];
  
  // Equipment
  equipment: string[];
  
  // App State
  themeMode: 'light' | 'dark' | 'auto';
  accountActive: boolean;
  hasAcceptedLiabilityWaiver?: boolean;
  hasCompletedOnboarding?: boolean;
  
  // Metadata
  markedForDeletion: boolean;
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
