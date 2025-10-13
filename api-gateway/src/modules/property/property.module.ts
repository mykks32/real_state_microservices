import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PropertyController],
})
export class PropertyModule {}
