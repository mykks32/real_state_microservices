import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGatewayGuard } from './common/guards/jwt.guard';
import {
  RequestWithUserContext,
  UserPayload,
} from './common/types/request-with-context.type';
import { Role } from './common/enums/role.enum';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}
  // Secured route
  @Get('hello')
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getHello(@Req() req: RequestWithUserContext): UserPayload | null {
    return req.user ?? null;
  }

  // // Public route
  // @Get('health')
  // // @UseGuards(JwtGatewayGuard, RolesGuard)
  // // @Roles(Role.SELLER)
  // getPublic() {
  //   return { hello: 'Hello World' };
  // }
  // Public health check
  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.http.pingCheck('api-gateway', 'http://api-gateway:4000/health'),
    ]);
  }
}
