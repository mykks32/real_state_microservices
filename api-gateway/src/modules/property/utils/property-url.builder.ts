import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class PropertyUrlBuilder {
  constructor(readonly configService: AppConfigService) {}
  /**
   * Create property URL built from the property service base URL.
   *
   * @readonly
   * @type {string}
   */
  get createPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties`;
  }

  /**
   * Update property URL built from the property service base URL.
   * @param {string} propertyId
   *
   * @returns string
   */
  updatePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}`;
  }

  /**
   * Get property by owner id url.
   *
   * @readonly
   * @type {string}
   */
  getPropertyByOwnerIdUrl(ownerId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/owner/${ownerId}`;
  }

  /**
   * Get All properties.
   *
   * @readonly
   * @type {string}
   */
  getAllPropertyUrl(page: number = 1, size: number = 10): string {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    return `${this.configService.propertyServiceUrl}/properties?${params.toString()}`;
  }

  /**
   * Get property by propertyId
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  getPropertyByPropertyId(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}`;
  }

  /**
   * Fetch pending properties
   *
   * @readonly
   * @type {string}
   */
  pendingPropertyUrl(page: number = 1, size: number = 10): string {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    return `${this.configService.propertyServiceUrl}/properties/pending?${params.toString()}`;
  }

  /**
   * Fetch approved properties
   *
   * @readonly
   * @type {string}
   */
  approvedPropertyUrl(page: number = 1, size: number = 10): string {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    return `${this.configService.propertyServiceUrl}/properties/approved?${params.toString()}`;
  }

  /**
   * Submit property approval URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  submitPropertyApprovalUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/submit`;
  }

  /**
   * Approve property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  approvePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/approve`;
  }

  /**
   * Reject property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  rejectPropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/reject`;
  }

  /**
   * Archive property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  archivePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/archive`;
  }

  /**
   * Delete property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  deletePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/delete/${propertyId}`;
  }

  /**
   * Delete property URL
   *
   * @private
   * @returns {string}
   * @param status
   * @param type
   * @param state
   * @param page
   * @param size
   */
  filterPropertiesUrl(
    status?: string,
    type?: string,
    state?: string,
    page: number = 1,
    size: number = 10,
  ): string {
    const params = new URLSearchParams();

    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (state) params.append('state', state);
    params.append('page', page.toString());
    params.append('size', size.toString());

    return `${this.configService.propertyServiceUrl}/properties/filter?${params.toString()}`;
  }

  /**
   * Create property URL built from the property service base URL.
   *
   * @readonly
   * @type {string}
   */
  get createAdminApprovedPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties/admin/create`;
  }
}
