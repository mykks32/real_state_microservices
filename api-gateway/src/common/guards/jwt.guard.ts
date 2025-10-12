// jwt-gateway.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import type { Request } from 'express';

/**
 * Interface representing a user object returned by Auth service
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  IsAdmin: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}

/**
 * Extend Express Request to optionally include user
 */
export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
  newAccessToken?: string; // optional, if refreshed
}

/**
 * Response type expected from Auth Service /verify-access endpoint
 */
interface AuthServiceVerifyResponse {
  success: boolean;
  message: string;
  data: AuthenticatedUser;
}

/**
 * Response type expected from Auth Service /refresh endpoint
 */
interface AuthServiceRefreshResponse {
  success: boolean;
  message: string;
  data: { accessToken: string };
}

/**
 * Guard to verify access token via Auth microservice.
 * Supports access token in Bearer header or cookie.
 * Falls back to refresh token if access token is invalid or missing.
 */
@Injectable()
export class JwtGatewayGuard implements CanActivate {
  private readonly logger = new Logger(JwtGatewayGuard.name);
  private readonly VERIFY_URL = 'http://localhost:3000/auth/verify-access';
  private readonly REFRESH_URL = 'http://localhost:3000/auth/refresh';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Guard execution logic
   * @param context Execution context
   * @returns boolean whether request is authorized
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const cookies = request.cookies as Record<string, string> | undefined;

    let accessToken = '';
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    } else if (cookies?.access_token) {
      accessToken = cookies.access_token;
    }

    const refreshToken = cookies?.realState_token;

    this.logger.debug('refreshToken', refreshToken);
    this.logger.debug('AllCookies', request.cookies);

    // 1. Try verifying access token first
    if (accessToken) {
      try {
        const verifyResponse: AxiosResponse<AuthServiceVerifyResponse> =
          await firstValueFrom(
            this.httpService.post<AuthServiceVerifyResponse>(this.VERIFY_URL, {
              token: accessToken,
            }),
          );

        if (verifyResponse.data.success && verifyResponse.data.data) {
          request.user = verifyResponse.data.data;
          this.logger.log(
            `Access token verified for user: ${request.user.username}`,
          );
          return true;
        }
      } catch (err) {
        this.logger.warn(
          'Access token invalid or expired, attempting refresh if available',
          err,
        );
      }
    }

    // 2. Fallback to refresh token
    if (refreshToken) {
      try {
        const refreshResponse: AxiosResponse<AuthServiceRefreshResponse> =
          await firstValueFrom(
            this.httpService.post<AuthServiceRefreshResponse>(
              this.REFRESH_URL,
              {},
              {
                headers: {
                  Cookie: `realState_token=${refreshToken}`,
                },
                withCredentials: true,
              },
            ),
          );

        if (
          refreshResponse.data.success &&
          refreshResponse.data.data?.accessToken
        ) {
          request.newAccessToken = refreshResponse.data.data.accessToken;

          // Verify new access token
          const verifyNew: AxiosResponse<AuthServiceVerifyResponse> =
            await firstValueFrom(
              this.httpService.post<AuthServiceVerifyResponse>(
                this.VERIFY_URL,
                {
                  token: request.newAccessToken,
                },
              ),
            );

          if (verifyNew.data.success && verifyNew.data.data) {
            request.user = verifyNew.data.data;
            this.logger.log(
              `Access token refreshed and verified for user: ${request.user.username}`,
            );
            return true;
          }
        }
      } catch (err) {
        this.logger.error('Refresh token failed', err);
      }
    }

    this.logger.warn('No valid access or refresh token provided');
    throw new UnauthorizedException('Invalid or expired access/refresh token');
  }
}
