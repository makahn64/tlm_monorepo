export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  TRAINER: 'trainer',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  clients: string[]; // Client IDs for trainers
  createdAt: Date;
  updatedAt: Date;
}
