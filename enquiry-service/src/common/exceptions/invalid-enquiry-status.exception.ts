import { BadRequestException } from '@nestjs/common';

export class InvalidEnquiryStatusException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'Invalid enquiry status');
  }
}
