import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './enquiry.entity';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';
import { EnquiryStatus } from './enquiry-status.enum';
import { IEnquiry } from './enquiry.interface';

@Injectable()
export class EnquiryService {
  private readonly logger = new Logger(EnquiryService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  // Helper to map entity to interface
  private mapEntityToInterface(enquiry: Enquiry): IEnquiry {
    const { enquiry_id, property_id, user_id, message, status, createdAt } =
      enquiry;
    return { enquiry_id, property_id, user_id, message, status, createdAt };
  }

  /**
   * Fetches all enquiries from the database.
   *
   * @returns {Promise<IEnquiry[]>} - Array of enquiries mapped to IEnquiry
   */
  async getEnquiries(): Promise<IEnquiry[]> {
    const enquiries = await this.enquiryRepository.find();

    this.logger.log(
      enquiries.length > 0
        ? `Enquiries received: ${enquiries.length}`
        : 'No enquiries found',
    );

    // map entities to interface safely
    return enquiries.map((enquiry) => this.mapEntityToInterface(enquiry));
  }

  /**
   * Create a new Enquiry for a Property.
   *
   * @param createEnquiryDto - Data transfer object containing:
   *   - property_id: UUID of the property
   *   - user_id: UUID of the user making the enquiry
   *   - message: Optional message from the user
   *
   * @returns {Promise<IEnquiry>} The created enquiry mapped to IEnquiry.
   */
  async createEnquiry(createEnquiryDto: CreateEnquiryDto): Promise<IEnquiry> {
    try {
      const { property_id, user_id, message } = createEnquiryDto;

      const enquiry = this.enquiryRepository.create({
        property_id,
        user_id,
        message: message || '',
        status: EnquiryStatus.IN_PROGRESS,
      });

      const savedEnquiry = await this.enquiryRepository.save(enquiry);
      return this.mapEntityToInterface(savedEnquiry);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * Get all Enquiry for a Property
   *
   * @param property_id - Property id
   *
   * @returns {Promise<IEnquiry[]>} All the Enquiries of the property
   */
  async getPropertyEnquiryById(property_id: string): Promise<IEnquiry[]> {
    const enquiries = await this.enquiryRepository.find({
      where: { property_id }, // change to propertyId if entity uses camelCase
    });

    if (!enquiries || enquiries.length === 0) {
      this.logger.warn(`No enquiries found for propertyId=${property_id}`);
      throw new NotFoundException(
        `No enquiries found for propertyId=${property_id}`,
      );
    }

    this.logger.log(`Enquiries received: ${enquiries.length}`);

    return enquiries.map((enquiry) => this.mapEntityToInterface(enquiry));
  }
}
