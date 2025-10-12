import { Module } from '@nestjs/common';
import { EnquiryController } from './enquiry.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EnquiryController],
})
export class EnquiryModule {}
