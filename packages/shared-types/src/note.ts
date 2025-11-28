export interface TrainerNote {
  id: string;
  clientId: string;
  trainerId: string;
  trainerName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  id: string;
  clientId: string;
  trainerId: string;
  trainerName: string;
  title: string;
  description: string;
  createdAt: Date;
}
