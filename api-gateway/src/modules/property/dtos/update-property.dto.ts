import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TypeEnum } from '../enums/type.enum';
import { StatusEnum } from '../enums/status.enum';
import { Type } from 'class-transformer';
import { UpdateLocationDTO } from './update-location.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating property information
 *
 * @class UpdatePropertyDTO
 * @description Used for partial updates to property records. All fields are optional.
 * Supports updating property details, status, type, location, and owner assignment.
 *
 * @example
 * {
 *   title: "Updated Beautiful House in Kathmandu",
 *   description: "Recently renovated house with modern amenities",
 *   status: "Rented",
 *   location: {
 *     city: "Kathmandu",
 *     state: "Bagmati"
 *   }
 * }
 *
 * @example
 * {
 *   type: "House",
 *   ownerId: "b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw"
 * }
 */
export class UpdatePropertyDTO {
  /**
   * Property title or name
   */
  @ApiPropertyOptional({
    description: 'Property title or name',
    example: 'Updated Beautiful House in Kathmandu',
    maxLength: 150,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title?: string;

  /**
   * Detailed property description
   */
  @ApiPropertyOptional({
    description: 'Detailed property description',
    example:
      'Recently renovated house with modern amenities and beautiful garden',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  /**
   * Type of property
   */
  @ApiPropertyOptional({
    description: 'Type of property',
    enum: TypeEnum,
    example: TypeEnum.House,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TypeEnum, { message: 'Invalid property type' })
  type?: TypeEnum;

  /**
   * Current availability status of the property
   */
  @ApiPropertyOptional({
    description: 'Current availability status of the property',
    enum: StatusEnum,
    example: StatusEnum.Rented,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(StatusEnum, { message: 'Invalid property status' })
  status?: StatusEnum;

  /**
   * Location details update - partial updates supported
   */
  @ApiPropertyOptional({
    description: 'Location details update - partial updates supported',
    type: UpdateLocationDTO,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLocationDTO)
  location?: UpdateLocationDTO;

  /**
   * Unique identifier of the property owner
   */
  @ApiPropertyOptional({
    description: 'Unique identifier of the property owner',
    example: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Owner id must be a valid UUID' })
  ownerId?: string;
}
