import { NotFoundException } from '@nestjs/common';

export class EnquiryNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || 'Enquiry not found');
  }
}
