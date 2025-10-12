import { Module } from '@nestjs/common';
import { EnquiryController } from './enquiry.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EnquiryController],
})
export class EnquiryModule {}
