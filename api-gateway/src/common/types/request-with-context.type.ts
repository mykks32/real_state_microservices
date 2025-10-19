import type { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface UserPayload {
  id: string;
  email?: string;
  username?: string;
  roles?: Role[];
  [key: string]: unknown;
}

/**
 * Request object extended with authenticated user information
 * (used by your JwtGatewayGuard or similar).
 */
export interface RequestWithUser extends Request {
  user: UserPayload;
}

/**
 * Request object extended with request-scoped metadata such as requestId.
 */
export interface RequestWithContext extends Request {
  requestId: string;
  user?: UserPayload;
  token?: {
    accessToken: string | null;
    newAccessTokenIssued: boolean;
  };
}

/**
 * Combined convenience type often used in controllers when guard adds both.
 */
export type RequestWithUserContext = RequestWithUser & RequestWithContext;
