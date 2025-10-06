import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthenticatedUser {
  userId: string;
}

interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger = new Logger('JwtAuthGuard');

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No access token provided');
    }

    const token = authHeader.split(' ')[1];
    this.logger.log('Access token', token);

    try {
      request.user =
        await this.jwtService.verifyAsync<AuthenticatedUser>(token);
      this.logger.log('Authenticated user', request.user);
      return true;
    } catch (err) {
      this.logger.error('JWT verification failed', err);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
