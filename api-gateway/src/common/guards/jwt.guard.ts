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
import type { Response } from 'express';
import { AppConfigService } from '../../config/config.service';
import { IApiResponse } from '../interfaces/api-response.interface';
import { IUser } from '../../modules/auth/interfaces/user.interface';
import { RequestWithUserContext } from '../types/request-with-context.type';

/**
 * Guard to verify access token via Auth microservice.
 * Supports access token in Bearer header or cookie.
 * Falls back to refresh token if access token is invalid or missing.
 */
@Injectable()
export class JwtGatewayGuard implements CanActivate {
  /** Logger instance scoped to JwtGatewayGuard. */
  private readonly logger = new Logger(JwtGatewayGuard.name);

  /**
   * Constructs the guard with required dependencies.
   *
   * @param {HttpService} httpService - Used to send HTTP requests to downstream services.
   * @param {AppConfigService} configService - Service to access application configuration.
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Refresh token URL built from the auth service base URL.
   *
   * @readonly
   * @type {string}
   */
  private getRefreshUrl(): string {
    return `${this.configService.authServiceUrl}/auth/refresh`;
  }

  /**
   * Access token verification URL built from the auth service base URL.
   *
   * @readonly
   * @type {string}
   */
  private getVerifyAccessTokenUrl(): string {
    return `${this.configService.authServiceUrl}/auth/verify-access`;
  }

  /**
   * Guard execution logic
   * @param context Execution context
   * @returns boolean whether request is authorized
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUserContext>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = request.cookies as Record<string, string> | undefined;

    let accessToken = '';
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    } else if (cookies?.access_token) {
      accessToken = cookies.access_token;
    }

    if (!request.token) {
      request.token = {
        accessToken: accessToken || null,
        newAccessTokenIssued: false,
      };
    }

    const refreshToken = cookies?.realState_token;

    // 1. Try verifying access token first
    if (accessToken) {
      try {
        const verifyResponse: AxiosResponse<
          IApiResponse<Omit<IUser, 'password'>>
        > = await firstValueFrom(
          this.httpService.post<IApiResponse<Omit<IUser, 'password'>>>(
            this.getVerifyAccessTokenUrl(),
            {
              token: accessToken,
            },
          ),
        );
        request.token.accessToken = accessToken;
        request.token.newAccessTokenIssued = false;

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
        const refreshResponse: AxiosResponse<
          IApiResponse<{
            accessToken: string;
            refreshToken: string;
          }>
        > = await firstValueFrom(
          this.httpService.post<
            IApiResponse<{
              accessToken: string;
              refreshToken: string;
            }>
          >(
            this.getRefreshUrl(),
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
          const newAccessToken = refreshResponse.data.data.accessToken;
          const newRefreshToken = refreshResponse.data.data.refreshToken;

          // Update refresh token cookie if a new one was issued
          if (newRefreshToken) {
            this.logger.debug('Updating refresh token cookie with new token');
            response.cookie('realState_token', newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              path: '/',
            });
          }

          // Verify new access token
          const verifyNew: AxiosResponse<
            IApiResponse<Omit<IUser, 'password'>>
          > = await firstValueFrom(
            this.httpService.post<IApiResponse<Omit<IUser, 'password'>>>(
              this.getVerifyAccessTokenUrl(),
              {
                token: newAccessToken,
              },
            ),
          );

          if (verifyNew.data.success && verifyNew.data.data) {
            request.user = verifyNew.data.data;

            request.token.accessToken = newAccessToken;
            request.token.newAccessTokenIssued = true;

            // Update authorization header for current request
            request.headers.authorization = `Bearer ${newAccessToken}`;

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
