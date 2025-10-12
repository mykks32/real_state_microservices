import { Controller, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('enquiry')
export class EnquiryController {
  private readonly logger = new Logger(EnquiryController.name);
  private readonly CREATE_ENQUIRY = 'CREATE_ENQUIRY';

  constructor(private readonly httpService: HttpService) {}
}
