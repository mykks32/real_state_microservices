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
  getAllPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties`;
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
  get pendingPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties/pending`;
  }

  /**
   * Fetch approved properties
   *
   * @readonly
   * @type {string}
   */
  get approvedPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties/approved`;
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
}
