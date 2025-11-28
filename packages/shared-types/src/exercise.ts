export interface MediaReference {
  url?: string;
  path?: string;
  bucket?: string;
}

export interface Exercise {
  docId: string;
  title: string;
  name: string;
  description: string;
  
  // Classification
  movementPattern: string;
  intensity: number; // 1-10
  
  // Tags
  stress: string[];
  releases: string[];
  activates: string[];
  equipment: string[];
  optionalEquipment: string[];
  
  // Instructions
  cues: string[];
  duration: number; // seconds
  
  // Video References
  prenatalVideo: MediaReference;
  postnatalVideo: MediaReference;
  instructionVideo: MediaReference;
  prenatalThumb: MediaReference;
  postnatalThumb: MediaReference;
  instructionThumb: MediaReference;
  
  // Flags
  isBreak?: boolean;
  isCustom?: boolean;
  published: boolean;
  archived: boolean;
  preComposited: boolean;
  
  // Metadata
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}
