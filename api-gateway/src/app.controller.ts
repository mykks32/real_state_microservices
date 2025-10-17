import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGatewayGuard } from './common/guards/jwt.guard';
import {
  RequestWithUserContext,
  UserPayload,
} from './common/types/request-with-context.type';
import { Role } from './common/enums/role.enum';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Public')
export class AppController {
  // Secured route
  @Get('hello')
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('realState_token')
  @Roles(Role.ADMIN)
  getHello(@Req() req: RequestWithUserContext): UserPayload | null {
    return req.user ?? null;
  }

  // Public health check
  @Get('health')
  check() {
    return { hello: 'Hello World' };
  }
}
