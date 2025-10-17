import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtGatewayGuard } from './common/guards/jwt.guard';
import {
  RequestWithUserContext,
  UserPayload,
} from './common/types/request-with-context.type';
import { Role } from './common/enums/role.enum';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

/**
 * AppController
 *
 * Handles API endpoints for Property Service.
 *
 * Public:
 * - GET  /        → HTML welcome page
 * - GET  /health  → Health check
 *
 * Secured (ADMIN only):
 * - GET  /hello   → Returns authenticated user info
 */
@Controller()
@ApiTags('Public')
export class AppController {
  /**
   * GET /hello
   *
   * Returns authenticated ADMIN user info.
   *
   * @param {RequestWithUserContext} req - Request with user context
   * @returns {UserPayload | null} - User data or null
   */
  @Get('hello')
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('realState_token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user context' })
  @ApiOkResponse({ description: 'Authenticated user info', type: Object })
  getHello(@Req() req: RequestWithUserContext): UserPayload | null {
    return req.user ?? null;
  }

  /**
   * GET /
   *
   * Simple HTML welcome page.
   *
   * @param {Response} res - Express response
   */
  @Get('/')
  @ApiOperation({ summary: 'Welcome page' })
  @ApiOkResponse({ description: 'HTML welcome page' })
  root(@Res() res: Response): void {
    res.type('html').send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>RealState API</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #f5f6fa; color: #2f3640; text-align: center; padding: 60px; }
            h1 { color: #40739e; }
            a { text-decoration: none; color: #0097e6; font-weight: bold; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>🏠 RealState Property Service API</h1>
          <p>Welcome! Visit <a href="/docs">Swagger Docs</a></p>
        </body>
      </html>
    `);
  }

  /**
   * GET /health
   *
   * Checks if API is running.
   *
   * @returns {{ hello: string }} - Health status
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    description: 'API status',
    schema: { example: { hello: 'Hello World' } },
  })
  check(): { hello: string } {
    return { hello: 'Hello World' };
  }
}
