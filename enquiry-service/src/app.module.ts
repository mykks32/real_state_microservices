import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './database/database.module';
import { EnquiryModule } from './enquiry/enquiry.module';

@Module({
  imports: [DBModule, EnquiryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
