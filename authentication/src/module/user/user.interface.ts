import { Role } from '../../database/enums/roles.enum';

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  roles: Role[];
  createdAt: Date;
  lastLoginAt: Date | null;
}
