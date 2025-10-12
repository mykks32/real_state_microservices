/** Represents a user entity. */
export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  IsAdmin: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}
