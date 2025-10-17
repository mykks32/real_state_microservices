import { Module } from '@nestjs/common';
import { EnquiryController } from './enquiry.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../../config/config.module';
import { EnquiryUrlBuilder } from './utils/enquiry-url.builder';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EnquiryController],
  providers: [EnquiryUrlBuilder],
})
export class EnquiryModule {}
