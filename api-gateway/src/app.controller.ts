// app.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  JwtGatewayGuard,
  RequestWithUser,
  AuthenticatedUser,
} from './common/guards/jwt.guard';

@Controller()
export class AppController {
  // Secured route
  @Get('hello')
  @UseGuards(JwtGatewayGuard)
  getHello(@Req() req: RequestWithUser): AuthenticatedUser | null {
    return req.user ?? null;
  }

  // Public route
  @Get('public')
  getPublic() {
    return 'Hello World';
  }
}