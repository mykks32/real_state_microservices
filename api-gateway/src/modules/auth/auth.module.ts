import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../../config/config.module';

/**
 * AuthModule
 *
 * @description
 * Handles auth-service routes at the API Gateway.
 * Forwards requests and normalizes responses only.
 *
 * @remarks
 * - Communicates with `auth-service` via HttpModule.
 * - Stateless: no providers or business logic.
 */
@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController],
})
export class AuthModule {}
