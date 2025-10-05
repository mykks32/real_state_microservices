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
 * Service responsible for managing Enquiries.
 *
 * Provides methods to create, fetch, and update Enquiries.
 */
@Injectable()
export class EnquiryService {
  private readonly logger = new Logger(EnquiryService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  /**
   * Maps a TypeORM Enquiry entity to the IEnquiry interface.
   *
   * @param {Enquiry} enquiry - The Enquiry entity to map
   * @returns {IEnquiry} - The mapped enquiry interface
   */
  private mapEntityToInterface(enquiry: Enquiry): IEnquiry {
    const { enquiry_id, property_id, user_id, message, status, createdAt } =
      enquiry;
    return { enquiry_id, property_id, user_id, message, status, createdAt };
  }

  /**
   * Retrieves all enquiries from the database.
   *
   * @returns {Promise<IEnquiry[]>} - Array of all enquiries
   */
  async getEnquiries(): Promise<IEnquiry[]> {
    const enquiries = await this.enquiryRepository.find();

    this.logger.log(
      enquiries.length > 0
        ? `Enquiries retrieved: ${enquiries.length}`
        : 'No enquiries found',
    );

    return enquiries.map((entity) => this.mapEntityToInterface(entity));
  }

  /**
   * Creates a new enquiry for a property.
   *
   * @param {CreateEnquiryDto} createEnquiryDto - DTO containing property_id, user_id, and optional message
   * @returns {Promise<IEnquiry>} - The created enquiry
   */
  async createEnquiry(createEnquiryDto: CreateEnquiryDto): Promise<IEnquiry> {
    const { property_id, user_id, message } = createEnquiryDto;

    const enquiry = this.enquiryRepository.create({
      property_id,
      user_id,
      message: message || '',
      status: EnquiryStatus.IN_PROGRESS,
    });

    const savedEnquiry = await this.enquiryRepository.save(enquiry);
    this.logger.log(
      `Enquiry created successfully: enquiry_id=${savedEnquiry.enquiry_id}`,
    );
    return this.mapEntityToInterface(savedEnquiry);
  }

  /**
   * Retrieves all enquiries for a specific property.
   *
   * @param {string} property_id - UUID of the property
   * @returns {Promise<IEnquiry[]>} - Array of enquiries for the property
   * @throws {EnquiryNotFoundException} - If no enquiries are found
   */
  async getPropertyEnquiryById(property_id: string): Promise<IEnquiry[]> {
    const enquiries = await this.enquiryRepository.find({
      where: { property_id },
    });

    if (!enquiries.length) {
      this.logger.warn(`No enquiries found for property_id=${property_id}`);
      throw new EnquiryNotFoundException(
        `No enquiries found for property_id=${property_id}`,
      );
    }

    this.logger.log(
      `Enquiries retrieved for property_id=${property_id}: ${enquiries.length}`,
    );
    return enquiries.map((enquiry) => this.mapEntityToInterface(enquiry));
  }

  /**
   * Retrieves an enquiry by its ID.
   *
   * @param {string} enquiry_id - UUID of the enquiry
   * @returns {Promise<IEnquiry>} - The enquiry matching the ID
   * @throws {EnquiryNotFoundException} - If the enquiry is not found
   */
  async getEnquiryById(enquiry_id: string): Promise<IEnquiry> {
    const enquiry = await this.enquiryRepository.findOne({
      where: { enquiry_id },
    });
    if (!enquiry) {
      throw new EnquiryNotFoundException(
        `Enquiry with ID ${enquiry_id} not found`,
      );
    }
    return this.mapEntityToInterface(enquiry);
  }

  /**
   * Updates the status of an existing enquiry.
   *
   * @param {string} enquiry_id - UUID of the enquiry
   * @param {EnquiryStatus} status - New status to set
   * @returns {Promise<IEnquiry>} - The updated enquiry
   * @throws {InvalidEnquiryStatusException} - If the status is invalid
   * @throws {EnquiryNotFoundException} - If the enquiry is not found
   */
  async changeEnquiryStatus(
    enquiry_id: string,
    status: EnquiryStatus,
  ): Promise<IEnquiry> {
    if (!Object.values(EnquiryStatus).includes(status)) {
      throw new InvalidEnquiryStatusException(`Invalid status: ${status}`);
    }

    const enquiry = await this.enquiryRepository.findOne({
      where: { enquiry_id },
    });
    if (!enquiry) {
      throw new EnquiryNotFoundException(
        `Enquiry with ID ${enquiry_id} not found`,
      );
    }

    enquiry.status = status;
    const updatedEnquiry = await this.enquiryRepository.save(enquiry);

    this.logger.log(
      `Enquiry status updated: enquiry_id=${enquiry_id}, status=${status}`,
    );
    return this.mapEntityToInterface(updatedEnquiry);
  }
}
