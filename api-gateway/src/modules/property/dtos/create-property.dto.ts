import { IsEnum, IsUUID } from 'class-validator';
import { RequestCreatePropertyDTO } from './request-create-property.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovalStatusEnum } from '../enums/approval-status.enum';

/**
 * Data Transfer Object for creating a new property with owner association
 *
 * @class CreatePropertyDTO
 * @extends RequestCreatePropertyDTO
 * @description Used for creating property records with owner identification.
 * Extends the base property creation DTO to include owner UUID.
 *
 * @example
 * {
 *   ownerId: "a1b2c3d4-5678-90ef-ghij-klmnopqrstuv",
 *   title: "Beautiful Modern Apartment in Downtown",
 *   description: "A stunning 2-bedroom apartment with city views",
 *   type: "APARTMENT",
 *   status: "AVAILABLE",
 *   approvalStatus: "DRAFT",
 *   location: {
 *     address: "123 Main Street",
 *     city: "New York",
 *     state: "NY",
 *     country: "USA",
 *     zipcode: 10001,
 *     latitude: 40.7128,
 *     longitude: -74.0060
 *   }
 * }
 */
export class CreatePropertyDTO extends RequestCreatePropertyDTO {
  /**
   * Unique identifier of the property owner
   * Must be a valid UUID v4
   */
  @ApiProperty({
    description: 'Unique identifier of the property owner',
    example: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Owner id must be a valid UUID' })
  ownerId: string;

  /**
   * Approval workflow status
   */
  @ApiProperty({
    description: 'Approval workflow status',
    enum: ApprovalStatusEnum,
    example: ApprovalStatusEnum.Draft,
    default: ApprovalStatusEnum.Draft,
  })
  @IsEnum(ApprovalStatusEnum, {
    message: 'Property approvalStatus is required',
  })
  approvalStatus: ApprovalStatusEnum = ApprovalStatusEnum.Draft;
}
