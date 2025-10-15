import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  // Public health check
  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.http.pingCheck('auth-service', 'http://auth-serivce:3000/health'),
    ]);
  }
}
