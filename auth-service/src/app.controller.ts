import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

/**
 * AppController
 *
 * Handles public routes for the Auth Service.
 *
 * Routes:
 * - GET  /        → HTML welcome page
 * - GET  /health  → Health check
 */
@Controller()
@ApiTags('Public')
export class AppController {
  /**
   * GET /
   *
   * Returns a simple HTML landing page for the Auth Service.
   *
   * @param {Response} res - Express response object
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
          <title>Auth Service</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #f5f6fa; color: #2f3640; text-align: center; padding: 60px; }
            h1 { color: #40739e; }
            a { text-decoration: none; color: #0097e6; font-weight: bold; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>🔐 Auth Service Running</h1>
          <p>Welcome! Visit <a href="/docs">Swagger Docs</a></p>
        </body>
      </html>
    `);
  }

  /**
   * GET /health
   *
   * Returns a simple JSON object to confirm the API is running.
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
