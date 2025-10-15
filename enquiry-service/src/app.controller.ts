import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getPublic() {
    return { hello: 'Hello World' };
  }
}
