import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './enquiry.entity';

@Injectable()
export class EnquiryService {
  private readonly logger = new Logger(EnquiryService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  /**
   * Fetches all enquiries from the database.
   *
   * @returns {Promise<ApiResponse<Enquiry[]>>} - Wrapped response with success status, message, and data.
   */
  async getEnquiries(): Promise<Enquiry[]> {
    const enquiries = await this.enquiryRepository.find();

    if (enquiries.length > 0) {
      this.logger.log(`Enquiries received: ${enquiries.length}`);
    } else {
      this.logger.log(`No enquiries found`);
    }

    return enquiries;
  }
}
