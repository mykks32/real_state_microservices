import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Public health check
  @Get('health')
  check() {
    return { hello: 'Hello World' };
  }
}
