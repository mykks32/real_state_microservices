import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class EnquiryUrlBuilder {
  constructor(readonly configService: AppConfigService) {}
  /**
   * Create enquiry URL built from the enquiry service base URL.
   *
   * @readonly
   * @type {string}
   */
  get createEnquiryUrl(): string {
    return `${this.configService.enquiryServiceUrl}/enquiry`;
  }

  /**
   * Create enquiry URL built from the enquiry service base URL.
   *
   * @readonly
   * @type {string}
   */
  getEnquiryByIdUrl(id: string): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/${id}`;
  }

  /**
   * Get all the enquiry
   *
   * @param {number} page
   * @param {number} limit
   *
   * @returns {string}
   */
  getAllEnquiryUrl(page?: number, limit?: number): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/all?page=${page}&limit=${limit}`;
  }

  /**
   * Get Enquiries by propertyId
   *
   * @param {string} propertyId
   * @param {number} page
   * @param {number} limit
   * @returns {string}
   */
  getEnquiryByPropertyId(
    propertyId: string,
    page?: number,
    limit?: number,
  ): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/property/${propertyId}?page=${page}&limit=${limit}`;
  }

  /**
   * Change Enquiry status by enquiryId
   *
   * @param {string} enquiryId
   * @returns {string}
   */
  changeEnquiryStatusByEnquiryId(enquiryId: string): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/${enquiryId}/status`;
  }
}
