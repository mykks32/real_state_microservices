import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './enquiry.entity';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';
import { EnquiryStatus } from './enquiry-status.enum';
import { IEnquiry } from './enquiry.interface';
import { EnquiryNotFoundException } from 'src/common/exceptions/enquiry-not-found.exception';
import { InvalidEnquiryStatusException } from 'src/common/exceptions/invalid-enquiry-status.exception';

/**
 * Service responsible for managing enquiries.
 */
@Injectable()
export class EnquiryService {
  private readonly logger = new Logger(EnquiryService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  /**
   * Maps TypeORM Enquiry entity to IEnquiry interface.
   * @param enquiry Enquiry entity
   * @returns IEnquiry
   */
  private mapEntityToInterface(enquiry: Enquiry): IEnquiry {
    const { enquiry_id, property_id, user_id, message, status, createdAt } =
      enquiry;
    return { enquiry_id, property_id, user_id, message, status, createdAt };
  }

  /**
   * Get paginated list of all enquiries.
   * @param page Current page number
   * @param limit Number of items per page
   * @returns Object containing items and total count
   */
  async getEnquiriesPaginated(
    page: number,
    limit: number,
  ): Promise<{ items: IEnquiry[]; total: number }> {
    const [enquiries, total] = await this.enquiryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: enquiries.map((enquiry) => this.mapEntityToInterface(enquiry)),
      total,
    };
  }

  /**
   * Creates a new enquiry.
   * @param createEnquiryDto DTO containing property_id, user_id, and optional message
   * @returns Created enquiry
   */
  async createEnquiry(createEnquiryDto: CreateEnquiryDto): Promise<IEnquiry> {
    const enquiry = this.enquiryRepository.create({
      ...createEnquiryDto,
      status: EnquiryStatus.IN_PROGRESS,
    });

    const savedEnquiry = await this.enquiryRepository.save(enquiry);
    this.logger.log(`Enquiry created: enquiry_id=${savedEnquiry.enquiry_id}`);
    return this.mapEntityToInterface(savedEnquiry);
  }

  /**
   * Get paginated enquiries for a specific property.
   * @param property_id UUID of the property
   * @param page Current page number
   * @param limit Number of items per page
   * @returns Object containing items and total count
   * @throws EnquiryNotFoundException if no enquiries found
   */
  async getPropertyEnquiryById(
    property_id: string,
    page: number,
    limit: number,
  ) {
    const [enquiries, total] = await this.enquiryRepository.findAndCount({
      where: { property_id },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    if (!total)
      throw new EnquiryNotFoundException(
        `No enquiries found for property_id=${property_id}`,
      );
    return {
      items: enquiries.map((enquiry) => this.mapEntityToInterface(enquiry)),
      total,
    };
  }

  /**
   * Retrieves an enquiry by ID.
   * @param enquiry_id UUID of the enquiry
   * @returns Enquiry object
   * @throws EnquiryNotFoundException if enquiry is not found
   */
  async getEnquiryById(enquiry_id: string): Promise<IEnquiry> {
    const enquiry = await this.enquiryRepository.findOne({
      where: { enquiry_id },
    });
    if (!enquiry)
      throw new EnquiryNotFoundException(
        `Enquiry with ID ${enquiry_id} not found`,
      );
    return this.mapEntityToInterface(enquiry);
  }

  /**
   * Updates the status of an enquiry.
   * @param enquiry_id UUID of the enquiry
   * @param status New status
   * @returns Updated enquiry
   * @throws InvalidEnquiryStatusException if status is invalid
   * @throws EnquiryNotFoundException if enquiry is not found
   */
  async changeEnquiryStatus(
    enquiry_id: string,
    status: EnquiryStatus,
  ): Promise<IEnquiry> {
    if (!Object.values(EnquiryStatus).includes(status))
      throw new InvalidEnquiryStatusException(`Invalid status: ${status}`);

    const enquiry = await this.enquiryRepository.findOne({
      where: { enquiry_id },
    });
    if (!enquiry)
      throw new EnquiryNotFoundException(
        `Enquiry with ID ${enquiry_id} not found`,
      );

    enquiry.status = status;
    const updated = await this.enquiryRepository.save(enquiry);
    return this.mapEntityToInterface(updated);
  }
}
