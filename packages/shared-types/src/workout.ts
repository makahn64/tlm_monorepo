export interface Exercise {
  id: string;
  name: string;
  duration: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
}
